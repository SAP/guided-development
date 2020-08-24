import * as vscode from 'vscode';
import * as _ from 'lodash';
import { IInternalItem, IInternalCollection } from "./Collection";

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

    private collections: Array<IInternalCollection>;
    private items: Map<string, IInternalItem>;

    public getCollections(): Array<IInternalCollection> {
        return this.collections;
    }

    public getItems(): Map<string, IInternalItem> {
        return this.items;
    }

    private add(extensionId: string, api: any) {
        if (api.guidedDevContribution) {
            this.addItems(extensionId, api.guidedDevContribution.getItems());
            this.addCollections(api.guidedDevContribution.getCollections());
        }
    }

    private static async getApi(extension: vscode.Extension<any>): Promise<any> {
        let api;
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

    private addItems(extensionId: string, items: Array<IInternalItem>) {
        for (const item of items) {
            item.fqid = `${extensionId}.${item.id}`;
            this.items.set(item.fqid, item);
        }
    }

    private addCollections(collections: Array<IInternalCollection>) {
        for (const collection of collections) {
            this.collections.push(collection);
        }
    }

    private initCollectionItems() {
        for (const collection of this.collections) {
            collection.items = [];
            for (const itemId of collection.itemIds) {
                const item: IInternalItem = this.items.get(itemId);
                if (item) {
                    collection.items.push(item);
                    this.initItems(item);
                }
            }
        }
    }

    private initItems(item: IInternalItem) {
        if (!item.itemIds || item.itemIds == []){
            return
        }
        item.items = []
        for (const itemId of item.itemIds) {
            const subitem: IInternalItem = this.items.get(itemId);
            if (subitem) {
                item.items.push(subitem);
                this.initItems(subitem);
            }
        }
    }
}
