import * as vscode from "vscode";
import { ActionType, IAction, ICommandAction, IExecuteAction, IFileAction, ISnippetAction } from "@sap-devx/bas-platform-types";

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

export interface IItemContext<T> {
    project: string;
    params?: T;
}

export interface IItemAction<T, K extends IAction> {
    name: string;
    title?: string;
    action: K;
    contexts?: IItemContext<T>[];
}

export type ItemAction = IItemAction<any[], ICommandAction> |
    IItemAction<any[], IExecuteAction> |
    IItemAction<any, ISnippetAction> |
    IItemAction<vscode.Uri, IFileAction>;

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
