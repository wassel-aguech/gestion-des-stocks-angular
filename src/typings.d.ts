declare module 'event-source-polyfill' {
  interface ExtendedEventSourceInit extends EventSourceInit {
    headers?: { [key: string]: string };
    heartbeatTimeout?: number;
    connectionTimeout?: number;
  }

  export class EventSourcePolyfill extends EventSource {
    constructor(url: string, eventSourceInitDict?: ExtendedEventSourceInit);
  }
}
