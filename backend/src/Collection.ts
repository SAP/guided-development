import { ICollection, IItem, IItemContext } from "./types/GuidedDev";

export interface IInternalContextualItem {
    item: IInternalItem;
    context?: IItemContext;
}

export interface IInternalCollection extends ICollection {
    contextualItems: IInternalContextualItem[];
}

export interface IInternalItem extends IItem {
    fqid?: string;
    contextualItems?: IInternalContextualItem[];
}
