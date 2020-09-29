import { ICollection, CollectionType, IItem, ManagerAPI } from './types/GuidedDev';
import { ICommandAction } from "bas-platform";
import * as vscode from 'vscode';
import * as _ from 'lodash';

const EXT_ID = "saposs.vscode-contrib2";

let cfLoginAction: ICommandAction;

function getCollections(): ICollection[] {
    const collections: Array<ICollection> = [];
    let collection: ICollection = {
        id: "collection2",
        title: "Demo collection 2 [Platform]",
        description: "This is a demo collection. It contains self-contributed items and and an item contributed by a different contributor.",
        type: CollectionType.Platform,
        itemIds: [
            "saposs.vscode-contrib2.cf-login",
            "saposs.vscode-contrib1.show-items"
        ]
    };
    collections.push(collection);

    return collections;
}

function getItems(): IItem[] {
    const items: Array<IItem> = [];
    let item: IItem = {
        id: "cf-login",
        title: "Cloud Foundry Login",
        description: "Login to Cloud Foundry (cf)",
        action1: cfLoginAction,
        labels: []
    };
    items.push(item);

    item = {
        id: "show-items",
        title: "Show items",
        description: "Shows list of items",
        itemIds: [
            "saposs.vscode-contrib1.clone",
            "saposs.vscode-contrib1.show-info"
        ],
        labels: [
            {"Project Name": "cap2"},
            {"Project Type": "CAP"},
            {"Path": "/home/user/projects/cap2"}
        ]
    };
    items.push(item);

    return items;
}

export async function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "vscode-contrib2" is now active!');
    const basAPI = await vscode.extensions.getExtension("SAPOSS.bas-platform")?.exports;
    const managerAPI: ManagerAPI = await basAPI.getExtensionAPI("SAPOSS.guided-development");

    cfLoginAction = new basAPI.actions.CommandAction();
    cfLoginAction.name = "Login";
    cfLoginAction.title = "Cloud Foundry Login";
    cfLoginAction.command = {name: "cf.login"};

    managerAPI.setData(EXT_ID, getCollections(), getItems());
}

export function deactivate() {}
