// import { IGuidedDev } from '@sap-devx/guided-development-types';
import { ICollection, CollectionType, IItem, ManagerAPI, IExecuteAction, ICommandAction } from './types/GuidedDev';
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
            {"Project Path": "/home/user/projects/cap2"}
        ]
    };
    items.push(item);

    return items;
}

async function getManagerAPI(): Promise<ManagerAPI> {
    const manager = vscode.extensions.getExtension('SAPOSS.guided-development');
    
    // temporary hack until this is resolved
    //   https://github.com/eclipse-theia/theia/issues/8463
    const promise = new Promise<ManagerAPI>((resolve, reject) => {
        let intervalId: NodeJS.Timeout;
        if (!(manager?.isActive)) {
            intervalId = setInterval(() => {
                if (manager?.isActive) {
                    clearInterval(intervalId);
                    resolve(manager?.exports as ManagerAPI);
                }
            }, 500);
        }
    });

    return promise;
}

export async function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "vscode-contrib2" is now active!');

    const managerAPI = await getManagerAPI();

    cfLoginAction = managerAPI.createCommandAction("Login", "Cloud Foundry Login", {name: "cf.login"});

    managerAPI.setData(EXT_ID, getCollections(), getItems());
}

export function deactivate() {}

// OPEN ISSUES:
//   Collection that reference items from other contributors:
//      Are those items necessarily not bound to a specific project?
//      Does that mean they are static?
//      No labels?
//      Constant item IDs?
