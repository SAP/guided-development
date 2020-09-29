import { Uri } from "vscode";
import { ActionType, IAction, ICommand, ICommandAction, IExecuteAction, IFile, IFileAction, ISnippet, ISnippetAction } from "./interfaces";

/** Specific action classes */
export abstract class Action implements IAction {
    name: string = "";
    title?: string = "";
    _actionType?: ActionType = ActionType.Command;
}

export class ExecuteAction extends Action implements IExecuteAction {
    performAction: () => Thenable<any>;

    constructor() {
        super();
        this._actionType = ActionType.Execute;
        this.performAction = () => { return Promise.resolve() }
    }
}

export class CommandAction extends Action implements ICommandAction {
    command: ICommand;

    constructor() {
        super();
        this._actionType = ActionType.Command;
        this.command = { name: "" };
    }
}

export class SnippetAction extends Action implements ISnippetAction {
    snippet: ISnippet;

    constructor() {
        super();
        this._actionType = ActionType.Snippet;
        this.snippet = { contributorId: "", context: "", snippetName: "" };
    }
}

export class FileAction extends Action implements IFileAction {
    file: IFile;

    constructor() {
        super();
        this._actionType = ActionType.File;
        this.file = { uri: Uri.parse("") };
    }
}

