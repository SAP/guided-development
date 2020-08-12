import * as vscode from 'vscode';
import * as _ from 'lodash';


export class Contributors {
    private static readonly apiMap = new Map<string, any>();
    private static readonly itemMap = new Map<string, any>(); // TODO: replace any with IGuidedDevItem
    private static readonly collectionMap = new Map<string, any>(); // TODO: replace any with IGuidedDevCollection

    public static getGuidedDevs(uiOptions: any): any[] {
        let guidedDevs: any[] = [];
        const guidedDevContext = _.get(uiOptions, "context");
        Contributors.collectionMap.forEach((value: any, key: any) => {
            value.items.forEach((item: any) => {
                item.data = Contributors.itemMap.get(item.id);
            });
            guidedDevs.push(value);
        })
		return guidedDevs;
    }

    public static add(extensionId: string, api: any) {
        Contributors.apiMap.set(extensionId, api);
        const guidedDev = api.getGuidedDevelopments();
        for (let item of guidedDev.items) {
            let itemKey = extensionId + "." + item.id;
            Contributors.itemMap.set(itemKey, item);
        }
        for (let collection of guidedDev.collections) {
            let collectionKey = extensionId + "." + collection.id;
            Contributors.collectionMap.set(collectionKey, collection);
        }
    }

    private static async getApi(extension: vscode.Extension<any>, extensionId: string) {
        let api: any;
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

    public static async init() {
        const allExtensions: readonly vscode.Extension<any>[] = vscode.extensions.all;
        for (const extension of allExtensions) {
            const currentPackageJSON: any = _.get(extension, "packageJSON");
            const guidedDevelopmentContribution: any = _.get(currentPackageJSON, "BASContributes.guided-development");
            if (!_.isNil(guidedDevelopmentContribution)) {
                const extensionName: string =  _.get(currentPackageJSON, "name");
                const extensionPublisher: string =  _.get(currentPackageJSON, "publisher");
                const extensionId: string = extensionPublisher + "." + extensionName;
                const api = await Contributors.getApi(extension, extensionId);
                Contributors.add(extensionId, api);
            }
        }
    }
}