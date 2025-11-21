class EventBusCore<TDefinedMappings extends { [key: string]: any }> {
  protected listeners: Map<
    keyof TDefinedMappings,
    Set<(event: TDefinedMappings[keyof TDefinedMappings]) => void>
  > = new Map();

  /**
   * Add a listener to an event queue
   * If the event queue does not exist, it will be created
   * @param event - The event to listen for
   * @param listener - The listener to add
   */
  subscribe<TEvent extends keyof TDefinedMappings>(
    event: TEvent,
    listener: (event: TDefinedMappings[TEvent]) => void | Promise<void>
  ) {
    const listeners = this.listeners.get(event);
    if (!listeners) {
      this.listeners.set(
        event,
        new Set([
          listener as (
            event: TDefinedMappings[keyof TDefinedMappings]
          ) => void | Promise<void>,
        ])
      );
    } else {
      listeners.add(
        listener as (
          event: TDefinedMappings[keyof TDefinedMappings]
        ) => void | Promise<void>
      );
    }
  }

  /**
   * Remove a listener from an event queue
   * @param event - The event to remove the listener from
   * @param listener - The listener to remove
   */
  unsubscribe<TEvent extends keyof TDefinedMappings>(
    event: TEvent,
    listener: (event: TDefinedMappings[TEvent]) => void | Promise<void>
  ): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.delete(
        listener as (
          event: TDefinedMappings[keyof TDefinedMappings]
        ) => void | Promise<void>
      );
      if (listeners.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  /**
   * Unsubscribe from all events
   */
  unsubscribeAll() {
    for (const [_, listeners] of this.listeners.entries()) {
      listeners.clear();
    }
    this.listeners.clear();
  }
  /**
   * Emit an event to all listeners
   * @param event - The event to emit
   * @param data - The data to emit
   */
  emit<TEvent extends keyof TDefinedMappings>(
    event: TEvent,
    data: TDefinedMappings[TEvent]
  ) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach((listener) => listener(data));
    }
  }

  /**
   * Get the listeners or events
   * @param what - The what to get
   * @returns The listeners or events
   */
  get(what: "listeners" | "events") {
    if (what === "listeners") {
      return this.listeners;
    } else if (what === "events") {
      return Array.from(this.listeners.keys());
    }
  }
}

export class EventBus<
  TDefinedMappings extends { [key: string]: any }
> extends EventBusCore<TDefinedMappings> {
  constructor() {
    super();
  }

  /**
   * Search for an event by name or partial match
   * @param name - The name of the event to search for
   * @returns The event if found, otherwise undefined
   */
  search(name: string) {
    // comments to trigger a release
    return Array.from(this.listeners.entries()).filter(
      ([event]) => typeof event === "string" && event.includes(name)
    );
  }
}
