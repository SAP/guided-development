import * as mocha from "mocha";
import * as sinon from "sinon";
const datauri = require("datauri"); // eslint-disable-line @typescript-eslint/no-var-requires
import * as fsextra from "fs-extra";
import { expect } from "chai";
import * as _ from "lodash";
import * as path from "path";
import {GuidedDevelopment} from "../src/guided-development";
import * as yeomanEnv from "yeoman-environment";
import { AppLog } from "./app-log";
import { AppEvents } from './app-events';
import { IMethod, IPromiseCallbacks, IRpc } from "@sap-devx/webview-rpc/out.ext/rpc-common";
import { IChildLogger } from "@vscode-logging/logger";
import * as os from "os";
import { fail } from "assert";
import Environment = require("yeoman-environment");

describe('guidedDevelopment unit test', () => {
    let sandbox: any;
    let yeomanEnvMock: any;
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
        public async doApply(we: any): Promise<any> {
            return;
        }
        public doSnippeDone(success: boolean, message: string, targetPath?: string): void {
            return;
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
    const uiOptions = {messages: {title: "guidedDev title"}};
    const guidedDevelopment: GuidedDevelopment = new GuidedDevelopment(rpc, appEvents, outputChannel, testLogger, uiOptions);

    before(() => {
        sandbox = sinon.createSandbox();
    });

    after(() => {
        sandbox.restore();
    });

    beforeEach(() => {
        yeomanEnvMock = sandbox.mock(yeomanEnv);
        fsExtraMock = sandbox.mock(fsextra);
        datauriMock = sandbox.mock(datauri);
        rpcMock = sandbox.mock(rpc);
        loggerMock = sandbox.mock(testLogger);
        appEventsMock = sandbox.mock(appEvents);
    });

    afterEach(() => {
        yeomanEnvMock.verify();
        fsExtraMock.verify();
        datauriMock.verify();
        rpcMock.verify();
        loggerMock.verify();
        appEventsMock.verify();
    });

    it("constructor", () => {
        try {
            new GuidedDevelopment(undefined, undefined, undefined, undefined, undefined);
            fail("contructor should throw an exception");
        } catch (error) {
            expect(error.message).to.be.equal("rpc must be set");
        }
    });

    it("getState", async () => {
        const state = await guidedDevelopment["getState"]();
        expect(state).to.deep.equal(uiOptions);
    });

    describe("receiveIsWebviewReady", () => {
        it("flow is successfull", async () => {
            rpcMock.expects("invoke").withArgs("showPrompt").resolves(
                {actionName: "actionName"},
                {actionTemplate: "OData action"},
                {actionType: "Create entity"});
            appEventsMock.expects("doApply");
            await guidedDevelopment["receiveIsWebviewReady"]();
        });

        it("no prompt ---> an error is thrown", async () => {
            loggerMock.expects("error");
            appEventsMock.expects("doApply").never();
            await guidedDevelopment["receiveIsWebviewReady"]();
        });

        it("prompt throws exception ---> an error is thrown", async () => {
            rpcMock.expects("invoke").withArgs("showPrompt").rejects(new Error());
            loggerMock.expects("error");
            appEventsMock.expects("doApply").never();
            await guidedDevelopment["receiveIsWebviewReady"]();
        });
    });

    describe("showPrompt", () => {
        it("prompt without questions", async () => {
            const answers = await guidedDevelopment.showPrompt([]);
            expect(answers).to.be.empty;
        });
    });

    describe("funcReplacer", () => {
        it("with function", () => {
            const res = GuidedDevelopment["funcReplacer"]("key", () => { return; });
            expect(res).to.be.equal("__Function");
        });

        it("without function", () => {
            const res = GuidedDevelopment["funcReplacer"]("key", "value");
            expect(res).to.be.equal("value");
        });
    });

    it("toggleOutput", () => {
        const guidedDevelopmentInstance: GuidedDevelopment = new GuidedDevelopment(rpc, appEvents, outputChannel, testLogger, {});
        const res = guidedDevelopmentInstance["toggleOutput"]();
        expect(res).to.be.false;
    });

    it("getErrorInfo", () => {
        const guidedDevelopmentInstance: GuidedDevelopment = new GuidedDevelopment(rpc, appEvents, outputChannel, testLogger, {});
        const errorInfo = "Error Info";
        const res = guidedDevelopmentInstance["getErrorInfo"](errorInfo);
        expect(res).to.be.equal(errorInfo);
    });

    describe("answersUtils", () => {
        it("setDefaults", () => {
            const questions = [
                {name: "q1", default: "a"},
                {name: "q2", default: () => { return "b";}},
                {name: "q3"}
            ];
            const answers = {
                q1: "x",
                q2: "y",
                q3: "z"
            };
            for (const question of questions) {
                switch (question.name) {
                    case "a":
                        expect((question as any)["answer"]).to.equal("x");
                        break;
                    case "b":
                        expect((question as any)["answer"]).to.equal("y");
                        break;
                    case "c":
                        expect((question as any)["answer"]).to.equal("z");
                        break;
                }
            }
        });
    });

    describe("showPrompt", () => {
        it("returns answers", async () => {
            const firstName = "john";
            rpc.invoke = async () => {
                return {
                    firstName,
                    lastName: "doe"
                };
            };
            const guidedDevelopmentInstance: GuidedDevelopment = new GuidedDevelopment(rpc, appEvents, outputChannel, testLogger, {});
            const questions = [{name: "q1"}];
            const response = await guidedDevelopmentInstance.showPrompt(questions);
            expect (response.firstName).to.equal(firstName);
        });

    });

    describe("onSuccess - onFailure", () => {
        let doSnippeDoneSpy: any;

        beforeEach(() => {
            doSnippeDoneSpy = sandbox.spy(appEvents, "doSnippeDone");
        });

        afterEach(() => {
            doSnippeDoneSpy.restore();
        });

        it("onSuccess", () => {
            guidedDevelopment["onSuccess"]("testGuidedDevName");
            expect(doSnippeDoneSpy.calledWith(true, "'testGuidedDevName' guided-development has been created.")).to.be.true;
        });

        it("onFailure", async () => {
            await guidedDevelopment["onFailure"]("testGuidedDevName", "testError");
            expect(doSnippeDoneSpy.calledWith(false, "testGuidedDevName guided-development failed.\ntestError")).to.be.true;
        });
    });

    describe("Custom Question Event Handlers", () => {
        it("addCustomQuestionEventHandlers()", async () => {
            const testEventFunction = () => {
                return true;
            };
            const questions = [
                {
                    name:"q1",
                    guiType: "questionType"
                }
            ];
            const guidedDevelopmentInstance: GuidedDevelopment = new GuidedDevelopment(rpc, appEvents, outputChannel, testLogger, {});

            guidedDevelopmentInstance["addCustomQuestionEventHandlers"](questions);
            expect(questions[0]).to.not.have.property("testEvent");

            guidedDevelopmentInstance.registerCustomQuestionEventHandler("questionType", "testEvent", testEventFunction);
            guidedDevelopmentInstance["addCustomQuestionEventHandlers"](questions);
            expect(questions[0]).to.have.property("testEvent");
            expect((questions[0] as any)["testEvent"]).to.equal(testEventFunction);
        });
    });

    describe("evaluateMethod()", () => {
        it("custom question events", async () => {
            const testEventFunction = () => {
                return true;
            };
            const guidedDevelopmentInstance: GuidedDevelopment = new GuidedDevelopment(rpc, appEvents, outputChannel, testLogger, {});
            guidedDevelopmentInstance.registerCustomQuestionEventHandler("questionType", "testEvent", testEventFunction);
            guidedDevelopmentInstance["currentQuestions"] = [{name:"question1", guiType: "questionType"}];
            const response = await guidedDevelopmentInstance["evaluateMethod"](null, "question1", "testEvent");
            expect(response).to.be.true;
        });

        it("question method is called", async () => {
            const guidedDevelopmentInstance: GuidedDevelopment = new GuidedDevelopment(rpc, appEvents, outputChannel, testLogger, {});
            guidedDevelopmentInstance["currentQuestions"] = [{name:"question1", method1:()=>{
                return true;
            }}];
            const response = await guidedDevelopmentInstance["evaluateMethod"](null, "question1", "method1");
            expect(response).to.be.true;
        });

        it("no relevant question", async () => {
            const guidedDevelopmentInstance: GuidedDevelopment = new GuidedDevelopment(rpc, appEvents, outputChannel, testLogger, {});
            guidedDevelopmentInstance["currentQuestions"] = [{name:"question1", method1:()=>{
                return true;
            }}];
            const response = await guidedDevelopmentInstance["evaluateMethod"](null, "question2", "method2");
            expect(response).to.be.undefined;
        });

        it("no questions", async () => {
            const guidedDevelopmentInstance: GuidedDevelopment = new GuidedDevelopment(rpc, appEvents, outputChannel, testLogger, {});
            const response = await guidedDevelopmentInstance["evaluateMethod"](null, "question1", "method1");
            expect(response).to.be.undefined;
        });

        it("method throws exception", async () => {
            const guidedDevelopmentInstance: GuidedDevelopment = new GuidedDevelopment(rpc, appEvents, outputChannel, testLogger, {});
            guidedDevelopmentInstance["gen"] = Object.create({});
            guidedDevelopmentInstance["gen"].options = {};
            guidedDevelopmentInstance["currentQuestions"] = [{name:"question1", method1:()=>{
                throw new Error("Error");
            }}];
            try {
                await guidedDevelopmentInstance["evaluateMethod"](null, "question1", "method1");
            } catch(e) {
                expect(e.toString()).to.contain("method1");
            }
        });
    });

    describe("applyCode", () => {
        const title = "guidedDev title";
        let guidedDevelopmentInstanceMock: any;
        let guidedDevelopmentInstance: GuidedDevelopment;

        beforeEach(() => {
            guidedDevelopmentInstance = new GuidedDevelopment(rpc, appEvents, outputChannel, testLogger, {messages: {title: title}});
            guidedDevelopmentInstanceMock = sandbox.mock(guidedDevelopmentInstance);
        });

        afterEach(() => {
            guidedDevelopmentInstanceMock.verify();
        });

        it("createGuidedDevelopmentWorkspaceEdit succeeds ---> onSuccess is called", async () => {
            const onSuccessSpy = sandbox.spy(guidedDevelopmentInstance, "onSuccess");
            guidedDevelopmentInstanceMock.expects("createGuidedDevelopmentWorkspaceEdit").resolves();
            await guidedDevelopmentInstance["applyCode"]({});
            expect(onSuccessSpy.calledWith(title)).to.be.true;
            onSuccessSpy.restore();
        });

        it("createGuidedDevelopmentWorkspaceEdit fails ---> onFailure is called", async () => {
            const onFailureSpy = sandbox.spy(guidedDevelopmentInstance, "onFailure");
            const error = new Error("error");
            guidedDevelopmentInstanceMock.expects("createGuidedDevelopmentWorkspaceEdit").rejects(error);
            await guidedDevelopmentInstance["applyCode"]({});
            expect(onFailureSpy.calledWith(title, error)).to.be.true;
            onFailureSpy.restore();
        });
    });
    
    const guidedDev: any = {
        getMessages() {
            return "getMessages";
        },
        getQuestions() {
            return "createGuidedDevelopmentQuestions";
        },
        async getWorkspaceEdit(answers: any, context: any) {
            return "getWorkspaceEdit";
        }
    };

    describe("createGuidedDevelopmentWorkspaceEdit", () => {
        it("guidedDev has getWorkspaceEdit ---> call getWorkspaceEdit", async () => {
            const myGuidedDevelopment = new GuidedDevelopment(rpc, appEvents, outputChannel, testLogger, {guidedDev: guidedDev});
            const we = await myGuidedDevelopment["createGuidedDevelopmentWorkspaceEdit"]({});
            expect(we).to.be.equal("getWorkspaceEdit");
        });
    });

    describe("createGuidedDevelopmentQuestions", () => {
        it("guidedDev has getQuestions ---> call getQuestions", async () => {
            const myGuidedDevelopment = new GuidedDevelopment(rpc, appEvents, outputChannel, testLogger, {guidedDev: guidedDev});
            const we = await myGuidedDevelopment["createGuidedDevelopmentQuestions"]();
            expect(we).to.be.equal("createGuidedDevelopmentQuestions");
        });
    });

    describe("registerCustomQuestionEventHandler", () => {
        it("all the events handlers for the same question type are in the same entry", () => {
            const testEventFunction = () => {
                return true;
            };
            const guidedDevelopmentInstance: GuidedDevelopment = new GuidedDevelopment(rpc, appEvents, outputChannel, testLogger, {});

            guidedDevelopmentInstance.registerCustomQuestionEventHandler("questionType", "testEvent1", testEventFunction);
            expect(guidedDevelopmentInstance["customQuestionEventHandlers"].size).to.be.equal(1);

            guidedDevelopmentInstance.registerCustomQuestionEventHandler("questionType", "testEvent2", testEventFunction);  
            expect(guidedDevelopmentInstance["customQuestionEventHandlers"].size).to.be.equal(1);

        });
    });
});
