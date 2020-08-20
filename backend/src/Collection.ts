import { ICollection, IItem, IAction } from "./types/GuidedDev";

export class Collection implements ICollection {
    id: string;
    title: string;
    description: string;
    itemIds: string[];
    items: Item[];
}

export class Item implements IItem {
    id: string;
    fqid?: string;
    title: string;
    description: string;
    action?: IAction;
    itemIds?: string[];
    labels: { [key: string]: string; }[];
    items?: Item[];
}
