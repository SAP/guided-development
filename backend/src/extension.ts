import * as _ from 'lodash';
import * as vscode from 'vscode';
import { createExtensionLoggerAndSubscribeToLogSettingsChanges } from "./logger/logger-wrapper";
import { Contributors } from './contributors';
import { GuidedDevelopmentPanel } from './panels/GuidedDevelopmentPanel';
import { AbstractWebviewPanel } from './panels/AbstractWebviewPanel';

let extContext: vscode.ExtensionContext;
let guidedDevelopmentPanel: GuidedDevelopmentPanel;

export function activate(context: vscode.ExtensionContext) {
	extContext = context;

	try {
		createExtensionLoggerAndSubscribeToLogSettingsChanges(context);
	} catch (error) {
		console.error("Extension activation failed due to Logger configuration failure:", error.message);
		return;
	}

	Contributors.getContributors().init();

	guidedDevelopmentPanel = new GuidedDevelopmentPanel(extContext);
	registerAndSubscribeCommand("loadGuidedDevelopment", guidedDevelopmentPanel.loadWebviewPanel.bind(guidedDevelopmentPanel));
	registerAndSubscribeCommand("guidedDevelopment.toggleOutput", guidedDevelopmentPanel.toggleOutput.bind(guidedDevelopmentPanel));
	registerWebviewPanelSerializer(guidedDevelopmentPanel);
}

function registerAndSubscribeCommand(cId: string, cAction: any) {
	extContext.subscriptions.push(vscode.commands.registerCommand(cId, cAction));
}

function registerWebviewPanelSerializer(abstractPanel: AbstractWebviewPanel) {
	vscode.window.registerWebviewPanelSerializer(abstractPanel.viewType, {
		async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state?: any) {
			abstractPanel.setWebviewPanel(webviewPanel, state);
		}
	});
}

export function deactivate() {
	guidedDevelopmentPanel = null;
}
