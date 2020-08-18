// import { IGuidedDev } from '@sap-devx/guided-development-types';
import { IItem, IContribution } from './types/GuidedDev';
import * as vscode from 'vscode';
import * as _ from 'lodash';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "contrib2" is now active!');

    const api: IContribution = {
        // return items based on workspace folders/projects
        getCollections() {
            return [];
        },
        getItems() {
            const items: Array<IItem> = [];
            let item: IItem = {
                id: "cfLogin",
                title: "Cloud Foundry Login",
                description: "Login to Cloud Foundry (cf)",
                actionName: "Login",
                actionType: "execute",
                performAction: () => {
                    return vscode.commands.executeCommand("workbench.action.openGlobalSettings");
                },
                labels: []
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
