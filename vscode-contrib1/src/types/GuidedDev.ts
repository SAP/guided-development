export interface IContribution {
    getCollections: () => Array<ICollection>;
    getItems: () => Array<IItem>;
}

export interface ICollection {
    id: string;
    title: string;
    description: string;
    itemIds: Array<string>;
    items?: Array<IItem>;
}

export interface IItem {
    id: string;
    fqid?: string;
    title: string;
    description: string;
    actionName: string;
    actionType: string;
    performAction?: () => Thenable<any>;
    command?: ICommand;
    // not using Map because it does not serialize using JSON
    labels: {[key:string]:string}[];
}

export interface ICommand {
    name: string;
    params?: any[];
}
