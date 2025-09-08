/// <reference types="vite/client" />

interface WidgetOptions {
    token: string;
}

interface Window {
    transactionlink_ready: () => void;
    transactionlink?: {
        open(): void;
        close(): void;
        setOptions(options: WidgetOptions): void;
        unmountWidget(): void;
        on(eventName: string, callback: (data: any) => void): void;
    };
}
