export abstract class EventHandler<T> {
    abstract handle(data: T, event: MessageEvent<T>): void | Promise<void>;
};
