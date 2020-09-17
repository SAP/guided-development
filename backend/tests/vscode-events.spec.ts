import * as mocha from "mocha";
import { expect } from "chai";
import * as sinon from "sinon";
import * as _ from "lodash";
import * as vscode from "vscode";
import { VSCodeEvents as VSCodeEvents } from "../src/vscode-events";
import * as api from "../src/api";

describe('vscode-events unit test', () => {
    let events: VSCodeEvents;
    let sandbox: any;
    let windowMock: any;
    let commandsMock: any;
    let workspaceMock: any;
    let eventsMock: any;

    const executeAction = {
        performAction: () => {
            return vscode.commands.executeCommand("workbench.action.openGlobalSettings");
        },
    }

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

    describe("performAction - on success", () => {
        it("Command as ActionType", () => {
            commandsMock.expects("executeCommand").
                withExactArgs('workbench.action.openGlobalSettings', undefined).resolves();
            const commandOpenAction = api.default.createCommandAction("Open", "", {name: "workbench.action.openGlobalSettings"});
            const item = {
                id: "open-command",
                title: "Open Command  - Global Settings",
                description: "It is easy to configure Visual Studio Code to your liking through its various settings.",
                action1: commandOpenAction,
                labels: [
                    {"Project Name": "cap1"},
                    {"Project Type": "CAP"},
                    {"Path": "/home/user/projects/cap1"}
                ]
            }
            return events.performAction(item, 1);
        });
        it("Snippet as ActionType", () => {
            commandsMock.expects("executeCommand").
                withExactArgs("loadCodeSnippet", {contributorId: "SAPOSS.vscode-snippet-contrib", snippetName: "snippet_1", context: {uri: "uri"}}).resolves();

            const snippetOpenAction = api.default.createSnippetAction("Open", "", {
                contributorId: "SAPOSS.vscode-snippet-contrib", 
                snippetName: "snippet_1", 
                context: {uri: "uri"}                    
            });
                
            const item = {
                id: "open-snippet",
                title: "Open Snippet  - snippet_1",
                description: "It is easy to configure Visual Studio Code to your liking through its various settings.",
                action1: snippetOpenAction,
                labels: [
                    {"Project Name": "cap3"},
                    {"Project Type": "CAP"},
                    {"Path": "/home/user/projects/cap3"}
                ]
            }
            return events.performAction(item, 1);
        });
        it("Execute as ActionType", () => {
            expect(executeAction.performAction());

            const openExecuteAction = api.default.createExecuteAction("Open", "", () => {
                return vscode.commands.executeCommand("workbench.action.openGlobalSettings");
            });

            const item = {
                id: "open-execute",
                title: "Open Global Settings",
                description: "It is easy to configure Visual Studio Code to your liking through its various settings.",
                action1: openExecuteAction,
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
