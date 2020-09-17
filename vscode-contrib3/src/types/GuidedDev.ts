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
    action1?: IExecuteAction | ICommandAction | ISnippetAction;
    action2?: IExecuteAction | ICommandAction | ISnippetAction;
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

export interface IExecuteAction extends IAction {
    performAction: () => Thenable<any>;
}

export interface ICommandAction extends IAction {
    command: ICommand;
}

export interface ISnippetAction extends IAction {
    snippet: ISnippet;
}

export type ManagerAPI = {
    setData: (extensionId: string, collections: ICollection[], items: IItem[]) => void;
    cloneItem: (item: IItem) => IItem;
    createExecuteAction: (name: string, title: string, performAction: () => Thenable<any>) => IExecuteAction;
    createCommandAction: (name: string, title: string, command: ICommand) => ICommandAction;
    createSnippetAction: (name: string, title: string, snippet: ISnippet) => ISnippetAction;
}

export interface ISnippet {
    contributorId: string;
    snippetName: string;
    context: any;
}
