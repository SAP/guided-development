import * as vscode from "vscode";
import { expect } from "chai";
import * as sinon from "sinon";
import * as _ from "lodash";
import { Contributors } from "../src/contributors";
import { ICommandAction, IExecuteAction, IFileAction, ISnippetAction, bas, IAction, ActionType } from "@sap-devx/bas-platform-types";

import { VSCodeEvents } from "../src/vscode-events";
import { CollectionType, ICollection, IItem } from "../src/types";

function mockPerformAction(action: IAction, options?: any): void {
    if (action) {
        switch ((action as MockAction).actionType) {
            case ActionType.Command:
                let commandAction = (action as MockCommandAction);
                vscode.commands.executeCommand(commandAction.name, commandAction.params);
                break;
            case ActionType.Execute:
                let executeAction = (action as MockExecuteAction);
                executeAction.executeAction();
                break;
            case ActionType.Snippet:
                let snippetAction = (action as MockSnippetAction);
                vscode.commands.executeCommand("loadCodeSnippet", { contributorId: snippetAction.contributorId, snippetName: snippetAction.snippetName, context: snippetAction.context });
                break;
            case ActionType.File:
                let fileAction = (action as MockFileAction);
                vscode.commands.executeCommand('vscode.open', fileAction.uri, { viewColumn: vscode.ViewColumn.Two });
                break;
        }
    }
}

abstract class MockAction implements IAction {
    actionType: ActionType;
}

class MockExecuteAction extends MockAction implements IExecuteAction {
    executeAction: () => Thenable<any>;

    constructor() {
        super();
        this.actionType = ActionType.Execute;
        this.executeAction = () => { return Promise.resolve() }
    }
}

class MockSnippetAction extends MockAction implements ISnippetAction {
    contributorId: string = "";
    snippetName: string = "";
    context: string = "";

    constructor() {
        super();
        this.actionType = ActionType.Snippet;
    }
}

class MockCommandAction extends MockAction implements ICommandAction {
    name: string;
    params?: any[];

    constructor() {
        super();
        this.actionType = ActionType.Command;
        this.name = "";
    }
}

class MockFileAction extends MockAction implements IFileAction {
    uri: vscode.Uri;

    constructor() {
        super();
        this.actionType = ActionType.File;
        this.uri = vscode.Uri.parse("");
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
    let contributorsMock: any;
    let contribInstance: any;
    
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
        contribInstance = Contributors.getInstance();
        contributorsMock = sandbox.mock(contribInstance);
    });

    afterEach(() => {
        windowMock.verify();
        eventsMock.verify();
        commandsMock.verify();
        workspaceMock.verify();
        contributorsMock.verify();
    });

    describe("performAction - on success", () => {
        it("Command as ActionType", () => {
            commandsMock.expects("executeCommand").
                withExactArgs('workbench.action.openGlobalSettings', undefined).resolves();
            const commandOpenAction = new MockCommandAction();
            commandOpenAction.name = "Open";
            commandOpenAction.name = "workbench.action.openGlobalSettings";

            const item: IItem = {
                id: "open-command",
                title: "Open Command  - Global Settings",
                description: "It is easy to configure Visual Studio Code to your liking through its various settings.",
                action1: {
                    title: "Open title",
                    name: "Open",
                    action: commandOpenAction
                },
                labels: [
                    {"Project Name": "cap1"},
                    {"Project Type": "CAP"},
                    {"Project Path": "/home/user/projects/cap1"}
                ]
            }

            events.setBasAPI(mockBasAPI);
            return events.performAction(item.action1.action);
        });
        it("Snippet as ActionType", () => {
            commandsMock.expects("executeCommand").
                withExactArgs("loadCodeSnippet", { contributorId: "saposs.vscode-snippet-food-contrib", snippetName: "snippet_1", context: { uri: "uri" } }).resolves();

            const snippetOpenAction: ISnippetAction = new MockSnippetAction();
            snippetOpenAction.contributorId = "saposs.vscode-snippet-food-contrib";
            snippetOpenAction.snippetName = "snippet_1";
            snippetOpenAction.context = { uri: "uri" };

            const item: IItem = {
                id: "open-snippet",
                title: "Open Snippet  - snippet_1",
                description: "It is easy to configure Visual Studio Code to your liking through its various settings.",
                action1: {
                    name: "Open",
                    action: snippetOpenAction
                },
                labels: [
                    {"Project Name": "cap3"},
                    {"Project Type": "CAP"},
                    {"Project Path": "/home/user/projects/cap3"}
                ]
            }
            return events.performAction(item.action1.action);
        });
        it("File as ActionType", () => {
            const uri = vscode.Uri.parse("README");
            commandsMock.expects("executeCommand").
                withExactArgs('vscode.open', uri, { viewColumn: vscode.ViewColumn.Two }).resolves();
            const openFileAction: IFileAction = new MockFileAction();
            openFileAction.uri = uri;

            const item: IItem = {
                id: "open-file",
                title: "Open File",
                description: "It is easy to configure Visual Studio Code to your liking through its various settings.",
                action1: {
                    name: "Open",
                    action: openFileAction
                },
                labels: [
                    {"Project Name": "cap3"},
                    {"Project Type": "CAP"},
                    {"Project Path": "/home/user/projects/cap3"}
                ]
            }

            return events.performAction(item.action1.action);
        });
        it("Execute as ActionType", () => {
            expect(executeAction.performAction());

            const openExecuteAction: IExecuteAction = new MockExecuteAction();
            openExecuteAction.executeAction = () => {
                return vscode.commands.executeCommand("workbench.action.openGlobalSettings");
            }

            const item: IItem = {
                id: "open-execute",
                title: "Open Global Settings",
                description: "It is easy to configure Visual Studio Code to your liking through its various settings.",
                action1: {
                    name: "Open",
                    action: openExecuteAction
                },
                labels: [
                    {"Project Name": "cap1"},
                    {"Project Type": "CAP"},
                    {"Project Path": "/home/user/projects/cap1"}
                ]
            }
            return events.performAction(item.action1.action);
        });
    });
    describe("performAction - on failure", () => {
        it("action or actionType does not exist", () => {
            commandsMock.expects("executeCommand").never();
            const commandAction: ICommandAction = new MockCommandAction();
            commandAction.name = "workbench.action.openGlobalSettings";
            const item: IItem = {
                id: "open-command",
                title: "Open Command  - Global Settings",
                description: "It is easy to configure Visual Studio Code to your liking through its various settings.",
                action1: {
                    name: "Open",
                    action: commandAction
                },
                labels: [
                    {"Project Name": "cap1"},
                    {"Project Type": "CAP"},
                    {"Project Path": "/home/user/projects/cap1"}
                ]
            }
            return events.performAction(undefined);
        });
    });

    describe("setData", () => {
        it("contributor set data", () => {
            const item1: IItem = {
                id: "id1",
                description: "description1",
                title: "title1",
                labels: []
            };
            const collection1: ICollection = {
                id: "id1",
                title: "title1",
                description: "description1",
                itemIds: [],
                type: CollectionType.Platform,
            };

            contributorsMock.expects("setData").withExactArgs("extensionId", [collection1], [item1]);
            events.setData("extensionId", [collection1], [item1]);
        });
    });
});
