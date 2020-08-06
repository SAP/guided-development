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
					title: "Opening Global Settings",
					description: "It is easy to configure Visual Studio Code to your liking through its various settings."
				},
				action: {
					buttonText: "Open",
					type: "command",
					command: {
						name: "workbench.action.openGlobalSettings",
						params: []
					}
				}
			}
			guidedDevs.set("guidedDev_1", guidedDev_1);
			let guidedDev_2: IGuidedDev = {
				messages: {
					title: "Cloning code-snippet repository",
					description: "A VSCode extension that provides a simple way to add code snippets.."
				},
				action: {
					buttonText: "Clone",
					type: "command",
					command: {
						name: "git.clone",
						params: "https://github.com/SAP/code-snippet.git"
					}
				}
			}
			guidedDevs.set("guidedDev_2", guidedDev_2);
			return guidedDevs;
		},
	};

	return api;
}

export function deactivate() {}
