import { expect } from "chai";
import * as sinon from "sinon";
import * as _ from "lodash";
import { mockVscode } from "./mockUtil";

const testVscode = {
    extensions: {
        all: new Array()
    }
};

mockVscode(testVscode, "src/contributors.ts");
import { Contributors } from "../src/contributors";

describe('Contributors unit test', () => {
    let sandbox: any;
    let extensionsMock: any;
    let contributorsMock: any;

    before(() => {
        sandbox = sinon.createSandbox();
    });

    after(() => {
        sandbox.restore();
    });

    beforeEach(() => {
        extensionsMock = sandbox.mock(testVscode.extensions);
        contributorsMock = sandbox.mock(Contributors);
    });

    afterEach(() => {
        extensionsMock.verify();
        contributorsMock.verify();
    });

    describe('init', () => {
        it("No Contributors", () => {
            contributorsMock.expects("add").never();
            Contributors.init();
        });
    });

    describe('getGuidedDev', () => {
        function createGuidedDevelopmentQuestions(): any[] {
            const questions: any[] = [];
        
            questions.push(
                {
                  guiOptions: {
                    hint: "hint actionTemplate"
                  },
                  type: "list",
                  name: "actionTemplate",
                  message: "Action Template",
                  choices: [
                    'OData action',
                    'Offline action',
                    'Message acion',
                    'Change user password'
                  ]
                }
              );
          
            return questions;
        }
        function getGuidedDev(context: any): any {
            return {
                getMessages() {
                    return messageValue;
                },
                getQuestions() {
                    return createGuidedDevelopmentQuestions();
                },
                async getWorkspaceEdit(answers: any) {
                }
            };
        }
        const messageValue = {title: "Create a new action", 
                              description: "Select the action, target, service and the entity set you want to connect to."};

        const guidedDevName = "guidedDev_1";
        const api = {
            getGuidedDevelopments(context: any) {
                const guidedDevs = new Map<string, any>();
                const guidedDev: any = getGuidedDev(context);
                guidedDevs.set(guidedDevName, guidedDev);
                return guidedDevs;
            },
        };
        const extensionName = "vscode-guided-dev-contrib";
        Contributors.add(extensionName, api);
        
        // it("receives valid contributorName and guidedDevName ---> returns valid guidedDev", () => {
        //     const uiOptions = {
        //         "contributorName": extensionName,
        //         "guidedDevName": guidedDevName
        //       };
        //       const guidedDev = Contributors.getGuidedDev(uiOptions);
        //       expect(guidedDev.getMessages()).to.deep.equal(messageValue);
        // });

        it("receives no contributorName and no guidedDevName ---> returns undefined guidedDev", () => {
            const uiOptions = {};
            const guidedDev = Contributors.getGuidedDev(uiOptions);
                expect(guidedDev).to.be.undefined;
        });
    });

});

