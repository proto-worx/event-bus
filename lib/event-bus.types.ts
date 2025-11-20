export type EventBusEvent<TEventBus> = keyof TEventBus;
export type EventBusListener<TEventBus> = (
  event: TEventBus[keyof TEventBus]
) => void;

export type EventBusSubscribeFunction<TEventBus> = (
  event: EventBusEvent<TEventBus>,
  listener: EventBusListener<TEventBus>
) => void | Promise<void>;

export type EventBusUnsubscribeFunction<TEventBus> = (
  event: EventBusEvent<TEventBus>,
  listener: EventBusListener<TEventBus>
) => void | Promise<void>;

export type EventBusEmitFunction<TEventBus> = (
  event: EventBusEvent<TEventBus>,
  data: TEventBus[keyof TEventBus]
) => void | Promise<void>;
