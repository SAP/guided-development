import { IAction, ICommandAction, IExecuteAction, IFileAction, ISnippetAction, IUriAction } from "@sap-devx/app-studio-toolkit-types";
import { Uri } from "vscode";

export interface ICollection {
    id: string;
    title: string;
    description: string;
    type: CollectionType;
    itemIds: Array<string>;
    mode?: 'single' | 'multiple';
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
    params?: any[];
}
export interface IItemCommandAction extends IItemAction {
    action: ICommandAction;
    contexts?: IItemCommandContext[];
}

export interface IItemExecuteContext extends IItemContext {
    params?: any[];
}
export interface IItemExecuteAction extends IItemAction {
    action: IExecuteAction;
    contexts?: IItemExecuteContext[];
}

export interface IItemSnippetContext extends IItemContext {
    context?: any;
}
export interface IItemSnippetAction extends IItemAction {
    action: ISnippetAction;
    contexts?: IItemSnippetContext[];
}

export interface IItemUriContext extends IItemContext {
    uri?: Uri;
}
export interface IItemFileAction extends IItemAction {
    action: IFileAction;
    contexts?: IItemUriContext[];
}

export interface IItemUriAction extends IItemAction {
    action: IUriAction;
    contexts?: IItemUriContext[];
}

export type ItemAction = IItemCommandAction |
IItemExecuteAction |
IItemSnippetAction |
IItemUriAction |
IItemFileAction;

export type ItemContext = IItemCommandContext |
IItemExecuteContext |
IItemSnippetContext |
IItemUriContext;

export interface IItem {
    id: string;
    title: string;
    description: string;
    image?: IImage;
    action1?: ItemAction;
    action2?: ItemAction;
    itemIds?: Array<string>;
    activeState?: boolean;
    readState?: ReadState;
    // not using Map because it does not serialize using JSON
    labels: {[key:string]:string}[];
}

export interface IImage {
    image: string;
    note: string;
}


export enum ReadState {
    READ="READ",
    UNREAD="UNREAD",
    WAIT="WAIT"
}


export type ManagerAPI = {
    setData: (extensionId: string, collections: ICollection[], items: IItem[]) => void;
}
