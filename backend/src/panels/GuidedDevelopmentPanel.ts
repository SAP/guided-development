import * as _ from 'lodash';
import * as path from 'path';
import * as os from "os";
import * as vscode from 'vscode';
import { GuidedDevelopment } from "../guided-development";
import { RpcExtension } from '@sap-devx/webview-rpc/out.ext/rpc-extension';
import { AppLog } from "../app-log";
import backendMessages from "../messages";
import { OutputChannelLog } from '../output-channel-log';
import { AppEvents } from "../app-events";
import { VSCodeEvents } from '../vscode-events';
import { AbstractWebviewPanel } from './AbstractWebviewPanel';
import { Contributors } from "../contributors";


export class GuidedDevelopmentPanel extends AbstractWebviewPanel {
	public static GUIDED_DEVELOPMENT = "Guided Development";

	private static channel: vscode.OutputChannel;

	public toggleOutput() {
		this.outputChannel.showOutput();
	}

	public setWebviewPanel(webViewPanel: vscode.WebviewPanel, uiOptions?: any) {
		super.setWebviewPanel(webViewPanel);

		this.guidedDev = Contributors.getGuidedDev(uiOptions);
		if (_.isNil(this.guidedDev)) {
			return vscode.window.showErrorMessage("Can not find guided-development.");
		}

		this.messages = _.assign({}, backendMessages, this.guidedDev.getMessages());
		const rpc = new RpcExtension(this.webViewPanel.webview);
		this.outputChannel = new OutputChannelLog(this.messages.channelName);
		const vscodeEvents: AppEvents = new VSCodeEvents(rpc, this.webViewPanel);
		this.guidedDevelopment = new GuidedDevelopment(rpc, 
			vscodeEvents, 
			this.outputChannel, 
			this.logger, 
			{messages: this.messages, guidedDev: this.guidedDev});
		this.guidedDevelopment.registerCustomQuestionEventHandler("file-browser", "getFilePath", this.showOpenFileDialog.bind(this));
		this.guidedDevelopment.registerCustomQuestionEventHandler("folder-browser", "getPath", this.showOpenFolderDialog.bind(this));

		this.initWebviewPanel();
	}

	public static getOutputChannel(channelName: string): vscode.OutputChannel {
		if (!this.channel) {
			this.channel = vscode.window.createOutputChannel(`${GuidedDevelopmentPanel.GUIDED_DEVELOPMENT}.${channelName}`);
		}

		return this.channel;
	}

	private guidedDevelopment: GuidedDevelopment;
	private guidedDev: any;
	private messages: any;
	private outputChannel: AppLog;

	public constructor(context: vscode.ExtensionContext) {
		super(context);
		this.viewType = "guidedDevelopment";
		this.viewTitle = GuidedDevelopmentPanel.GUIDED_DEVELOPMENT;
		this.focusedKey = "guidedDevelopment.Focused";
	}

	private async showOpenFileDialog(currentPath: string): Promise<string> {
		return await this.showOpenDialog(currentPath, true);
	}

	private async showOpenFolderDialog(currentPath: string): Promise<string> {
		return await this.showOpenDialog(currentPath, false);
	}

	private async showOpenDialog(currentPath: string, canSelectFiles: boolean): Promise<string> {
		const canSelectFolders = !canSelectFiles;

		let uri;
		try {
			uri = vscode.Uri.file(currentPath);
		} catch (e) {
			uri = vscode.Uri.file(path.join(os.homedir()));
		}

		try {
			const filePath = await vscode.window.showOpenDialog({
				canSelectFiles,
				canSelectFolders,
				defaultUri: uri
			});
			return _.get(filePath, "[0].fsPath", currentPath);
		} catch (error) {
			return currentPath;
		}
	}

	public disposeWebviewPanel() {
		super.disposeWebviewPanel();
		this.guidedDevelopment = null;
	}

	public initWebviewPanel() {
		super.initWebviewPanel();
		this.webViewPanel.title = this.messages.title;
	}
}
