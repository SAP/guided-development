// import { IGuidedDev } from '@sap-devx/guided-development-types';
import { ICollection, CollectionType, IItem, ActionType, IGuidedDevContribution } from './types/GuidedDev';
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
        },
        getItems: () => {
            const items: Array<IItem> = [];
            let item: IItem = {
                id: "cf-login",
                title: "Cloud Foundry Login",
                description: "Login to Cloud Foundry (cf)",
                action1: {
                    name: "Login",
                    title: "Cloud Foundry Login",
                    type: ActionType.Command,
                    command: {
                        name: "cf.login"
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
