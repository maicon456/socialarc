import { Event } from './events';

export interface RelayMessage {
  type: string;
  payload?: Event;
  timestamp?: string;
}

type MessageListener = (msg: RelayMessage) => void;

/**
 * Mock WebSocket Relay
 * Replace with real WebSocket implementation in production
 */
export class MockRelay {
  private url: string;
  private listeners: MessageListener[] = [];
  public connected: boolean = false;
  private mockInterval?: NodeJS.Timeout;

  constructor(url: string) {
    this.url = url;
    this._startMockPing();
  }

  private _startMockPing() {
    setTimeout(() => {
      this.connected = true;
      this._emit({ type: 'relay:welcome', timestamp: new Date().toISOString() });
    }, 400);
  }

  _emit(msg: RelayMessage) {
    this.listeners.forEach((listener) => listener(msg));
  }

  onMessage(fn: MessageListener) {
    this.listeners.push(fn);
  }

  publish(event: Event) {
    // In a real relay you'd send via WebSocket
    // Here we just echo back the event after a tiny delay to simulate network
    setTimeout(() => this._emit({ type: 'event', payload: event }), 300);
  }

  disconnect() {
    if (this.mockInterval) {
      clearInterval(this.mockInterval);
    }
    this.connected = false;
  }
}

