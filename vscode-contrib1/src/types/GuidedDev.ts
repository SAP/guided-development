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
    Platform = "PLATFORM",
    Scenario = "SCENARIO",
    Extension = "EXTENSION"
}

export interface IItem {
    id: string;
    title: string;
    description: string;
    action?: IAction;
    itemIds?: Array<string>;
    // not using Map because it does not serialize using JSON
    labels: {[key:string]:string}[];
}

export interface IAction {
    name: string;
    type: ActionType;
    performAction?: () => Thenable<any>;
    command?: ICommand;
}

export enum ActionType {
    Execute = "EXECUTE",
    Command = "COMMAND",
    Task = "TASK",
    OpenFile = "OPENFILE"
}

export interface ICommand {
    name: string;
    params?: any[];
}
