import * as vscode from 'vscode';
import { bas } from './api';
import { _performAction } from "./actions/performer";
import * as net from 'net';
import * as fs from 'fs';

const subscriptions: Array<vscode.Disposable> = [];

const SOCKETFILE = '/extbin/basctlSocket';
let basctlServer: net.Server;

function performScheduledActions() {
    const actionsSettings = vscode.workspace.getConfiguration();
    let actionsList: any[] | undefined = actionsSettings.get("actions");
    if (actionsList && actionsList.length > 0) {
        for (const action of actionsList) {
            console.log(`performing action ${action.name} of type ${action.constructor.name}`)
            _performAction(action);
        }
        actionsSettings.update("actions", []);
    }
}

function startBasctlServer() {
    fs.stat(SOCKETFILE, err => {
        if (err) {
            createServer();
        } else {
            fs.unlink(SOCKETFILE, err => {
                if (err) {
                    throw new Error(err.message);
                }
                createServer();
            });
        }
    });
}

function createServer() {
    basctlServer = net.createServer(stream => {
        stream.on("data", (dataBuffer: any) => {
            const data = JSON.parse(dataBuffer.toString());
            const uri = vscode.Uri.parse(data.url, true);
            vscode.env.openExternal(uri); // TODO: cast to IAction
        });
    }).listen(SOCKETFILE);
}

export async function activate(context: vscode.ExtensionContext) {
    performScheduledActions();

    startBasctlServer();

    return bas;
}

export function deactivate() {
    for (const subscription of subscriptions) {
        subscription.dispose();
    }

    basctlServer.close();
}
