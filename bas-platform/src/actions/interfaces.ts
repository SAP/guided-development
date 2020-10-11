import * as vscode from "vscode";

export enum ActionType {
    Execute = "EXECUTE",
    Command = "COMMAND",
    Task = "TASK",
    File = "FILE",
    Snippet = "SNIPPET"
}

export interface IAction {
    actionType: ActionType | undefined;
}

export interface ICommandAction extends IAction {
    name: string;
    params?: any[];
}

export interface ISnippetAction extends IAction {
    contributorId: string;
    snippetName: string;
    context: any;
}

export interface IFileAction extends IAction {
    uri: vscode.Uri;
}

export interface IExecuteAction extends IAction {
    executeAction: (params?: any[]) => Thenable<any>;
    params?: any[];
}
