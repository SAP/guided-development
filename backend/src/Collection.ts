import { ICollection, IItem } from "./types/GuidedDev";

export interface IInternalCollection extends ICollection {
    items: IInternalItem[];
}

export interface IInternalItem extends IItem {
    fqid?: string;
    items?: IInternalItem[];
}
