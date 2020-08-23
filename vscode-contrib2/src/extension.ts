// import { IGuidedDev } from '@sap-devx/guided-development-types';
import { ICollection, IItem, IGuidedDevContribution } from './types/GuidedDev';
import * as vscode from 'vscode';
import * as _ from 'lodash';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "vscode-contrib2" is now active!');

    const guidedDevContribution : IGuidedDevContribution = {
        // return items based on workspace folders/projects
        getCollections: () => {
            const collections: Array<ICollection> = [];
            let collection: ICollection = {
                id: "collection2",
                title: "Demo collection 2",
                description: "This is a demo collection. It contains self-contributed items and and an item contributed by a different contributor.",
                itemIds: [
                    "SAPOSS.vscode-contrib2.cfLogin",
                    "SAPOSS.vscode-contrib1.show-items"
                ]
            };
            collections.push(collection);

            return collections;
        },
        getItems: () => {
            const items: Array<IItem> = [];
            let item: IItem = {
                id: "cfLogin",
                title: "Cloud Foundry Login",
                description: "Login to Cloud Foundry (cf)",
                action: {
                    name: "Login",
                    type: "execute",
                    performAction: () => {
                        return vscode.commands.executeCommand("workbench.action.openGlobalSettings");
                    },
                },
                labels: []
            };
            items.push(item);

            item = {
                id: "show-items",
                title: "Show items",
                description: "Shows list of items",
                itemIds: [
                    "SAPOSS.vscode-contrib1.clone",
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
    }

    const api = {
        guidedDevContribution
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
