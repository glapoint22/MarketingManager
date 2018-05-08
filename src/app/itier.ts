import { GridButton } from "./grid-button";

export interface Itier {
    index: number;
    name: string;
    items: Array<any>;
    fields: Array<any>;
    headerButtons: Array<GridButton>;
    rowButtons: Array<GridButton>;
    setItem?(item: any): any;
    check?(item: any): any;
    url?: string;
}