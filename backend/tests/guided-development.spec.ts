import * as mocha from "mocha";
import * as sinon from "sinon";
const datauri = require("datauri"); // eslint-disable-line @typescript-eslint/no-var-requires
import * as fsextra from "fs-extra";
import { expect } from "chai";
import * as _ from "lodash";
import * as path from "path";
import {GuidedDevelopment} from "../src/guided-development";
import { AppLog } from "./app-log";
import { AppEvents } from './app-events';
import { IMethod, IPromiseCallbacks, IRpc } from "@sap-devx/webview-rpc/out.ext/rpc-common";
import { IChildLogger } from "@vscode-logging/logger";
import * as os from "os";
import { fail } from "assert";
import { IItem, ICollection } from "./types/GuidedDev";
import { IInternalItem } from "./Collection";

describe('guidedDevelopment unit test', () => {
    let sandbox: any;
    let fsExtraMock: any;
    let datauriMock: any;
    let loggerMock: any;
    let rpcMock: any;
    let appEventsMock: any;
    const UTF8 = "utf8";
    const PACKAGE_JSON = "package.json";

    const choiceMessage = 
        "Some quick example text of the guidedDevelopment description. This is a long text so that the example will look good.";
    class TestEvents implements AppEvents {
        public performAction(item: IItem, index: number): Promise<any> {
            return;
        }
        public setData(extensionId: string, collections: ICollection[], items: IItem[]): void {
            
        }
    }
    class TestRpc implements IRpc {
        public  timeout: number;
        public promiseCallbacks: Map<number, IPromiseCallbacks>;
        public methods: Map<string, IMethod>;
        public sendRequest(): void {
            return;
        }            
        public sendResponse(): void {
            return;
        } 
        public setResponseTimeout(): void {
            return;
        }
        public registerMethod(): void {
            return;
        } 
        public unregisterMethod(): void {
            return;
        } 
        public listLocalMethods(): string[] {
            return [];
        }
        public handleResponse(): void {
            return;
        } 
        public listRemoteMethods(): Promise<string[]> {
            return Promise.resolve([]);
        }
        public invoke(): Promise<any> {
            return Promise.resolve();
        }
        public handleRequest(): Promise<void> {
            return Promise.resolve();
        }
    }
    class TestOutputChannel implements AppLog {
        public log(): void {
            return;
        }            
        public writeln(): void {
            return;
        } 
        public create(): void {
            return;
        }  
        public force(): void {
            return;
        } 
        public conflict(): void {
            return;
        }  
        public identical(): void {
            return;
        }  
        public skip(): void {
            return;
        } 
        public showOutput(): boolean {
            return false;
        }  
    }

    const testLogger = {debug: () => {}, error: () => {}, fatal: () => {}, warn: () => {}, info: () => {}, trace: () => {}, getChildLogger: () => ({} as IChildLogger)};

    const rpc = new TestRpc();
    const outputChannel = new TestOutputChannel();
    const appEvents = new TestEvents();
    const guidedDevelopment: GuidedDevelopment = new GuidedDevelopment(rpc, appEvents, outputChannel, testLogger, {}, [], new Map());

    let itemIds = ["saposs.contrib1.create","saposs.contrib1.open","saposs.contrib2.delete"];
    let items: Map<String,IInternalItem>;

    before(() => {
        sandbox = sinon.createSandbox();
    });

    after(() => {
        sandbox.restore();
    });

    beforeEach(() => {
        fsExtraMock = sandbox.mock(fsextra);
        datauriMock = sandbox.mock(datauri);
        rpcMock = sandbox.mock(rpc);
        loggerMock = sandbox.mock(testLogger);
        appEventsMock = sandbox.mock(appEvents);
    });

    afterEach(() => {
        fsExtraMock.verify();
        datauriMock.verify();
        rpcMock.verify();
        loggerMock.verify();
        appEventsMock.verify();
    });

    it("constructor", () => {
        try {
            new GuidedDevelopment(undefined, appEvents,  outputChannel, testLogger, {}, [], new Map());
            fail("contructor should throw an exception");
        } catch (error) {
            expect(error.message).to.be.equal("rpc must be set");
        }
    });




    it("getState", async () => {
        const state = await guidedDevelopment["getState"]();
        expect(state).to.deep.equal({});
    });

    describe.skip("onFrontendReady", () => {
        it("flow is successfull", async () => {
            rpcMock.expects("invoke").withArgs("showPrompt").resolves(
                {actionName: "actionName"},
                {actionTemplate: "OData action"},
                {actionType: "Create entity"});
            await guidedDevelopment["onFrontendReady"]();
        });
    });

    it("toggleOutput", () => {
        const res = guidedDevelopment["toggleOutput"]();
        expect(res).to.be.false;
    });

    it("getErrorInfo", () => {
        const errorInfo = "Error Info";
        const res = guidedDevelopment["getErrorInfo"](errorInfo);
        expect(res).to.be.equal(errorInfo);
    });
});
