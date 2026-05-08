// EventBus.ts
export enum EventName {
    TIMESHEET_CHANGE = "TIMESHEET_CHANGE",
}

export type EventHandler<T = any> = (payload: T) => void;

export class EventBus {
    private map = new Map<string, Set<EventHandler>>();

    on<T = any>(event: string, handler: EventHandler<T>): () => void {
        if (!this.map.has(event)) {
            this.map.set(event, new Set());
        }
        this.map.get(event)!.add(handler as EventHandler);
        return () => this.off(event, handler);
    }

    once<T = any>(event: string, handler: EventHandler<T>) {
        const off = this.on(event, (payload: T) => {
            off();
            handler(payload);
        });
    }

    off<T = any>(event: string, handler: EventHandler<T>) {
        const set = this.map.get(event);
        if (!set) return;
        set.delete(handler as EventHandler);
        if (set.size === 0) {
            this.map.delete(event);
        }
    }

    emit<T = any>(event: string, payload: T) {
        const set = this.map.get(event);
        if (!set) return;
        [...set].forEach(fn => fn(payload));
    }
}

export const eventBus = new EventBus();
