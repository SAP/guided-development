import { IAction, ICommand, ICommandAction, IExecuteAction, ISnippet, ISnippetAction } from "./types/GuidedDev";

export class Action implements IAction {
    name: string;
    title?: string;
}

export class ExecuteAction extends Action implements IExecuteAction {
    performAction: () => Thenable<any>;
}

export class CommandAction extends Action implements ICommandAction {
    command: ICommand;
}

export class SnippetAction extends Action implements ISnippetAction {
    snippet: ISnippet;
}
