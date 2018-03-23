import { Itier } from './itier';

export interface Igrid {
    tiers: Array<Itier>;
    searchValue: string;
    tierToSearch: number;
    currentItem: any;
    onItemSelect(item: any): void;
}