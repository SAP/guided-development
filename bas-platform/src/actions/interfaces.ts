import * as vscode from "vscode";

export enum ActionType {
    Execute = "EXECUTE",
    Command = "COMMAND",
    Task = "TASK",
    File = "FILE",
    Snippet = "SNIPPET"
}

export interface ICommand {
    name: string;
    params?: any[];
}

export interface ISnippet {
    contributorId: string;
    snippetName: string;
    context: any;
}

export interface IFile {
    uri: vscode.Uri;
}

export interface IAction {
    name: string;
    title?: string;
    _actionType?: ActionType
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
