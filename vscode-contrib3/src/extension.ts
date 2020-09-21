// import { IGuidedDev } from '@sap-devx/guided-development-types';
import { ICollection, CollectionType, IItem, ActionType, IGuidedDevContribution } from './types/GuidedDev';
import * as vscode from 'vscode';
import * as _ from 'lodash';

const datauri = require("datauri");
var path = require('path');
// const DEFAULT_IMAGE = require("../defaultImage");

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "vscode-contrib3" is now active!');

    const guidedDevContribution : IGuidedDevContribution = {
        // return items based on workspace folders/projects
        getCollections: () => {
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
        },
        getItems: () => {
            const items: Array<IItem> = [];
            let item: IItem = {
                id: "create",
                title: "Create project from template",
                description: "Create new project from template.",
                image: getImage(path.join(context.extensionPath, 'resources', 'project from template.png')),
                action1: {
                    name: "Create",
                    type: ActionType.Command,
                    command: {
                        name: "sapwebide.showProjectTemplates"
                    },
                },
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
                action1: {
                    name: "Open",
                    type: ActionType.Snippet,
                    snippet: {
                        contributorId: "SAPOSS.vscode-snippet-contrib", 
                        snippetName: "snippet_1", 
                        context: {}                    
                      },
                },
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
                action1: {
                    name: "Open",
                    type: ActionType.File,
                    file: {
                        uri: getFileUriFromWorkspace("README.md")
                    }
                },
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
                action1: {
                    name: "Generate",
                    type: ActionType.Command,
                    command: {
                        name: "sapwebide.showProjectTemplates"
                    },
                },
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
                action1: {
                    name: "Build",
                    type: ActionType.Command,
                    command: {
                        name: "extension.mtaBuildCommand"
                    },
                },
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
                action1: {
                    name: "Deploy",
                    type: ActionType.Command,
                    command: {
                        name: "extension.mtarDeployCommand"
                    },
                },
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
                action1: {
                    name: "Set",
                    type: ActionType.Command,
                    command: {
                        name: "cf.set.orgspace"
                    },
                },
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
                action1: {
                    name: "Select",
                    type: ActionType.Command,
                    command: {
                        name: "cf.select.space"
                    },
                },
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
                action1: {
                    name: "Create",
                    type: ActionType.Command,
                    command: {
                        name: "cf.targets.create"
                    },
                },
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
                action1: {
                    name: "Reload",
                    type: ActionType.Command,
                    command: {
                        name: "cf.targets.reload"
                    },
                },
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
                action1: {
                    name: "Set",
                    type: ActionType.Command,
                    command: {
                        name: "cf.target.set"
                    },
                },
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
                action1: {
                    name: "Delete",
                    type: ActionType.Command,
                    command: {
                        name: "cf.target.delete"
                    },
                },
                labels: [
                    {"Project Name": "cap3"},
                    {"Project Type": "CAP"},
                    {"Path": "/home/user/projects/cap3"}
                ]
            };
            items.push(item);

            return items;
        }
    };

    const api = {
        guidedDevContribution
    };

    return api;
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
