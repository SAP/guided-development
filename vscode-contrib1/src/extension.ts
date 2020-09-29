// import { IGuidedDev } from '@sap-devx/guided-development-types';
import { ICollection, CollectionType, IItem, ManagerAPI, IExecuteAction, ICommandAction } from './types/GuidedDev';
import * as vscode from 'vscode';
import * as _ from 'lodash';

const datauri = require("datauri");

const EXT_ID = "saposs.vscode-contrib1";

let openSettingsAction: IExecuteAction;
let showMessageAction: IExecuteAction;
let cloneAction: IExecuteAction;
let openGlobalSettingsAction: ICommandAction;
let showInfoMessageAction: IExecuteAction;
let extensionPath: string;

var path = require('path');
// const DEFAULT_IMAGE = require("../defaultImage");

function getCollections(): ICollection[] {
    const collections: Array<ICollection> = [];
    let collection: ICollection = {
        id: "collection1",
        title: "Demo collection 1 [Scenario]",
        description: "This is a demo collection. It contains self-contributed items and and an item contributed by a different contributor.",
        type: CollectionType.Scenario,
        itemIds: [
            "saposs.vscode-contrib1.open",
            "saposs.vscode-contrib1.clone",
            "saposs.vscode-contrib1.open-command",
            "saposs.vscode-contrib2.cf-login",
            "saposs.vscode-contrib1.show-info",
            "saposs.vscode-contrib1.show-items"
        ]
    };
    collections.push(collection);

    return collections;
}

function getItems(): Array<IItem> {
    const items: Array<IItem> = [];
    let item: IItem = {
        id: "open",
        title: "Open Global Settings",
        description: "It is easy to configure Visual Studio Code to your liking through its various settings.",
        image: {
            image: getImage(path.join(extensionPath, 'resources', 'settings2.png')),
            note: "image note of Open Global Settings"
        },
        action1: openSettingsAction,
        action2: showMessageAction,
        labels: [
            {"Project Name": "cap1"},
            {"Project Type": "CAP"},
            {"Path": "/home/user/projects/cap1"}
        ]
    };
    items.push(item);

    item = {
        id: "clone",
        title: "Cloning code-snippet repository",
        description: "A VSCode extension that provides a simple way to add code snippets..",
        action1: cloneAction,
        labels: []
    };
    items.push(item);

    item = {
        id: "open-command",
        title: "Open Command  - Global Settings",
        description: "It is easy to configure Visual Studio Code to your liking through its various settings.",
        action1: openGlobalSettingsAction,
        labels: [
            {"Project Name": "cap1"},
            {"Project Type": "CAP"},
            {"Path": "/home/user/projects/cap1"}
        ]
    };
    items.push(item);

    item = {
        id: "show-info",
        title: "Show info message",
        description: "Shows a information message",
        image: {
            image: getImage(path.join(extensionPath, 'resources', 'info.png')),
            note: "image note of Show info message"
        },
        action1: showInfoMessageAction,
        labels: [
            {"Project Name": "cap2"},
            {"Project Type": "CAP"},
            {"Path": "/home/user/projects/cap2"}
        ]
    };
    items.push(item);

    item = {
        id: "show-items",
        title: "Show items",
        description: "Shows list of items",
        image: {
            image: getImage(path.join(extensionPath, 'resources', 'items.png')),
            note: "image note of Shows list of items"
        },
        itemIds: [
            "saposs.vscode-contrib1.open",
            "saposs.vscode-contrib2.cfLogin",
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
    console.log('Congratulations, your extension "vscode-contrib1" is now active!');

    extensionPath = context.extensionPath;

    const managerAPI = await getManagerAPI();

    openSettingsAction = managerAPI.createExecuteAction("Open", "Open Settings", () => {
        return vscode.commands.executeCommand("workbench.action.openGlobalSettings");
    });

    showMessageAction = managerAPI.createExecuteAction("Show", "Show Message", () => {
        return vscode.window.showInformationMessage("Hello from Open Global Settings item");
    });

    cloneAction = managerAPI.createExecuteAction("Clone", "Cloning Repository", () => {
        return vscode.commands.executeCommand("git.clone", "https://github.com/SAP/code-snippet.git");
    });

    openGlobalSettingsAction = managerAPI.createCommandAction("Open", "", {name: "workbench.action.openGlobalSettings"});

    showInfoMessageAction = managerAPI.createExecuteAction("Show", "Show info message", () => {
        return vscode.window.showInformationMessage("Hello from guided development item");
    });
    
    managerAPI.setData(EXT_ID, getCollections(), getItems());
}

function getImage(imagePath: string) :string {
    let image;
    try {
      image = datauri.sync(imagePath);
    } catch (error) {
        // image = DEFAULT_IMAGE;
    }
    return image;
}


export function deactivate() {}

// OPEN ISSUES:
//   Collection that reference items from other contributors:
//      Are those items necessarily not bound to a specific project?
//      Does that mean they are static?
//      No labels?
//      Constant item IDs?
