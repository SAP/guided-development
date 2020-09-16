export interface IGuidedDevContribution {
    getCollections: () => Array<ICollection>;
    getItems: () => Array<IItem>;
}

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
    action1?: IExecuteAction | ICommandAction | ISnippetAction | IOpenFileAction;
    action2?: IExecuteAction | ICommandAction | ISnippetAction | IOpenFileAction;
    itemIds?: Array<string>;
    // not using Map because it does not serialize using JSON
    labels: {[key:string]:string}[];
}

export interface IAction {
    name: string;
    title?: string;
    type: ActionType;
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

export interface IOpenFileAction extends IAction {
    file: IOpenFile;
}

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

export interface IOpenFile {
    uri: string;
}
