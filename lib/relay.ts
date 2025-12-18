import { Event } from './events';

export interface RelayMessage {
  type: string;
  payload?: Event | any;
  timestamp?: string;
  error?: string;
}

type MessageListener = (msg: RelayMessage) => void;

/**
 * Relay implementation with WebSocket support
 * Falls back to mock if WebSocket URL is not valid
 */
export class MockRelay {
  private url: string;
  private listeners: MessageListener[] = [];
  public connected: boolean = false;
  private mockInterval?: NodeJS.Timeout;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;

  constructor(url: string) {
    this.url = url;
    this._connect();
  }

  private _connect() {
    // Check if URL is a valid WebSocket URL
    if (this.url && (this.url.startsWith('ws://') || this.url.startsWith('wss://'))) {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          this.connected = true;
          this.reconnectAttempts = 0;
          this._emit({ type: 'relay:connected', timestamp: new Date().toISOString() });
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'event' && data.payload) {
              this._emit({ type: 'event', payload: data.payload });
            } else {
              this._emit(data);
            }
          } catch (error) {
            console.error('Error parsing relay message:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this._emit({ type: 'relay:error', error: 'Connection error' });
        };

        this.ws.onclose = () => {
          this.connected = false;
          this._emit({ type: 'relay:disconnected', timestamp: new Date().toISOString() });
          this._attemptReconnect();
        };
      } catch (error) {
        console.warn('WebSocket connection failed, using mock mode:', error);
        this._startMockMode();
      }
    } else {
      // Use mock mode for invalid URLs
      this._startMockMode();
    }
  }

  private _startMockMode() {
    setTimeout(() => {
      this.connected = true;
      this._emit({ type: 'relay:welcome', timestamp: new Date().toISOString() });
    }, 400);
  }

  private _attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
        this._connect();
      }, this.reconnectDelay);
    } else {
      console.error('Max reconnection attempts reached. Using mock mode.');
      this._startMockMode();
    }
  }

  _emit(msg: RelayMessage) {
    this.listeners.forEach((listener) => listener(msg));
  }

  onMessage(fn: MessageListener) {
    this.listeners.push(fn);
  }

  publish(event: Event) {
    if (this.ws && this.connected && this.ws.readyState === WebSocket.OPEN) {
      // Send via WebSocket
      try {
        this.ws.send(JSON.stringify({ type: 'publish', event }));
      } catch (error) {
        console.error('Error sending event via WebSocket:', error);
        // Fallback to mock echo
        setTimeout(() => this._emit({ type: 'event', payload: event }), 300);
      }
    } else {
      // Mock implementation: echo back the event
      setTimeout(() => this._emit({ type: 'event', payload: event }), 300);
    }
  }

  subscribe(filters?: any) {
    if (this.ws && this.connected && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify({ type: 'subscribe', filters }));
      } catch (error) {
        console.error('Error subscribing:', error);
      }
    }
  }

  disconnect() {
    if (this.mockInterval) {
      clearInterval(this.mockInterval);
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.connected = false;
  }
}

