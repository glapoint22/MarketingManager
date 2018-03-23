import { Itier } from './itier';

export interface Igrid {
    tiers: Array<Itier>;
    searchValue: string;
    tierToSearch: number;
    onItemSelect(item: any): void;
}