import * as mocha from "mocha";
import * as sinon from "sinon";
const datauri = require("datauri"); // eslint-disable-line @typescript-eslint/no-var-requires
import * as fsextra from "fs-extra";
import { expect } from "chai";
import * as _ from "lodash";
import { GuidedDevelopment } from "../src/guided-development";
import { AppLog } from "../src/app-log";
import { AppEvents } from '../src/app-events';
import { IMethod, IPromiseCallbacks, IRpc } from "@sap-devx/webview-rpc/out.ext/rpc-common";
import { IChildLogger } from "@vscode-logging/logger";
import { fail } from "assert";
import { IItem, ICollection, CollectionType } from "../src/types/GuidedDev";
import { IInternalCollection, IInternalItem } from "./Collection";

describe('guidedDevelopment unit test', () => {
    let sandbox: any;
    let fsExtraMock: any;
    let datauriMock: any;
    let loggerMock: any;
    let rpcMock: any;
    let appEventsMock: any;

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
    const guidedDevelopment: GuidedDevelopment = new GuidedDevelopment(rpc, appEvents, outputChannel, testLogger, {}, []);

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
            new GuidedDevelopment(undefined, appEvents,  outputChannel, testLogger, {}, []);
            fail("contructor should throw an exception");
        } catch (error) {
            expect(error.message).to.be.equal("rpc must be set");
        }
    });

    it("getState", async () => {
        const state = await guidedDevelopment["getState"]();
        expect(state).to.deep.equal({});
    });

    it("setCollections", async () => {
        const collection1: IInternalCollection = {
            id: "id1",
            title: "title1",
            description: "description1",
            itemIds: [],
            type: CollectionType.Platform,
            contextualItems: []
        };
        await guidedDevelopment["setCollections"]([collection1]);
        expect(guidedDevelopment["collections"]).to.have.length(1);
    });

    it("getItem", async () => {
        const fqid1 = "extName1.extPublisher1.id1";
        const item1: IInternalItem = {
            id: "id1",
            fqid: fqid1,
            description: "description1",
            title: "title1",
            labels: []
        };

        const fqid2 = "extName1.extPublisher1.id2";
        const item2: IInternalItem = {
            id: "id2",
            fqid: fqid2,
            description: "description2",
            title: "title2",
            labels: [],
            contextualItems: [{item:item1}]
        };

        const collection1: IInternalCollection = {
            id: "id1",
            title: "title1",
            description: "description1",
            itemIds: [],
            type: CollectionType.Platform,
            contextualItems: [{item:item2}]
        };
        await guidedDevelopment["setCollections"]([collection1]);
        const foundItem = guidedDevelopment["getItem"](fqid2);
        expect(foundItem.fqid).to.equal(fqid2);

        const foundSubItem = guidedDevelopment["getItem"](fqid1);
        expect(foundSubItem.fqid).to.equal(fqid1);
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
