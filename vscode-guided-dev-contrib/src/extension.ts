// import { IGuidedDev } from '@sap-devx/guided-development-types';
import { IGuidedDev } from './types/GuidedDev';
import * as vscode from 'vscode';
import * as _ from 'lodash';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "guidedDev1" is now active!');

	let disposable = vscode.commands.registerCommand('extension.showGuidedDevelopmentContrib', (uri: vscode.Uri) => {
		try {
			vscode.commands.executeCommand("loadGuidedDevelopment", {contributorName: "vscode-guided-dev-contrib", guidedDevName: "guidedDev_1", context: {uri: uri}});
		  } catch (error) {
			vscode.window.showInformationMessage(error);
		}
	});

	context.subscriptions.push(disposable);

	const api = {
		getGuidedDevelopments(context: any) {
			const guidedDevs = new Map<string, IGuidedDev>();
			let guidedDev_1: IGuidedDev = {
				messages: {
					title: "Create Launch Configuration",
					description: "Provide details for the launch configuration you want to create."
				},
				action: {
					buttonText: "Create"
				}
			}
			guidedDevs.set("guidedDev_1", guidedDev_1);
			let guidedDev_2: IGuidedDev = {
				messages: {
					title: "Data Monitoring",
					description: "Add data from a source."
				},
				action: {
					buttonText: "Add"
				}
			}
			guidedDevs.set("guidedDev_2", guidedDev_2);
			return guidedDevs;
		},
	};

	return api;
}

export function deactivate() {}
