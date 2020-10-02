import * as vscode from 'vscode';
import * as _ from 'lodash';
import { ICollection, CollectionType, IItem, ManagerAPI } from '@sap-devx/guided-development-types';
import { ICommandAction, IFileAction, ISnippetAction, bas } from "@sap-devx/bas-platform-types";

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
let openReadmeAction: IFileAction;

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
            "saposs.vscode-contrib3.open-snippet",
            "saposs.vscode-contrib3.open-readme"
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
        id: "open-readme",
        title: "Open README File",
        description: "Open README File",
        action1: openReadmeAction,
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

export async function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "vscode-contrib3" is now active!');
    const basAPI: typeof bas = vscode.extensions.getExtension("SAPOSS.bas-platform")?.exports;

    extensionPath = context.extensionPath;

    createAction = new basAPI.actions.CommandAction();
    createAction.name = "Create";
    createAction.command = {name: "sapwebide.showProjectTemplates"};
    
    openSnippetAction = new basAPI.actions.SnippetAction();
    openSnippetAction.name = "Open";
    openSnippetAction.snippet = {
        contributorId: "SAPOSS.vscode-snippet-contrib", 
        snippetName: "snippet_1", 
        context: {}                    
    };

    cfDeleteAction = new basAPI.actions.CommandAction();
    cfDeleteAction.name = "Delete";
    cfDeleteAction.command = { name: "cf.target.delete" };

    generateAction = new basAPI.actions.CommandAction();
    generateAction.name = "Generate";
    generateAction.command = { name: "sapwebide.showProjectTemplates" };
    
    buildAction = new basAPI.actions.CommandAction();
    buildAction.name = "Build";
    buildAction.command = { name: "extension.mtaBuildCommand" };

    deployAction = new basAPI.actions.CommandAction();
    deployAction.name = "Deploy";
    deployAction.command = { name: "extension.mtarDeployCommand" };

    cfSetAction = new basAPI.actions.CommandAction();
    cfSetAction.name = "Set";
    cfSetAction.command = { name: "cf.set.orgspace" };

    cfSelectAction = new basAPI.actions.CommandAction();
    cfSelectAction.name = "Select";
    cfSelectAction.command = { name: "cf.select.space" };

    cfCreateAction = new basAPI.actions.CommandAction();
    cfCreateAction.name = "Create";
    cfCreateAction.command = { name: "cf.targets.create" };
    
    cfReloadAction = new basAPI.actions.CommandAction();
    cfReloadAction.name = "Reload";
    cfReloadAction.command = { name: "cf.targets.reload" };

    cfSetTargetAction = new basAPI.actions.CommandAction();
    cfSetTargetAction.name = "Set";
    cfSetTargetAction.command = { name: "cf.target.set" };

    openReadmeAction = new basAPI.actions.FileAction();
    openReadmeAction.name = "Open";
    openReadmeAction.file = {
        uri: getFileUriFromWorkspace("README.md")
    };

    basAPI.getExtensionAPI<ManagerAPI>("SAPOSS.guided-development").then((managerAPI) => {
        managerAPI.setData(EXT_ID, getCollections(), getItems());
    });
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

function getFileUriFromWorkspace(fileName: string) :vscode.Uri {
    let outputFolder = _.get(vscode, "workspace.workspaceFolders[0].uri.path");
    if (!outputFolder || !outputFolder.length) {
        vscode.window.showErrorMessage("Cannot find folder");
        return vscode.Uri.parse("");;
    }
    outputFolder = outputFolder + '/' + fileName;
    return vscode.Uri.parse(outputFolder);
}


export function deactivate() {}