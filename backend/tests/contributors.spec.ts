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
import { IItem } from "./types/GuidedDev";

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
            Contributors.getInstance().init();
            expect(Contributors.getInstance().getCollections()).to.have.length(0);
        });

        it("setData", () => {
            const itemId = "id1";
            const extensionId = "extId1";
            const fqid = `${extensionId}.${itemId}`;

            const item1: IItem = {
                id: itemId,
                description: "description1",
                title: "title1",
                labels: []
            };

            Contributors.getInstance().setData(extensionId, [], [item1]);
            const itemsMap = Contributors.getInstance().getItems();
            expect (itemsMap.has(fqid)).to.be.true;
            expect(itemsMap.get(fqid).id).to.equal(itemId);
        });
    });
});

