export interface Itier {
    index: number;
    name: string;
    items: Array<any>;
    fields: Array<any>;
    headerButtons: Array<any>;
    rowButtons: Array<any>;
    setItem?(item: any): any;
    url?: string;
}