export interface IContribution {
    getCollections: () => Array<ICollection>;
    getItems: () => Array<IItem>;
}

export interface ICollection {
    id: string;
    title: string;
    description: string;
    itemIds: Array<string>;
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
    type: string;
    performAction?: () => Thenable<any>;
    command?: ICommand;
}

export interface ICommand {
    name: string;
    params?: any[];
}
