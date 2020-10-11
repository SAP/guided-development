import { IAction, ICommandAction, IExecuteAction, IFileAction, ISnippetAction } from "@sap-devx/bas-platform-types";

export interface ICollection {
    id: string;
    title: string;
    description: string;
    type: CollectionType;
    itemIds: Array<string>;
}

export enum CollectionType {
    Platform,
    Scenario,
    Extension
}

export interface IItemContext {
    project: string;
    params?: any[];
}

export interface IItemAction {
    name: string;
    title?: string;
    action: IAction;
    contexts?: IItemContext[];
}

export interface IItem {
    id: string;
    title: string;
    description: string;
    image?: IImage;
    action1?: IItemAction;
    action2?: IItemAction;
    itemIds?: Array<string>;
    // not using Map because it does not serialize using JSON
    labels: {[key:string]:string}[];
}

export interface IImage {
    image: string;
    note: string;
}

export type ManagerAPI = {
    setData: (extensionId: string, collections: ICollection[], items: IItem[]) => void;
}
