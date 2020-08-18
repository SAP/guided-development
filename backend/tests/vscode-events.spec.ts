import * as mocha from "mocha";
import { expect } from "chai";
import * as sinon from "sinon";
import * as _ from "lodash";
import * as vscode from "vscode";
import { VSCodeEvents as VSCodeEvents } from "../src/vscode-events";

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
        _.set(vscode, "window.showInformationMessage", () => {return Promise.resolve("");});
        _.set(vscode, "window.showErrorMessage", () => {return Promise.resolve("");});
        _.set(vscode, "workspace.workspaceFolders", []);
        _.set(vscode, "workspace.updateWorkspaceFolders", (): any => undefined);
        _.set(vscode, "workspace.applyEdit", (): any => undefined);
        _.set(vscode, "commands.executeCommand", (): any => undefined);
        _.set(vscode, "WorkspaceEdit", {});
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
            eventsMock.expects("doClose");
            windowMock.expects("showInformationMessage").
                withExactArgs('success message').resolves();
            const item = {
                id: "1",
                title: "item1",
                description: "item1 desc",
                actionName: "perform",
                actionType: "execute",
                performAction: () => {
                    console.log("hello")
                    return Promise.resolve();
                },
                labels: [{x:"y"}]
            }
            return events.performAction(item);
        });

    });

});
