import { Itier } from './itier';

export interface Igrid {
    tiers: Array<Itier>;
    searchValue: string;
    currentItem: any;
    onTierCollapse(): void;
}