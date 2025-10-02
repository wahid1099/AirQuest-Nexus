import { dataService } from "./dataService";
import { authService } from "./authService";
import { offlineService } from "./offlineService";

interface AnalyticsEvent {
  event_type: string;
  event_data: Record<string, any>;
  session_id?: string;
  timestamp?: Date;
  user_agent?: string;
  location?: {
    latitude?: number;
    longitude?: number;
    city?: string;
    country?: string;
  };
}

interface UserSession {
  id: string;
  startTime: Date;
  lastActivity: Date;
  pageViews: number;
  events: AnalyticsEvent[];
  userAgent: string;
  referrer: string;
  location?: GeolocationPosition;
}

interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  timeToInteractive: number;
}

class AnalyticsService {
  private currentSession: UserSession | null = null;
  private eventQueue: AnalyticsEvent[] = [];
  private performanceMetrics: Partial<PerformanceMetrics> = {};
  private isInitialized = false;
  private batchSize = 10;
  private flushInterval = 30000; // 30 seconds
  private flushTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (this.isInitialized) return;

    // Create new session
    this.startSession();

    // Set up event listeners
    this.setupEventListeners();

    // Set up performance monitoring
    this.setupPerformanceMonitoring();

    // Set up periodic flushing
    this.setupPeriodicFlush();

    // Track initial page load
    this.trackEvent("page_load", {
      url: window.location.href,
      referrer: document.referrer,
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      connection_type: this.getConnectionType(),
      device_type: this.getDeviceType(),
    });

