import { ICommandAction, IExecuteAction, IFileAction, ISnippetAction } from "@sap-devx/bas-platform-types";

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

export interface IItem {
    id: string;
    title: string;
    description: string;
    image?: string;
    action1?: IExecuteAction | ICommandAction | ISnippetAction | IFileAction;
    action2?: IExecuteAction | ICommandAction | ISnippetAction | IFileAction;
    itemIds?: Array<string>;
    // not using Map because it does not serialize using JSON
    labels: {[key:string]:string}[];
}

export type ManagerAPI = {
    setData: (extensionId: string, collections: ICollection[], items: IItem[]) => void;
}
