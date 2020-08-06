import * as vscode from 'vscode';
import * as _ from 'lodash';

export class Contributors {
    private static readonly apiMap = new Map<string, any>();

    public static getGuidedDevs(uiOptions: any): any[] {
        let guidedDevs: any[] = [];
        const guidedDevContext = _.get(uiOptions, "context");
        Contributors.apiMap.forEach((value: any, key: any) => {
            const guidedDevelopments = value.getGuidedDevelopments(guidedDevContext);
            guidedDevelopments.forEach((value: any, key: any) => {
                guidedDevs.push(value);
            });
        })
		return guidedDevs;
	}

    public static getGuidedDev(uiOptions: any) {
		let guidedDev  = undefined;
		const contributorName = _.get(uiOptions, "contributorName");
		const guidedDevName = _.get(uiOptions, "guidedDevName");
		const guidedDevContext = _.get(uiOptions, "context");
		if (contributorName && guidedDevName) {
			const api = Contributors.apiMap.get(contributorName);
			const guidedDevs = api.getGuidedDevelopments(guidedDevContext);
			guidedDev  = guidedDevs.get(guidedDevName);
		}
		return guidedDev;
	}

    public static add(extensionName: string, api: any) {
        Contributors.apiMap.set(extensionName, api);
    }

    private static async getApi(extension: vscode.Extension<any>, extensionName: string) {
        let api: any;
        if (!extension.isActive) {
            try {
                api = await extension.activate();
            } catch (error) {
                console.error(error);
                // TODO: Add Logger.error here ("Failed to activate extension", {extensionName: extensionName})
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
            const extensionDependencies: string[] = _.get(currentPackageJSON, "extensionDependencies");
            if (!_.isEmpty(extensionDependencies)) {
                const guidedDevelopmentDependancy: boolean = _.includes (extensionDependencies,"saposs.guided-development");
                if (guidedDevelopmentDependancy) {
                    const extensionName: string =  _.get(currentPackageJSON, "name");
                    const api = await Contributors.getApi(extension, extensionName);
                    Contributors.add(extensionName, api);
                }
            }
        }
    }

}