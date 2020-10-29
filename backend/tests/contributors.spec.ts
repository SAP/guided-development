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
import { IItem, CollectionType } from "../src/types";
import { IInternalItem, IInternalCollection } from "./Collection";

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
            const itemsMap = Contributors.getInstance()["itemsMap"];
            expect (itemsMap.has(fqid.toLocaleLowerCase())).to.be.true;
            expect (itemsMap.get(fqid.toLocaleLowerCase()).id).to.equal(itemId);
        });
    });

    describe('initSubItems', () => {
        it("No subItems", () => {
            const item1: IItem = {
                id: "id1",
                description: "description1",
                title: "title1",
                labels: []
            };
            Contributors.getInstance()["initSubItems"](item1);
            expect(Contributors.getInstance().getCollections()).to.have.length(0);
        });

        it("item with subItem", () => {
            const itemId1 = "id1";
            const itemId2 = "id2";
            const extensionId = "extId";
            const fqid1 = `${extensionId}.${itemId1}`;
            const fqid2 = `${extensionId}.${itemId2}`;

            const item1: IInternalItem = {
                id: itemId1,
                fqid: fqid1,
                description: "description1",
                title: "title1",
                labels: [],
            };
            const item2: IInternalItem = {
                id: itemId2,
                fqid: fqid2,
                description: "description2",
                title: "title2",
                labels: [],
                itemIds: [fqid1]
            };
            const collection1: IInternalCollection = {
                id: "id1",
                title: "title1",
                description: "description1",
                itemIds: [fqid1, fqid2],
                type: CollectionType.Platform,
                items: [item2]
            };
            Contributors.getInstance().setData(extensionId, [collection1], [item1, item2]);
            const itemsMap = Contributors.getInstance()["itemsMap"];
            expect(itemsMap.get(fqid1.toLocaleLowerCase()).id).to.equal(itemId1);
            expect(itemsMap.get(fqid2.toLocaleLowerCase()).id).to.equal(itemId2);

            Contributors.getInstance()["initSubItems"](item2);
            expect(Contributors.getInstance().getCollections()).to.have.length(1);
        });
    });

    describe('setData', () => {
        it("set 2 items in 1 collection", () => {
            const itemId1 = "id1";
            const itemId2 = "id2";
            const extensionId = "extId";
            const fqid1 = `${extensionId}.${itemId1}`;
            const fqid2 = `${extensionId}.${itemId2}`;

            const item1: IInternalItem = {
                id: itemId1,
                fqid: fqid1,
                description: "description1",
                title: "title1",
                labels: [],
            };
            const item2: IInternalItem = {
                id: itemId2,
                fqid: fqid2,
                description: "description2",
                title: "title2",
                labels: [],
            };
            const collection1: IInternalCollection = {
                id: "id1",
                title: "title1",
                description: "description1",
                itemIds: [fqid1, fqid2],
                type: CollectionType.Platform,
                items: [item1, item2]
            };

            Contributors.getInstance().setData(extensionId, [collection1], [item1, item2]);
            const items = Contributors.getInstance()["getItems"](collection1);
            expect(items).to.have.length(2);
        });
    });
});

