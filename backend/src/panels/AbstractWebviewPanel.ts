import * as vscode from 'vscode';
import * as path from 'path';
import * as _ from 'lodash';
import * as fsextra from 'fs-extra';
import { IChildLogger } from '@vscode-logging/logger';
import { getLogger } from '../logger/logger-wrapper';


export abstract class AbstractWebviewPanel {
	public viewType: string;
	protected extensionPath: string;
	protected mediaPath: string;
	protected viewTitle: string;
	protected webViewPanel: vscode.WebviewPanel;
	protected focusedKey: string;
	protected htmlFileName: string;
	protected state: any;

	protected logger: IChildLogger;
	protected disposables: vscode.Disposable[];

	protected constructor(context: vscode.ExtensionContext) {
		this.extensionPath = context.extensionPath;
		this.mediaPath = path.join(context.extensionPath, "dist", "media");
		this.htmlFileName = "index.html";
		this.logger = getLogger();
		this.disposables = [];
	}

	public setWebviewPanel(webviewPanel: vscode.WebviewPanel, state?: any) {
		this.webViewPanel = webviewPanel;
		this.state = state;
	}

	public loadWebviewPanel(state?: any) {
		if (this.webViewPanel && _.isEmpty(state)) {
			this.webViewPanel.reveal(undefined, true);
		} else {
			this.disposeWebviewPanel();
			const webViewPanel = this.createWebviewPanel();
			this.setWebviewPanel(webViewPanel, state);
		}
	}

	protected createWebviewPanel(): vscode.WebviewPanel {
		return vscode.window.createWebviewPanel(
			this.viewType,
			this.viewTitle,
			{
				viewColumn: vscode.ViewColumn.One,
				preserveFocus: true
			},
			{
				// Enable javascript in the webview
				enableScripts: true,
				retainContextWhenHidden: true,
				// And restrict the webview to only loading content from our extension's `media` directory.
				localResourceRoots: [vscode.Uri.file(this.mediaPath)]
			}
		);
	}

	protected disposeWebviewPanel() {
		const displayedPanel = this.webViewPanel;
		if (displayedPanel) {
			this.dispose();
		}
	}

	protected initWebviewPanel() {
		// Set the webview's initial html content
		this.initHtmlContent();

		// Set the context (current panel is focused)
		this.setFocused(this.webViewPanel.active);

		this.webViewPanel.onDidDispose(() => this.dispose(), null, this.disposables);

		// Update the content based on view changes
		this.webViewPanel.onDidChangeViewState(
			e => {
				this.setFocused(this.webViewPanel.active);
			},
			null,
			this.disposables
		);
	}

	protected setFocused(focusedValue: boolean) {
		vscode.commands.executeCommand('setContext', this.focusedKey, focusedValue);
	}

	private dispose() {
		this.setFocused(false);

		// Clean up our resources
		this.webViewPanel.dispose();
		this.webViewPanel = null;

		while (this.disposables.length) {
			const x = this.disposables.pop();
			if (x) {
				x.dispose();
			}
		}
	}

	protected async initHtmlContent() {
		let indexHtml = await fsextra.readFile(path.join(this.mediaPath, this.htmlFileName), "utf8");
		if (indexHtml) {
			// Local path to main script run in the webview
			const scriptPathOnDisk = vscode.Uri.file(path.join(this.mediaPath, path.sep));
			const scriptUri = this.webViewPanel.webview.asWebviewUri(scriptPathOnDisk);

			// TODO: very fragile: assuming double quotes and src is first attribute
			// specifically, doesn't work when building vue for development (vue-cli-service build --mode development)
			indexHtml = indexHtml.replace(/<script src=/g, `<script src=${scriptUri.toString()}`);
			indexHtml = indexHtml.replace(/<img src=/g, `<img src=${scriptUri.toString()}`);

			indexHtml = indexHtml.replace(/<link href="/g, `<link href="${scriptUri.toString()}`);
			indexHtml = indexHtml.replace(/<script defer="defer" src="/g, `<script defer="defer" src="${scriptUri.toString()}`);
			indexHtml = indexHtml.replace(/<script defer="defer" type="module" src="/g, `<script defer="defer" type="module" src="${scriptUri.toString()}`);
		}
		this.webViewPanel.webview.html = indexHtml;
	}
}
