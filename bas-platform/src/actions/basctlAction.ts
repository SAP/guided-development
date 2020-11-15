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
        const data: any = getRequestData(dataBuffer);

        if (data.command === "open") {
            const uri = vscode.Uri.parse(data.url, true);
            vscode.env.openExternal(uri);
        }
    });
    // }

    //bas.actions.performAction(openExternal);
}

function getRequestData(dataBuffer: any) {
    try {
        return JSON.parse(_.toString(dataBuffer));
    } catch (error) {
        showErrorMessage(error, "failed to parse basctl request data");
        return {};
    }
}

function showErrorMessage(error: any, defaultError: string) {
    const errorMessage = _.get(error, "stack", _.get(error, "message", defaultError));
    vscode.window.showErrorMessage(errorMessage);
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
        showErrorMessage(error, "failed to start basctl server");
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
