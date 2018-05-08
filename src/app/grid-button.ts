export interface GridButton {
    name: string;
    icon: string;
    onClick(...params): void;
    getDisabled?(...params): void;
}