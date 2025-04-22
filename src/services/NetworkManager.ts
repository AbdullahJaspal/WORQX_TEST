import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
const checkInternetAccess = async ({
  timeout,
  url,
}: {
  timeout: number;
  url: string;
}): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const signal = controller.signal;
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    await fetch(url, {method: 'HEAD', signal});
    clearTimeout(timeoutId);
    return true;
  } catch {
    return false;
  }
};

class NetworkManager {
  private static instance: NetworkManager;
  private listeners: Array<(isConnected: boolean) => void> = [];
  private isConnected: boolean = true;
  private isCheckingConnection: boolean = false;
  private netInfoUnsubscribe: () => void = () => {};

  private constructor() {
    this.initialize();
  }

  static getInstance(): NetworkManager {
    if (!NetworkManager.instance) {
      NetworkManager.instance = new NetworkManager();
    }
    return NetworkManager.instance;
  }

  private async initialize() {
    // Get initial state
    const state = await NetInfo.fetch();
    this.handleConnectivityChange(state);

    // Subscribe to future changes
    this.netInfoUnsubscribe = NetInfo.addEventListener(
      this.handleConnectivityChange,
    );
  }

  private handleConnectivityChange = async (state: NetInfoState) => {
    if (this.isCheckingConnection) return;
    this.isCheckingConnection = true;

    try {
      let isConnected = false;

      // If device says we're connected, verify with a ping
      if (state.isConnected) {
        isConnected = await checkInternetAccess({
          timeout: 3000,
          url: 'https://www.google.com',
        });
      }

      if (this.isConnected !== isConnected) {
        this.isConnected = isConnected;
        this.notifyListeners();
      }
    } catch (error) {
      console.log('Error checking connection:', error);
      this.isConnected = false;
      this.notifyListeners();
    } finally {
      this.isCheckingConnection = false;
    }
  };

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.isConnected));
  }

  public addListener(listener: (isConnected: boolean) => void): () => void {
    this.listeners.push(listener);

    // Return function to remove this listener
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public getCurrentStatus(): boolean {
    return this.isConnected;
  }

  public checkConnection(): Promise<boolean> {
    return new Promise(async resolve => {
      try {
        const isConnected = await checkInternetAccess({
          timeout: 3000,
          url: 'https://www.google.com',
        });

        if (this.isConnected !== isConnected) {
          this.isConnected = isConnected;
          this.notifyListeners();
        }

        resolve(isConnected);
      } catch (error) {
        console.log('Manual connection check error:', error);
        this.isConnected = false;
        this.notifyListeners();
        resolve(false);
      }
    });
  }

  public cleanup() {
    this.netInfoUnsubscribe();
    this.listeners = [];
  }
}

export default NetworkManager;
