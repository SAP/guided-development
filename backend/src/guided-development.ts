import * as vscode from 'vscode';
import * as _ from "lodash";
import { AppLog } from "./app-log";
import { AppEvents } from "./app-events";
import { IRpc } from "@sap-devx/webview-rpc/out.ext/rpc-common";
import { IChildLogger } from "@vscode-logging/logger";

export class GuidedDevelopment {

  private readonly uiOptions: any;
  private readonly rpc: IRpc;
  private readonly appEvents: AppEvents;
  private readonly outputChannel: AppLog;
  private readonly logger: IChildLogger;
  private promptCount: number;
  private guidedDevName: string;
  private guidedDevelopmentObj: any[];
  private errorThrown = false;
  
  constructor(rpc: IRpc, appEvents: AppEvents, outputChannel: AppLog, logger: IChildLogger, uiOptions: any) {
    this.rpc = rpc;
    if (!this.rpc) {
      throw new Error("rpc must be set");
    }
    this.guidedDevName = "";
    this.appEvents = appEvents;
    this.outputChannel = outputChannel;
    this.logger = logger;
    this.rpc.setResponseTimeout(3600000);
    this.rpc.registerMethod({ func: this.receiveIsWebviewReady, thisArg: this });
    this.rpc.registerMethod({ func: this.toggleOutput, thisArg: this });
    this.rpc.registerMethod({ func: this.logError, thisArg: this });
    this.rpc.registerMethod({ func: this.getState, thisArg: this });
    this.rpc.registerMethod({ func: this.runAction, thisArg: this });

    this.promptCount = 0;
    this.uiOptions = uiOptions;
  }

  private async runAction(item: any) {
    if (item && item.action) {
      switch (item.action.type) {
        case 'command':
          vscode.commands.executeCommand(item.action.command.name, item.action.command.params);
          break;
        case 'task':
          break;
      }
    }
  }

  private async getState() {
    return this.uiOptions;
  }

  private async logError(error: any, prefixMessage?: string) {
    let errorMessage = this.getErrorInfo(error);
    if (prefixMessage) {
      errorMessage = `${prefixMessage}\n${errorMessage}`;
    }

    this.logger.error(errorMessage);
    return errorMessage;
  }

  private async receiveIsWebviewReady() {
    try {
      this.guidedDevelopmentObj = await this.createGuidedDevelopmentObj();
      const response: any = await this.rpc.invoke("showPrompt", [this.guidedDevelopmentObj]);
    } catch (error) {
      this.logError(error);
    }
  }

  private toggleOutput(): boolean {
    return this.outputChannel.showOutput();
  }

  private onSuccess(guidedDevName: string) {
    const message = `'${guidedDevName}' guided-development has been created.`;
    this.logger.debug("done running guided-development! " + message);
    this.appEvents.doSnippeDone(true, message);
  }

  private async onFailure(guidedDevName: string, error: any) {
    this.errorThrown = true;
    const messagePrefix = `${guidedDevName} guided-development failed.`;
    const errorMessage: string = await this.logError(error, messagePrefix);
    this.appEvents.doSnippeDone(false, errorMessage);
  }

  private getErrorInfo(error: any = "") {
    if (_.isString(error)) {
      return error;
    } 

    const name = _.get(error, "name", "");
    const message = _.get(error, "message", "");
    const stack = _.get(error, "stack", "");

    return `name: ${name}\n message: ${message}\n stack: ${stack}\n string: ${error.toString()}\n`;
  }
  
  private async createGuidedDevelopmentObj(): Promise<any[]> {
    const guidedDevs = this.uiOptions.guidedDevs;

    return guidedDevs;
  }

}
