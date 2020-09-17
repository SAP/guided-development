// import { IGuidedDev } from '@sap-devx/guided-development-types';
import { ICollection, CollectionType, IItem, ManagerAPI, IExecuteAction, ICommandAction, ISnippetAction } from './types/GuidedDev';
import * as vscode from 'vscode';
import * as _ from 'lodash';

const datauri = require("datauri");
var path = require('path');

const EXT_ID = "saposs.vscode-contrib3";
let extensionPath: string;

let createAction: ICommandAction;
let openSnippetAction: ISnippetAction;
let cfDeleteAction: ICommandAction;
let generateAction: ICommandAction;
let buildAction: ICommandAction;
let deployAction: ICommandAction;
let cfSetAction: ICommandAction;
let cfSelectAction: ICommandAction;
let cfCreateAction: ICommandAction;
let cfReloadAction: ICommandAction;
let cfSetTargetAction: ICommandAction;

// const DEFAULT_IMAGE = require("../defaultImage");

function getCollections() {
    const collections: Array<ICollection> = [];
    let collection: ICollection = {
        id: "collection3",
        title: "Setup",
        description: "This is a demo collection. It contains self-contributed items and and an item contributed by a different contributor.",
        type: CollectionType.Scenario,
        itemIds: [
            "saposs.vscode-contrib3.create",
            "saposs.vscode-contrib3.open-snippet"
        ]
    };
    collections.push(collection);

    collection = {
        id: "collection4",
        title: "Create MTA",
        description: "This is a demo collectio - create mta project.",
        type: CollectionType.Scenario,
        itemIds: [
            "saposs.vscode-contrib3.generate-mta",
            "saposs.vscode-contrib3.build-mta",
            "saposs.vscode-contrib2.cf-login",
            "saposs.vscode-contrib3.deploy-mta"
        ]
    };
    collections.push(collection);

    collection = {
        id: "collection5",
        title: "Cloud Foundry",
        description: "This is a demo collectio - create mta project.",
        type: CollectionType.Scenario,
        itemIds: [
            "saposs.vscode-contrib2.cf-login",
            "saposs.vscode-contrib3.cf-set-orgspace",
            "saposs.vscode-contrib3.cf-select-space",
            "saposs.vscode-contrib3.cf-targets-create",
            "saposs.vscode-contrib3.cf-targets-reload",
            "saposs.vscode-contrib3.cf-target-set",
            "saposs.vscode-contrib3.cf-target-delete"
        ]
    };
    collections.push(collection);
    
    return collections;
}

