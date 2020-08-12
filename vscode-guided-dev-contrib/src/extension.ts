// import { IGuidedDev } from '@sap-devx/guided-development-types';
import { IGuidedDevItem, IGuidedDevCollection } from './types/GuidedDev';
import * as vscode from 'vscode';
import * as _ from 'lodash';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "guidedDev1" is now active!');

	let disposable = vscode.commands.registerCommand('extension.showGuidedDevelopmentContrib', (uri: vscode.Uri) => {
		try {
			vscode.commands.executeCommand("loadGuidedDevelopment", {contributorId: "SAPOSS.vscode-guided-dev-contrib", guidedDevName: "guidedDev_1", context: {uri: uri}});
		  } catch (error) {
			vscode.window.showInformationMessage(error);
		}
	});

	context.subscriptions.push(disposable);

	const api = {
		getGuidedDevelopments(context: any) {
			let collections: IGuidedDevCollection[] = [
				{
					id: "collention_1",
					messages: {
						title: "collection_1 title",
						description: "collection_1 description"
					},
					items: [
						{
							id: "SAPOSS.vscode-guided-dev-contrib.performX",
							order: 0
						},
						{
							id: "SAPOSS.vscode-guided-dev-contrib.cloneRepo",
							order: 1
						}
					]					
				}
			]
			let items: IGuidedDevItem[] = [
                {
                    "id": "performX",
                    "messages": {
                        "title": "Perform X",
                        "description": "A VSCode extension that preform X."
                    },
                    "action": {
                        buttonText: "Open",
                        "type": "command",
                        "command": {
                            name: "workbench.action.openGlobalSettings",
                            params: []
                        }
                    }                  
                },
                {
                    "id": "cloneRepo",
                    "messages": {
                        "title": "Cloning code-snippet repository",
                        "description": "A VSCode extension that provides a simple way to add code snippets."
                    },
                    "action": {
                        buttonText: "Clone",
                        "type": "execute",
                        "execute": () => {
							vscode.commands.executeCommand("git.clone", "https://github.com/SAP/code-snippet.git");
                        }
                    }                  
                }
			]
			return {
				"collections": collections,
				"items": items
			};
		}
	};

	return api;
}

export function deactivate() {}
