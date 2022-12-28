import * as vscode from 'vscode';
import * as _ from 'lodash';
import { IInternalItem, IInternalCollection } from "./Collection";
import { IItem, ICollection } from './types';

export class Contributors {
    private onChangedCallback: (collections: Array<IInternalCollection>) => void;
    private onChangedCallbackThis: Object;

    public registerOnChangedCallback(thisArg: Object, callback: (collections: Array<IInternalCollection>) => void): void {
        this.onChangedCallback = callback;
        this.onChangedCallbackThis = thisArg;
    }

    public static getInstance(): Contributors {
        if (!Contributors.contributors) {
            Contributors.contributors = new Contributors();
        }
        return Contributors.contributors;
    }

    private constructor() {
        this.collectionsMap = new Map();
        this.itemsMap = new Map();
    }

    private static contributors: Contributors;

    private collectionsMap: Map<string, Array<IInternalCollection>>;
    private itemsMap: Map<string, IInternalItem>;

    public getCollections(): Array<IInternalCollection> {
        const collections: Array<IInternalCollection> = [];
        for (const extensionCollections of this.collectionsMap.values()) {
            collections.push(...extensionCollections);
        }

        return _.sortBy(collections, ['type']);
    }

    public getCollectionsInfo(): Array<any> {
        const collections: Array<any> = [];
        for (const extensionId of this.collectionsMap.keys()) {
            this.collectionsMap.get(extensionId).forEach(collection => {
                collections.push({
                    extensionId: extensionId,
                    "id": collection.id,
                    "title": collection.title,
                    "description": collection.description
                });
           });
        }
        return collections;
    }

    private static activateExtension(extension: vscode.Extension<any>): void {
        if (!extension.isActive) {
            try {
                extension.activate();
            } catch (error) {
                console.error(error);
                // TODO: Add Logger.error here ("Failed to activate extension", {extensionId: extensionId})
            }
        }
    }

    private removeItems(extensionId: string): void {
        // remove all items that this extension contributed from itemsMap
        for (const fqid of this.itemsMap.keys()) {
            if (fqid.startsWith(extensionId)) {
                this.itemsMap.delete(fqid);
            }
        }
    }

    public setData(extensionId: string, collections: ICollection[], items: IItem[]): void {
        const extensionIdLower: string = extensionId.toLocaleLowerCase();
        this.addCollections(extensionIdLower, collections as IInternalCollection[]);
        this.addItems(extensionIdLower, items);
        this.initCollectionItems();
        if (this.onChangedCallback) {
            this.onChangedCallback.call(this.onChangedCallbackThis, this.getCollections());
        }
        vscode.commands.executeCommand('guidedDevelopment.refreshCenter');
    }

    public init() {
        const allExtensions: readonly vscode.Extension<any>[] = vscode.extensions.all;
        for (const extension of allExtensions) {
            if (extension?.packageJSON?.BASContributes?.["guided-development"]) {
                Contributors.activateExtension(extension);
            }
        }
    }

    private addItems(extensionId: string, items: Array<IInternalItem>) {
        this.removeItems(extensionId);

        for (const item of items) {
            item.fqid = `${extensionId}.${item.id}`;
            this.itemsMap.set(item.fqid, item);
        }
    }

    private addCollections(extensionId: string, collections: Array<IInternalCollection>) {
        this.collectionsMap.set(extensionId, collections);
    }

    private initCollectionItems() {
        for (const collections of this.collectionsMap.values()) {
            for (const collection of collections) {
                // TODO: handle context for subitems
                // TODO: handle duplicates?
                collection.items = this.getItems(collection);
            }
        }
    }

    private getItems(collection: IInternalCollection): IInternalItem[] {
        const result: IInternalItem[] = [];

        for (const itemId of collection.itemIds) {
            const item = this.itemsMap.get(itemId.toLocaleLowerCase());
            if (item) {
                this.initSubItems(item);
                result.push(item);
            } else {
                console.error(`Could not find item id ${itemId}`)
            }
        }

        return result;
    }

    private initSubItems(item: IInternalItem) {
        if (item.itemIds) {
            item.items = [];
            for (const itemId of item.itemIds) {
                const subitem: IInternalItem = this.itemsMap.get(itemId.toLowerCase());
                if (subitem) {
                    item.items.push(subitem);
                    this.initSubItems(subitem);
                }
            }
        }
    }
}
