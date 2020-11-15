import * as vscode from 'vscode';
import * as net from 'net';
import * as fs from 'fs';
import * as _ from 'lodash';
// import { bas } from '../api';

const SOCKETFILE = '/extbin/basctlSocket';

let basctlServer: net.Server;


function _addBasctlAction(socket: net.Socket) {
    //const openExternal = new bas.actions.ExecuteAction();
    //openExternal.executeAction = async () => {
        socket.on("data", dataBuffer => {
            let data;
            try {
                const strData = _.toString(dataBuffer);
                vscode.window.showInformationMessage("Client string - " + strData);
                data = JSON.parse(strData);
                vscode.window.showInformationMessage("Client data.url - " + data.url);
            } catch (error) {
                const errorMessage = _.get(error, "stack", _.get(error, "message", "failed to parse data"));
                vscode.window.showErrorMessage(errorMessage);
                return;
            }

            if (data.command === "open") {
                vscode.window.showInformationMessage("got open command with url - " + data.url);
                const uri = vscode.Uri.parse(data.url, true);
                vscode.env.openExternal(uri);
            }
        });
   // }

    //bas.actions.performAction(openExternal);
}

export function closeBasctlServer() {
    if (basctlServer) {
        basctlServer.close();
    }
}

function createBasctlServer() {
    try {
        basctlServer = net.createServer(socket => {
            _addBasctlAction(socket);
        }).listen(SOCKETFILE);
    } catch (error) {
        const errorMessage = _.get(error, "stack", _.get(error, "message", "failed to start basctl server"));
        vscode.window.showErrorMessage(errorMessage);
    }
}

export function startBasctlServer() {
    fs.stat(SOCKETFILE, err => {
        if (err) {
            createBasctlServer();
        } else {
            fs.unlink(SOCKETFILE, err => {
                if (err) {
                    throw new Error(err.message);
                }
                createBasctlServer();
            });
        }
    });
}
