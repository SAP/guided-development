// import { IGuidedDev } from '@sap-devx/guided-development-types';
import { IGuidedDev } from './types/GuidedDev';
import * as vscode from 'vscode';
import * as _ from 'lodash';
import { ConfigHelper } from "./configHelper";

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
			let guidedDev: IGuidedDev = {
				getMessages() {
					return {
						title: "Create Launch Configuration",
						description: "Provide details for the launch configuration you want to create.",
						applyButton: "Create"
					};
				},
				getQuestions() {
					return createGuidedDevelopmentQuestions(context);
				},
				async getWorkspaceEdit(answers: any) {
					let outputFile: string;
					if (context.uri) {
						outputFile = context.uri.path;
					} else {
						let outputFolder = _.get(vscode, "workspace.workspaceFolders[0].uri.path");
						if (!outputFolder || !outputFolder.length) {
							vscode.window.showErrorMessage("Cannot find folder");
							return;
						}
						outputFile = outputFolder + '/.vscode/launch.json';
					}

					const docUri: vscode.Uri = vscode.Uri.parse(outputFile);

					const configurations = await ConfigHelper.readFile(docUri.fsPath);

					const config = {
						name: answers.configName,
						type: answers.configType,
						program: answers.configProgram
					};
					configurations['configurations'].push(config)

					const we = new vscode.WorkspaceEdit();
					we.createFile(docUri, { ignoreIfExists: true });

					const metadata = {needsConfirmation: true, label: "guidedDev contributor"};
					const newText = ConfigHelper.getString(configurations);
					const range = await ConfigHelper.getRange(docUri);
					we.replace(docUri, range, newText, metadata);

					return we;
				}
			}
			guidedDevs.set("guidedDev_1", guidedDev);
			return guidedDevs;
		},
	};

	return api;
}

function createGuidedDevelopmentQuestions(context: any) : any[] {
	const questions: any[] = [];

    questions.push(
		{
		  guiOptions: {
			hint: "Select the type of configuration you want to create."
		  },
		  type: "list",
		  name: "configType",
		  message: "Type",
		  choices: [
			'node',
			'extensionHost'
		  ]
		},
		{
		  guiOptions: {
			hint: "Provide a name for your new configuration."
		  },
		  type: "input",
		  name: "configName",
		  message: "Name",
		  validate: (value: any, answers: any) => {
			return (value.length > 1 ? true : "Enter at least 2 characters");
		  }
		},
		{
		  guiOptions: {
			hint: "Select the path to the program you want to run.",
			type: "file-browser",
		  },
		  type: "input",
		  name: "configProgram",
		  message: "Program"
		}
	  );
  
    return questions;
}

export function deactivate() {}
