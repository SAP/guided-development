import { Uri } from "vscode";
import { ActionType, IAction, ICommandAction, IExecuteAction, IFileAction, ISnippetAction } from "./interfaces";

export abstract class Action implements IAction {
    actionType: ActionType = ActionType.Command;
}

/** Specific action classes */
export class ExecuteAction extends Action implements IExecuteAction {
    executeAction: (params?: any[]) => Thenable<any>;
    params?: any[];

    constructor() {
        super();
        this.actionType = ActionType.Execute;
        this.params = [];
        this.executeAction = (params?: any[]) => { return Promise.resolve() }
    }
}

export class CommandAction extends Action implements ICommandAction {
    name: string;
    params?: any[];

    constructor() {
        super();
        this.actionType = ActionType.Command;
        this.name = "";
        this.params = [];
    }
}

export class SnippetAction extends Action implements ISnippetAction {
    contributorId: string;
    snippetName: string;
    context: any;

    constructor() {
        super();
        this.actionType = ActionType.Snippet;
        this.contributorId = "";
        this.context = "";
        this.snippetName = "";
    }
}

export class FileAction extends Action implements IFileAction {
    uri: Uri;

    constructor() {
        super();
        this.actionType = ActionType.File;
        this.uri = Uri.parse("");
    }
}
