import { ICommandAction, IExecuteAction, IFileAction, ISnippetAction } from "@sap-devx/bas-platform-types";

export interface ICollection {
    id: string;
    title: string;
    description: string;
    type: CollectionType;
    contextId?: string;
    itemIds: Array<string>;
}

export enum CollectionType {
    Platform,
    Scenario,
    Extension
}

export interface IItemContext {
    id: string;
    action1Parameters?: any[]; // override parameters for command action1
    action2Parameters?: any[]; // override parameters for command action2
}

export interface IItem {
    id: string;
    title: string;
    description: string;
    image?: IImage;
    action1?: IExecuteAction | ICommandAction | ISnippetAction | IFileAction;
    action2?: IExecuteAction | ICommandAction | ISnippetAction | IFileAction;
    itemIds?: Array<string>;
    // not using Map because it does not serialize using JSON
    labels: {[key:string]:string}[];
    contexts?: IItemContext[];
}

export interface IImage {
    image: string;
    note: string;
}

export type ManagerAPI = {
    setData: (extensionId: string, collections: ICollection[], items: IItem[]) => void;
}
