import * as vscode from "vscode";
import * as mocha from "mocha";
import { expect } from "chai";
import * as sinon from "sinon";
import * as _ from "lodash";
import { ICommandAction, IExecuteAction, IFileAction, ISnippetAction, bas, IAction, ISnippet, ICommand, IFile, ActionType } from "@sap-devx/bas-platform-types/out/src/api";

import { VSCodeEvents } from "../src/vscode-events";

function mockPerformAction(action: IAction, options?: any): void {
    if (action) {
        switch ((action as MockAction)._actionType) {
            case ActionType.Command:
                let commandAction = (action as MockCommandAction);
                vscode.commands.executeCommand(commandAction.command.name, commandAction.command.params);
                break;
            case ActionType.Execute:
                let executeAction = (action as MockExecuteAction);
                executeAction.performAction();
                break;
            case ActionType.Snippet:
                let snippetAction = (action as MockSnippetAction);
                vscode.commands.executeCommand("loadCodeSnippet", { contributorId: snippetAction.snippet.contributorId, snippetName: snippetAction.snippet.snippetName, context: snippetAction.snippet.context });
                break;
            case ActionType.File:
                let fileAction = (action as MockFileAction);
                vscode.commands.executeCommand('vscode.open', fileAction.file.uri, { viewColumn: vscode.ViewColumn.Two });
                break;
        }
    }
}

abstract class MockAction implements IAction {
    name: string = "";
    title?: string = "";
    _actionType?: ActionType = ActionType.Command;
}

class MockExecuteAction extends MockAction implements IExecuteAction {
    performAction: () => Thenable<any>;

    constructor() {
        super();
        this._actionType = ActionType.Execute;
        this.performAction = () => { return Promise.resolve() }
    }
}

class MockSnippetAction extends MockAction implements ISnippetAction {
    snippet: ISnippet;

    constructor() {
        super();
        this._actionType = ActionType.Snippet;
        this.snippet = { contributorId: "", context: "", snippetName: "" };
    }
}

class MockCommandAction extends MockAction implements ICommandAction {
    command: ICommand;

    constructor() {
        super();
        this._actionType = ActionType.Command;
        this.command = { name: "" };
    }
}

class MockFileAction extends MockAction implements IFileAction {
    file: IFile;

    constructor() {
        super();
        this._actionType = ActionType.File;
        this.file = { uri: vscode.Uri.parse("") };
    }
}

const mockBasAPI: typeof bas = {
    getExtensionAPI: <T>(extensionId: string): Promise<T> => {
        return Promise.resolve(undefined);
    },
    actions: {
        performAction: mockPerformAction,
        ExecuteAction: MockExecuteAction,
        SnippetAction: MockSnippetAction,
        CommandAction: MockCommandAction,
        FileAction: MockFileAction
    }
}

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
        _.set(vscode, "Uri.parse", (path: string) => {
            return {
                fsPath: path
            };
        });
        _.set(vscode, "ViewColumn.Two", 2);
        _.set(vscode, "commands.executeCommand", (): any => undefined);
        _.set(vscode, "window.showInformationMessage", () => { return Promise.resolve(""); });
        _.set(vscode, "window.showErrorMessage", () => { return Promise.resolve(""); });
        _.set(vscode, "workspace.workspaceFolders", []);
        _.set(vscode, "workspace.updateWorkspaceFolders", (): any => undefined);
    });

    after(() => {
        sandbox.restore();
    });

    beforeEach(() => {
        events = VSCodeEvents.getInstance();
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
            const commandOpenAction = new MockCommandAction();
            commandOpenAction.name = "Open";
            commandOpenAction.command = { name: "workbench.action.openGlobalSettings" };

            const item = {
                id: "open-command",
                title: "Open Command  - Global Settings",
                description: "It is easy to configure Visual Studio Code to your liking through its various settings.",
                action1: commandOpenAction,
                labels: [
                    {"Project Name": "cap1"},
                    {"Project Type": "CAP"},
                    {"Project Path": "/home/user/projects/cap1"}
                ]
            }

            events.setBasAPI(mockBasAPI);
            return events.performAction(item, 1);
        });
        it("Snippet as ActionType", () => {
            commandsMock.expects("executeCommand").
                withExactArgs("loadCodeSnippet", { contributorId: "saposs.vscode-food-snippet-contrib", snippetName: "snippet_1", context: { uri: "uri" } }).resolves();

            const snippetOpenAction: ISnippetAction = new MockSnippetAction();
            snippetOpenAction.name = "Open";
            snippetOpenAction.snippet = {
                contributorId: "saposs.vscode-food-snippet-contrib",
                snippetName: "snippet_1",
                context: { uri: "uri" }
            };

            const item = {
                id: "open-snippet",
                title: "Open Snippet  - snippet_1",
                description: "It is easy to configure Visual Studio Code to your liking through its various settings.",
                action1: snippetOpenAction,
                labels: [
                    {"Project Name": "cap3"},
                    {"Project Type": "CAP"},
                    {"Project Path": "/home/user/projects/cap3"}
                ]
            }
            return events.performAction(item, 1);
        });
        it("File as ActionType", () => {
            const uri = vscode.Uri.parse("README");
            commandsMock.expects("executeCommand").
                withExactArgs('vscode.open', uri, { viewColumn: vscode.ViewColumn.Two }).resolves();
            const openFileAction: IFileAction = new MockFileAction();
            openFileAction.name = "Open";
            openFileAction.file = { uri };

            const item = {
                id: "open-file",
                title: "Open File",
                description: "It is easy to configure Visual Studio Code to your liking through its various settings.",
                action1: openFileAction,
                labels: [
                    {"Project Name": "cap3"},
                    {"Project Type": "CAP"},
                    {"Project Path": "/home/user/projects/cap3"}
                ]
            }

            return events.performAction(item, 1);
        });
        it("Execute as ActionType", () => {
            expect(executeAction.performAction());

            const openExecuteAction: IExecuteAction = new MockExecuteAction();
            openExecuteAction.name = "Open";
            openExecuteAction.performAction = () => {
                return vscode.commands.executeCommand("workbench.action.openGlobalSettings");
            }

            const item = {
                id: "open-execute",
                title: "Open Global Settings",
                description: "It is easy to configure Visual Studio Code to your liking through its various settings.",
                action1: openExecuteAction,
                labels: [
                    {"Project Name": "cap1"},
                    {"Project Type": "CAP"},
                    {"Project Path": "/home/user/projects/cap1"}
                ]
            }
            return events.performAction(item, 1);
        });
    });
    describe("performAction - on failure", () => {
        it("action or actionType does not exist", () => {
            commandsMock.expects("executeCommand").never();
            const commandAction: ICommandAction = new MockCommandAction();
            commandAction.name = "Open";
            commandAction.command = { name: "workbench.action.openGlobalSettings" };
            const item = {
                id: "open-command",
                title: "Open Command  - Global Settings",
                description: "It is easy to configure Visual Studio Code to your liking through its various settings.",
                action1: commandAction,
                labels: [
                    {"Project Name": "cap1"},
                    {"Project Type": "CAP"},
                    {"Project Path": "/home/user/projects/cap1"}
                ]
            }
            return events.performAction(undefined, 1);
        });
    });
});
