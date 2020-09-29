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
    }
    actionsSettings.update("actions", []);
}

export async function activate(context: vscode.ExtensionContext) {
    performScheduledActions();

    vscode.workspace.onDidChangeWorkspaceFolders((e) => {
        // when first folder is added to the workspace, the extension is reactivated, so we could let the find files upon activation handle this use-case
        // when last folder removed from workspace, the extension is reactivated, so we could let the find files upon activation handle this use-case

        for (const folder of e.removed) {
            console.dir(`${folder.uri.path} removed from workspace`);
        }

        for (const folder of e.added) {
            console.dir(`${folder.uri.path} added to workspace`);
        }
    });

    const watcher = vscode.workspace.createFileSystemWatcher(".vscode/settings.json");
    watcher.onDidDelete((e) => {
        console.log(`${e.path} deleted`);
    });

    watcher.onDidCreate((e) => {
        console.log(`${e.path} created`);
    });

    watcher.onDidChange((e) => {
        console.log(`${e.path} changed`);
    });

    vscode.workspace.findFiles(".vscode/settings.json").then((uris) => {
        for (const uri of uris) {
            console.log(`found ${uri.path} on activation`);
        }
    });

    return bas;
}

export function deactivate() {
    for (const subscription of subscriptions) {
        subscription.dispose();
    }
}
