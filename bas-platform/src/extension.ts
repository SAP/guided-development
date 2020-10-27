import * as vscode from 'vscode';
import { bas } from './api';
import { _performAction } from "./actions/performer";

const subscriptions: Array<vscode.Disposable>= [];

function performScheduledActions() {
    const actionsSettings = vscode.workspace.getConfiguration();
    let actionsList: any[] | undefined = actionsSettings.get("actions");
    if (actionsList) {
        for (const action of actionsList) {
            console.log(`performing action ${action.name} of type ${action.constructor.name}`)
            _performAction(action);
        }
        actionsSettings.update("actions", []);
    }
}

export async function activate(context: vscode.ExtensionContext) {
    performScheduledActions();

    return bas;
}

export function deactivate() {
    for (const subscription of subscriptions) {
        subscription.dispose();
    }
}
