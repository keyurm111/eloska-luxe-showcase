// Backend warmup utility to prevent cold starts on Render

interface BackendStatus {
  isOnline: boolean;
  lastCheck: Date;
  responseTime: number;
  error?: string;
}

class BackendWarmup {
  private status: BackendStatus = {
    isOnline: false,
    lastCheck: new Date(),
    responseTime: 0
  };

  private checkInterval: NodeJS.Timeout | null = null;
  private readonly API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5004/api';
  private readonly CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.warmup();
    this.startPeriodicChecks();
  }

  // Initial warmup when admin panel loads
  async warmup(): Promise<void> {
    console.log('🔥 Starting backend warmup for Admin Panel...');
    await this.checkBackendHealth();
  }

  // Check backend health
  async checkBackendHealth(): Promise<BackendStatus> {
    const startTime = Date.now();
    
    try {
      console.log('🏥 Checking backend health from Admin Panel...');
      
      const response = await fetch(`${this.API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Short timeout for health checks
        signal: AbortSignal.timeout(10000)
      });

      const responseTime = Date.now() - startTime;

      if (response.ok) {
        const data = await response.json();
        
        // Enhanced console logging with styling
        console.log('%c✅ Backend is healthy! (Admin Panel)', 'color: #10B981; font-weight: bold; font-size: 14px;');
        console.log('%c📊 Backend Status:', 'color: #3B82F6; font-weight: bold;');
        console.table({
          'Status': data.status || 'OK',
          'Response Time': `${responseTime}ms`,
          'Uptime': data.uptime ? `${Math.round(data.uptime / 60)} minutes` : 'Unknown',
          'Last Check': new Date().toLocaleTimeString(),
          'API URL': this.API_BASE_URL,
          'Source': 'Admin Panel'
        });

        this.status = {
          isOnline: true,
          lastCheck: new Date(),
          responseTime
        };
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      
      console.warn('%c⚠️ Backend health check failed! (Admin Panel)', 'color: #F59E0B; font-weight: bold; font-size: 14px;');
      console.warn('%c🔍 Error Details:', 'color: #EF4444; font-weight: bold;');
      console.table({
        'Error': error.message,
        'Response Time': `${responseTime}ms`,
        'API URL': `${this.API_BASE_URL}/health`,
        'Last Check': new Date().toLocaleTimeString(),
        'Source': 'Admin Panel'
      });

      this.status = {
        isOnline: false,
        lastCheck: new Date(),
        responseTime,
        error: error.message
      };
    }

    return this.status;
  }

  // Start periodic health checks
  startPeriodicChecks(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    this.checkInterval = setInterval(async () => {
      console.log('🔄 Periodic backend health check from Admin Panel...');
      await this.checkBackendHealth();
    }, this.CHECK_INTERVAL);

    console.log(`⏰ Started periodic health checks every ${this.CHECK_INTERVAL / 1000} seconds (Admin Panel)`);
  }

  // Stop periodic checks
  stopPeriodicChecks(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      console.log('⏹️ Stopped periodic health checks (Admin Panel)');
    }
  }

  // Get current status
  getStatus(): BackendStatus {
    return { ...this.status };
  }

  // Check if backend is ready for API calls
  isBackendReady(): boolean {
    const timeSinceLastCheck = Date.now() - this.status.lastCheck.getTime();
    const isRecentCheck = timeSinceLastCheck < 60000; // 1 minute
    
    return this.status.isOnline && isRecentCheck;
  }

  // Warm up specific API endpoints
  async warmupEndpoints(): Promise<void> {
    if (!this.isBackendReady()) {
      console.log('🔄 Backend not ready, warming up first... (Admin Panel)');
      await this.checkBackendHealth();
    }

    if (this.isBackendReady()) {
      console.log('🚀 Backend is ready for API calls! (Admin Panel)');
    } else {
      console.warn('⚠️ Backend is not ready, API calls may fail (Admin Panel)');
    }
  }
}

// Create singleton instance
const backendWarmup = new BackendWarmup();

// Export functions
export const warmupBackend = () => backendWarmup.warmup();
export const checkBackendHealth = () => backendWarmup.checkBackendHealth();
export const isBackendReady = () => backendWarmup.isBackendReady();
export const warmupEndpoints = () => backendWarmup.warmupEndpoints();
export const getBackendStatus = () => backendWarmup.getStatus();

// Auto-warmup on module load
if (typeof window !== 'undefined') {
  console.log('🌐 Backend warmup initialized for Admin Panel');
  warmupBackend();
}
