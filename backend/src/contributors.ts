import * as vscode from 'vscode';
import * as _ from 'lodash';
import { ICollection, IItem, IContribution } from "./types/GuidedDev";
import { Item, Collection } from "./Collection";

export class Contributors {
    public static getContributors(): Contributors {
        if (!Contributors.contributors) {
            Contributors.contributors = new Contributors();
        }
        return Contributors.contributors;
    }

    private constructor() {
        this.collections = [];
        this.items = new Map();
    }

    private static contributors: Contributors;

    private readonly apiMap = new Map<string, IContribution>();
    private collections: Array<Collection>;
    private items: Map<string, Item>;

    public getCollections(): Array<Collection> {
        return this.collections;
    }

    public getItems(): Map<string, Item> {
        return this.items;
    }

    private add(extensionId: string, api: any) {
        this.addItems(extensionId, api.getItems());
        this.addCollections(api.getCollections());
        this.apiMap.set(extensionId, api);
    }

    private static async getApi(extension: vscode.Extension<any>): Promise<IContribution> {
        let api: IContribution;
        if (!extension.isActive) {
            try {
                api = await extension.activate();
            } catch (error) {
                console.error(error);
                // TODO: Add Logger.error here ("Failed to activate extension", {extensionId: extensionId})
            }
        } else {
            api = extension.exports;
        }
        return api;
    }

    public async init() {
        const allExtensions: readonly vscode.Extension<any>[] = vscode.extensions.all;
        for (const extension of allExtensions) {
            const currentPackageJSON: any = _.get(extension, "packageJSON");
            const guidedDevelopmentContribution: any = _.get(currentPackageJSON, "BASContributes.guided-development");
            if (!_.isNil(guidedDevelopmentContribution)) {
                const api = await Contributors.getApi(extension);
                this.add(extension.id, api);
            }
        }
        this.initCollectionItems();
    }

    private addItems(extensionId: string, items: Array<Item>) {
        for (const item of items) {
            item.fqid = `${extensionId}.${item.id}`;
            this.items.set(item.fqid, item);
        }
    }

    private addCollections(collections: Array<Collection>) {
        for (const collection of collections) {
            this.collections.push(collection);
        }
    }

    private initCollectionItems() {
        for (const collection of this.collections) {
            collection.items = [];
            for (const itemId of collection.itemIds) {
                const item: Item = this.items.get(itemId);
                if (item) {
                    collection.items.push(item);
                    this.initItemsRecursion(item);
                }
            }
        }
    }

    private initItemsRecursion(item: Item) {
        if (!item.itemIds || item.itemIds == []){
            return
        }
        item.items = []
        for (const itemId of item.itemIds) {
            const subitem: Item = this.items.get(itemId);
            if (subitem) {
                item.items.push(subitem);
                this.initItemsRecursion(subitem);
            }
        }
    }
}
