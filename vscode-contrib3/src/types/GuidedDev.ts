import * as vscode from "vscode";

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

export interface IAction {
    name: string;
    title?: string;
}

export interface ICommand {
    name: string;
    params?: any[];
}

export interface IFile {
    uri: vscode.Uri;
}

export interface ISnippet {
    contributorId: string;
    snippetName: string;
    context: any;
}

export interface IExecuteAction extends IAction {
    performAction: () => Thenable<any>;
}

export interface ICommandAction extends IAction {
    command: ICommand;
}

export interface ISnippetAction extends IAction {
    snippet: ISnippet;
}

export interface IFileAction extends IAction {
    file: IFile;
}

export type ManagerAPI = {
    setData: (extensionId: string, collections: ICollection[], items: IItem[]) => void;
    createExecuteAction: (name: string, title: string, performAction: () => Thenable<any>) => IExecuteAction;
    createCommandAction: (name: string, title: string, command: ICommand) => ICommandAction;
    createSnippetAction: (name: string, title: string, snippet: ISnippet) => ISnippetAction;
    createFileAction: (name: string, title: string, file: IFile) => IFileAction;
}