    this.isInitialized = true;
  }

  private startSession() {
    this.currentSession = {
      id: this.generateSessionId(),
      startTime: new Date(),
      lastActivity: new Date(),
      pageViews: 1,
      events: [],
      userAgent: navigator.userAgent,
      referrer: document.referrer,
    };

    // Try to get user location (with permission)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (this.currentSession) {
            this.currentSession.location = position;
            this.trackEvent("location_acquired", {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
            });
          }
        },
        (error) => {
          this.trackEvent("location_error", {
            error: error.message,
            code: error.code,
          });
        },
        { timeout: 10000, maximumAge: 300000 }
      );
    }
  }

  private setupEventListeners() {
    // Page visibility changes
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.trackEvent("page_hidden", {
          session_duration: this.getSessionDuration(),
        });
        this.flush(); // Flush events before page becomes hidden
      } else {
        this.trackEvent("page_visible", {
          session_duration: this.getSessionDuration(),
        });
      }
    });

    // Before unload
    window.addEventListener("beforeunload", () => {
      this.trackEvent("page_unload", {
        session_duration: this.getSessionDuration(),
        page_views: this.currentSession?.pageViews || 0,
      });
      this.flush();
    });

    // Error tracking
    window.addEventListener("error", (event) => {
      this.trackEvent("javascript_error", {
        message: event.message,
        filename: event.filename,
        line_number: event.lineno,
        column_number: event.colno,
        stack: event.error?.stack,
      });
    });

    // Unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      this.trackEvent("unhandled_promise_rejection", {
        reason: event.reason?.toString(),
        stack: event.reason?.stack,
      });
    });

    // Network status changes
    window.addEventListener("online", () => {
      this.trackEvent("network_online", {
        connection_type: this.getConnectionType(),
      });
    });

    window.addEventListener("offline", () => {
      this.trackEvent("network_offline", {});
    });

    // User interactions
    document.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === "BUTTON" || target.closest("button")) {
        const button =
          target.tagName === "BUTTON" ? target : target.closest("button");
        this.trackEvent("button_click", {
          button_text: button?.textContent?.trim() || "",
          button_id: button?.id || "",
          button_class: button?.className || "",
          page_url: window.location.href,
        });
      }
    });

    // Form submissions
    document.addEventListener("submit", (event) => {
      const form = event.target as HTMLFormElement;
      this.trackEvent("form_submit", {
        form_id: form.id || "",
        form_class: form.className || "",
        form_action: form.action || "",
        form_method: form.method || "GET",
        page_url: window.location.href,
      });
    });
  }

  private setupPerformanceMonitoring() {
    // Wait for page load to complete
    window.addEventListener("load", () => {
      setTimeout(() => {
        this.collectPerformanceMetrics();
      }, 1000);
    });

    // Web Vitals monitoring
    if ("PerformanceObserver" in window) {
      // Largest Contentful Paint
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.performanceMetrics.largestContentfulPaint = lastEntry.startTime;
      }).observe({ entryTypes: ["largest-contentful-paint"] });

      // First Input Delay
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry: any) => {
          this.performanceMetrics.firstInputDelay =
            entry.processingStart - entry.startTime;
        });
      }).observe({ entryTypes: ["first-input"] });

      // Cumulative Layout Shift
      new PerformanceObserver((entryList) => {
        let clsValue = 0;
        entryList.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.performanceMetrics.cumulativeLayoutShift = clsValue;
      }).observe({ entryTypes: ["layout-shift"] });
    }
  }

  private collectPerformanceMetrics() {
    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType("paint");

    if (navigation) {
      this.performanceMetrics.loadTime =
        navigation.loadEventEnd - navigation.navigationStart;
      this.performanceMetrics.timeToInteractive =
        navigation.domInteractive - navigation.navigationStart;
    }

    const fcp = paint.find((entry) => entry.name === "first-contentful-paint");
    if (fcp) {
      this.performanceMetrics.firstContentfulPaint = fcp.startTime;
    }

    // Track performance metrics
    this.trackEvent("performance_metrics", this.performanceMetrics);
  }

  private setupPeriodicFlush() {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getSessionDuration(): number {
    if (!this.currentSession) return 0;
    return Date.now() - this.currentSession.startTime.getTime();
  }

  private getConnectionType(): string {
    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;
    return connection?.effectiveType || "unknown";
  }

  private getDeviceType(): string {
    const userAgent = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      return "tablet";
    }
    if (
      /mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(
        userAgent
      )
    ) {
      return "mobile";
    }
    return "desktop";
  }

  // Public API
  trackEvent(eventType: string, eventData: Record<string, any> = {}) {
    const event: AnalyticsEvent = {
      event_type: eventType,
      event_data: {
        ...eventData,
        session_id: this.currentSession?.id,
        session_duration: this.getSessionDuration(),
        page_url: window.location.href,
        timestamp: new Date().toISOString(),
      },
      session_id: this.currentSession?.id,
      timestamp: new Date(),
      user_agent: navigator.userAgent,
    };

    // Add location if available
    if (this.currentSession?.location) {
      event.location = {
        latitude: this.currentSession.location.coords.latitude,
        longitude: this.currentSession.location.coords.longitude,
      };
    }

    this.eventQueue.push(event);
    this.currentSession?.events.push(event);

    // Update last activity
    if (this.currentSession) {
      this.currentSession.lastActivity = new Date();
    }

    // Auto-flush if queue is full
    if (this.eventQueue.length >= this.batchSize) {
      this.flush();
    }

    console.log("Analytics Event:", eventType, eventData);
  }

  trackPageView(url: string, title?: string) {
    this.trackEvent("page_view", {
      url,
      title: title || document.title,
      referrer: document.referrer,
    });

    if (this.currentSession) {
      this.currentSession.pageViews++;
    }
  }

  trackUserAction(action: string, details: Record<string, any> = {}) {
    this.trackEvent("user_action", {
      action,
      ...details,
    });
  }

  trackGameEvent(eventType: string, gameData: Record<string, any> = {}) {
    this.trackEvent("game_event", {
      game_event_type: eventType,
      ...gameData,
    });
  }

  trackError(error: Error, context?: Record<string, any>) {
    this.trackEvent("application_error", {
      error_message: error.message,
      error_stack: error.stack,
      error_name: error.name,
      context: context || {},
    });
  }

  trackTiming(name: string, duration: number, category?: string) {
    this.trackEvent("timing", {
      timing_name: name,
      timing_duration: duration,
      timing_category: category || "general",
    });
  }

  // Flush events to server
  private async flush() {
    if (this.eventQueue.length === 0) return;

    const eventsToSend = [...this.eventQueue];
    this.eventQueue = [];

    try {
      // If offline, queue for later
      if (offlineService.isOffline) {
        eventsToSend.forEach((event) => {
          offlineService.queueAction("telemetry", event);
        });
        return;
      }

      // Send events in batches
      for (const event of eventsToSend) {
        try {
          await dataService.logTelemetry({
            event_type: event.event_type,
            event_data: event.event_data,
            session_id: event.session_id,
          });
        } catch (error) {
          console.error("Failed to send analytics event:", error);
          // Re-queue failed events for offline service
          offlineService.queueAction("telemetry", event);
        }
      }
    } catch (error) {
      console.error("Analytics flush failed:", error);
      // Re-add events to queue for retry
      this.eventQueue.unshift(...eventsToSend);
    }
  }

  // Manual flush
  async forceFlush() {
    await this.flush();
  }

  // Get session info
  getSessionInfo() {
    return {
      session: this.currentSession,
      queueSize: this.eventQueue.length,
      performanceMetrics: this.performanceMetrics,
    };
  }

  // Set user properties
  setUserProperties(properties: Record<string, any>) {
    this.trackEvent("user_properties_updated", properties);
  }

  // Track custom conversion events
  trackConversion(conversionType: string, value?: number, currency?: string) {
    this.trackEvent("conversion", {
      conversion_type: conversionType,
      conversion_value: value,
      conversion_currency: currency || "USD",
    });
  }

  // Clean up
  destroy() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }

    this.flush(); // Final flush
    this.isInitialized = false;
  }
}

// Create singleton instance
export const analyticsService = new AnalyticsService();

// Global error handler
window.addEventListener("error", (event) => {
  analyticsService.trackError(event.error, {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
  });
});

export default analyticsService;
