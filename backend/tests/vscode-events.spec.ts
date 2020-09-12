import * as mocha from "mocha";
import { expect } from "chai";
import * as sinon from "sinon";
import * as _ from "lodash";
import * as vscode from "vscode";
import { VSCodeEvents as VSCodeEvents } from "../src/vscode-events";
import { ActionType } from '../src/types/GuidedDev';

describe('vscode-events unit test', () => {
    let events: VSCodeEvents;
    let sandbox: any;
    let windowMock: any;
    let commandsMock: any;
    let workspaceMock: any;
    let eventsMock: any;

    before(() => {
        sandbox = sinon.createSandbox();
        _.set(vscode, "ProgressLocation.Notification", 15);
        _.set(vscode, "Uri.file", (path: string) => {
            return {
                fsPath: path
            };
        });
        _.set(vscode, "commands.executeCommand", (): any => undefined);
        _.set(vscode, "window.showInformationMessage", () => {return Promise.resolve("");});
        _.set(vscode, "window.showErrorMessage", () => {return Promise.resolve("");});
        _.set(vscode, "workspace.workspaceFolders", []);
        _.set(vscode, "workspace.updateWorkspaceFolders", (): any => undefined);
    });

    after(() => {
        sandbox.restore();
    });

    beforeEach(() => {
        events = new VSCodeEvents();
        windowMock = sandbox.mock(vscode.window);
        commandsMock = sandbox.mock(vscode.commands);
        workspaceMock = sandbox.mock(vscode.workspace);
        eventsMock = sandbox.mock(events);
    });

    afterEach(() => {
        windowMock.verify();
        eventsMock.verify();
        commandsMock.verify();
        workspaceMock.verify();
    });

    describe("performAction", () => {
        it("on success", () => {
            commandsMock.expects("executeCommand").
                withExactArgs('workbench.action.openGlobalSettings', undefined).resolves();
            const item = {
                id: "open-command",
                title: "Open Command  - Global Settings",
                description: "It is easy to configure Visual Studio Code to your liking through its various settings.",
                action1: {
                    name: "Open",
                    type: ActionType.Command,
                    command: {
                        name: "workbench.action.openGlobalSettings"
                    },
                },
                labels: [
                    {"Project Name": "cap1"},
                    {"Project Type": "CAP"},
                    {"Path": "/home/user/projects/cap1"}
                ]
            }
            return events.performAction(item, 1);
        });

    });

});