function getItems(): Array<IItem> {
    const items: Array<IItem> = [];
    let item: IItem = {
        id: "create",
        title: "Create project from template",
        description: "Create new project from template.",
        image: getImage(path.join(extensionPath, 'resources', 'project from template.png')),
        action1: createAction,
        labels: [
            {"Project Name": "cap1"},
            {"Project Type": "CAP"},
            {"Path": "/home/user/projects/cap1"}
        ]
    };
    items.push(item);

    item = {
        id: "open-snippet",
        title: "Open Snippet",
        description: "Open Snippet Tool",
        action1: openSnippetAction,
        labels: [
            {"Project Name": "cap3"},
            {"Project Type": "CAP"},
            {"Path": "/home/user/projects/cap3"}
        ]
    };
    items.push(item);

    item = {
        id: "generate-mta",
        title: "Generate MTA",
        description: "generate mta project",
        action1: generateAction,
        labels: [
            {"Project Name": "cap2"},
            {"Project Type": "CAP"},
            {"Path": "/home/user/projects/cap2"}
        ]
    };
    items.push(item);

    item = {
        id: "build-mta",
        title: "Build MTA",
        description: "build mta project",
        action1: buildAction,
        labels: [
            {"Project Name": "cap2"},
            {"Project Type": "CAP"},
            {"Path": "/home/user/projects/cap2"}
        ]
    };
    items.push(item);

    item = {
        id: "deploy-mta",
        title: "Deploy MTA Archive",
        description: "deploy mta project",
        action1: deployAction,
        labels: [
            {"Project Name": "cap2"},
            {"Project Type": "CAP"},
            {"Path": "/home/user/projects/cap2"}
        ]
    };
    items.push(item);

    item = {
        id: "cf-set-orgspace",
        title: "Set CF Org And Space",
        description: "CF: Set Org and Space",
        action1: cfSetAction,
        labels: [
            {"Project Name": "cap3"},
            {"Project Type": "CAP"},
            {"Path": "/home/user/projects/cap3"}
        ]
    };
    items.push(item);

    item = {
        id: "cf-select-space",
        title: "Select CF Space",
        description: "CF: Select a space from your allowed spaces",
        action1: cfSelectAction,
        labels: [
            {"Project Name": "cap3"},
            {"Project Type": "CAP"},
            {"Path": "/home/user/projects/cap3"}
        ]
    };
    items.push(item);

    item = {
        id: "cf-targets-create",
        title: "Create new target Cloud Foundry",
        description: "CF: Create new target Cloud Foundry",
        action1: cfCreateAction,
        labels: [
            {"Project Name": "cap3"},
            {"Project Type": "CAP"},
            {"Path": "/home/user/projects/cap3"}
        ]
    };
    items.push(item);

    item = {
        id: "cf-targets-reload",
        title: "CF: Reload targets tree",
        description: "CF: Reload targets tree",
        action1: cfReloadAction,
        labels: [
            {"Project Name": "cap3"},
            {"Project Type": "CAP"},
            {"Path": "/home/user/projects/cap3"}
        ]
    };
    items.push(item);

    item = {
        id: "cf-target-set",
        title: "Set Current target Cloud Foundry",
        description: "CF: Set Current target Cloud Foundry",
        action1: cfSetTargetAction,
        labels: [
            {"Project Name": "cap3"},
            {"Project Type": "CAP"},
            {"Path": "/home/user/projects/cap3"}
        ]
    };
    items.push(item);

    item = {
        id: "cf-target-delete",
        title: "Delete target Cloud Foundry",
        description: "CF: Delete target Cloud Foundry",
        action1: cfDeleteAction,
        labels: [
            {"Project Name": "cap3"},
            {"Project Type": "CAP"},
            {"Path": "/home/user/projects/cap3"}
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
    console.log('Congratulations, your extension "vscode-contrib3" is now active!');

    extensionPath = context.extensionPath;

    const managerAPI = await getManagerAPI();

    createAction = managerAPI.createCommandAction("Create", "", {name: "sapwebide.showProjectTemplates"});
    
    openSnippetAction = managerAPI.createSnippetAction("Open", "", {
        contributorId: "SAPOSS.vscode-snippet-contrib", 
        snippetName: "snippet_1", 
        context: {}                    
    });

    cfDeleteAction = managerAPI.createCommandAction("Delete", "", { name: "cf.target.delete" });

    generateAction = managerAPI.createCommandAction("Generate", "", { name: "sapwebide.showProjectTemplates" });
    
    buildAction = managerAPI.createCommandAction("Build", "", { name: "extension.mtaBuildCommand" });

    deployAction = managerAPI.createCommandAction("Deploy", "", { name: "extension.mtarDeployCommand" });

    cfSetAction = managerAPI.createCommandAction("Set", "", { name: "cf.set.orgspace" });

    cfSelectAction = managerAPI.createCommandAction("Select", "", { name: "cf.select.space" });

    cfCreateAction = managerAPI.createCommandAction("Create", "", { name: "cf.targets.create" });
    
    cfReloadAction = managerAPI.createCommandAction("Reload", "", { name: "cf.targets.reload" });

    cfSetTargetAction = managerAPI.createCommandAction("Set", "", { name: "cf.target.set" });

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
