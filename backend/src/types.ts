import { ActionType, IAction, ICommandAction, IExecuteAction, IFileAction, ISnippetAction,
         CommandActionParams, ExecuteActionParams, SnippetActionParams, FileActionParams } from "@sap-devx/bas-platform-types";

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

interface IItemContext {
    project: string;
}

interface IItemAction {
    name: string;
    title?: string;
    action: IAction;
    contexts?: IItemContext[];
}

export interface IItemCommandContext extends IItemContext {
    params?: CommandActionParams;
}
export interface IItemCommandAction extends IItemAction {
    action: ICommandAction;
    contexts?: IItemCommandContext[];
}

export interface IItemExecuteContext extends IItemContext {
    params?: ExecuteActionParams;
}
export interface IItemExecuteAction extends IItemAction {
    action: IExecuteAction;
    contexts?: IItemExecuteContext[];
}

export interface IItemSnippetContext extends IItemContext {
    context?: SnippetActionParams;
}
export interface IItemSnippetAction extends IItemAction {
    action: ISnippetAction;
    contexts?: IItemSnippetContext[];
}

export interface IItemFileContext extends IItemContext {
    uri?: FileActionParams;
}
export interface IItemFileAction extends IItemAction {
    action: IFileAction;
    contexts?: IItemFileContext[];
}

export type ItemAction = IItemCommandAction |
IItemExecuteAction |
IItemSnippetAction |
IItemFileAction;

export type ItemContext = IItemCommandContext |
IItemExecuteContext |
IItemSnippetContext |
IItemFileContext;

export interface IItem {
    id: string;
    title: string;
    description: string;
    image?: IImage;
    action1?: ItemAction;
    action2?: ItemAction;
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
