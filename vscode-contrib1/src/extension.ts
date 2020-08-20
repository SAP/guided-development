// import { IGuidedDev } from '@sap-devx/guided-development-types';
import { ICollection, IItem, IContribution } from './types/GuidedDev';
import * as vscode from 'vscode';
import * as _ from 'lodash';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "vscode-contrib1" is now active!');

    const api: IContribution = {
        // return items based on workspace folders/projects
        getCollections() {
            const collections: Array<ICollection> = [];
            let collection: ICollection = {
                id: "collection1",
                title: "Demo collection",
                description: "This is a demo collection. It contains self-contributed items and and an item contributed by a different contributor.",
                itemIds: [
                    "SAPOSS.vscode-contrib1.open",
                    "SAPOSS.vscode-contrib1.open-command",
                    "SAPOSS.vscode-contrib1.clone",
                    "SAPOSS.vscode-contrib2.cfLogin",
                    "SAPOSS.vscode-contrib1.show-info",
                    "SAPOSS.vscode-contrib1.show-items"
                ]
            };
            collections.push(collection);

            return collections;
        },
        getItems() {
            const items: Array<IItem> = [];
            let item: IItem = {
                id: "open",
                title: "Open Global Settings",
                description: "It is easy to configure Visual Studio Code to your liking through its various settings.",
                action: {
                    name: "Open",
                    type: "execute",
                    performAction: () => {
                        return vscode.commands.executeCommand("workbench.action.openGlobalSettings");
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
                id: "clone",
                title: "Cloning code-snippet repository",
                description: "A VSCode extension that provides a simple way to add code snippets..",
                action: {
                    name: "Clone",
                    type: "execute",
                    performAction: () => {
                        return vscode.commands.executeCommand("git.clone", "https://github.com/SAP/code-snippet.git");
                    },
                },
                labels: []
            };
            items.push(item);

            item = {
                id: "open-command",
                title: "Open Global Settings",
                description: "It is easy to configure Visual Studio Code to your liking through its various settings.",
                action: {
                    name: "Open",
                    type: "command",
                    command: {
                        name: "workbench.action.openGlobalSettings"
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
                id: "show-info",
                title: "Show info message",
                description: "Shows a information message",
                action: {
                    name: "Show",
                    type: "execute",
                    performAction: () => {
                        return vscode.window.showInformationMessage("Hello from guided development item");
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
                id: "show-items",
                title: "Show items",
                description: "Shows list of items",
                itemIds: [
                    "SAPOSS.vscode-contrib1.clone",
                    "SAPOSS.vscode-contrib2.cfLogin",
                    "SAPOSS.vscode-contrib1.show-info"
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
    };

    return api;
}

export function deactivate() {}

// OPEN ISSUES:
//   Collection that reference items from other contributors:
//      Are those items necessarily not bound to a specific project?
//      Does that mean they are static?
//      No labels?
//      Constant item IDs?
