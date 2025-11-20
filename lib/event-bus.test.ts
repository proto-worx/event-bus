import { describe, expect, it, mock } from "bun:test";
import { EventBus } from "./event-bus";

it("should be true", () => {
  expect(true).toBe(true);
});

describe("EventBus", () => {
  it("should be an instance of EventBus", () => {
    const eventBus = new EventBus();
    expect(eventBus).toBeInstanceOf(EventBus);
  });
  it("should have a subscribe method", () => {
    const eventBus = new EventBus();
    expect(eventBus.subscribe).toBeDefined();
  });
  it("should have a unsubscribe method", () => {
    const eventBus = new EventBus();
    expect(eventBus.unsubscribe).toBeDefined();
  });
  it("should have a emit method", () => {
    const eventBus = new EventBus();
    expect(eventBus.emit).toBeDefined();
  });
  it("should have a get method", () => {
    const eventBus = new EventBus();
    expect(eventBus.get).toBeDefined();
  });
});

describe("EventBus: Behavior", () => {
  it("should subscribe to an event", () => {
    const eventBus = new EventBus();
    const mockListener = mock(() => {});
    eventBus.subscribe("test", mockListener);

    expect(eventBus.get("events")).toContain("test");
    expect(eventBus.get("listeners")).toStrictEqual(
      new Map([["test", new Set([mockListener])]])
    );

    eventBus.emit("test", "test");
    expect(mockListener).toHaveBeenCalledWith("test");
  });

  it("should unsubscribe from an event", () => {
    const eventBus = new EventBus();
    const mockListener = mock(() => {});
    eventBus.subscribe("test", mockListener);
    eventBus.unsubscribe("test", mockListener);
    expect(eventBus.get("events")).not.toContain("test");
    expect(eventBus.get("listeners")).toStrictEqual(new Map());
  });

  it("should emit an event to all listeners", () => {
    const eventBus = new EventBus();
    const mockListener1 = mock(() => {});
    const mockListener2 = mock(() => {});
    eventBus.subscribe("test", mockListener1);
    eventBus.subscribe("test", mockListener2);
    eventBus.emit("test", "test");
    expect(mockListener1).toHaveBeenCalledWith("test");
    expect(mockListener2).toHaveBeenCalledWith("test");
  });

  it("should not emit an event to listeners that are not subscribed to the event", () => {
    const eventBus = new EventBus();
    const mockListener = mock(() => {});
    eventBus.subscribe("test1", mockListener);
    eventBus.emit("test", "test");
    expect(mockListener).not.toHaveBeenCalled();
  });

  it("should not emit an event that has been unsubscribed", () => {
    const eventBus = new EventBus();
    const mockListener = mock(() => {});
    eventBus.subscribe("test", mockListener);
    eventBus.unsubscribe("test", mockListener);
    eventBus.emit("test", "test");
    expect(mockListener).not.toHaveBeenCalled();
  });

  it("should not add the same listener to the same event multiple times", () => {
    const eventBus = new EventBus();
    const mockListener = mock(() => {});
    eventBus.subscribe("test", mockListener);
    eventBus.subscribe("test", mockListener);
    expect(eventBus.get("listeners")).toStrictEqual(
      new Map([["test", new Set([mockListener])]])
    );
  });

  it("should unsubscribe from all events", () => {
    const eventBus = new EventBus();
    const mockListener = mock(() => {});
    eventBus.subscribe("test", mockListener);
    eventBus.subscribe("test2", mockListener);
    eventBus.unsubscribeAll();
    expect(eventBus.get("listeners")).toStrictEqual(new Map());
  });
});
