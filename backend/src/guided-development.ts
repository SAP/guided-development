import * as _ from "lodash";
import { AppLog } from "./app-log";
import { IRpc } from "@sap-devx/webview-rpc/out.ext/rpc-common";
import { IChildLogger } from "@vscode-logging/logger";
import { AppEvents } from "./app-events";
import { IInternalItem, IInternalCollection } from "./Collection";

export class GuidedDevelopment {

  private readonly messages: any;
  private readonly rpc: IRpc;
  private readonly appEvents: AppEvents;
  private readonly outputChannel: AppLog;
  private readonly logger: IChildLogger;
  private collections: Array<IInternalCollection>;

  constructor(rpc: IRpc, appEvents: AppEvents, outputChannel: AppLog, logger: IChildLogger, messages: any, collections: IInternalCollection[]) {
    this.rpc = rpc;
    if (!this.rpc) {
      throw new Error("rpc must be set");
    }
    this.appEvents = appEvents;
    this.outputChannel = outputChannel;
    this.logger = logger;
    this.rpc.setResponseTimeout(3600000);
    this.rpc.registerMethod({ func: this.onFrontendReady, thisArg: this });
    this.rpc.registerMethod({ func: this.toggleOutput, thisArg: this });
    this.rpc.registerMethod({ func: this.logError, thisArg: this });
    this.rpc.registerMethod({ func: this.getState, thisArg: this });
    this.rpc.registerMethod({ func: this.performAction, thisArg: this });

    this.collections = collections;
    this.messages = messages;
  }

  public setCollections(collections: Array<IInternalCollection>) {
    this.collections = collections;
    const response: any = this.rpc.invoke("showCollections", [this.collections]);
  }

  private getItem(itemFqid: string): IInternalItem {
    for (const collection of this.collections) {
      for (const contextualItem of collection.contextualItems) {
        if (contextualItem.item.fqid === itemFqid) {
          return contextualItem.item;
        }
        if (contextualItem.item.contextualItems) {
          for (const subItem of contextualItem.item.contextualItems) {
            if (subItem.item.fqid === itemFqid) {
              return subItem.item;
            }  
          }
        }
      }
    }
    // TODO - console log: item does not exist
  }

  private async performAction(itemFqid: string, index: number, contextId?: string) {
    const item: IInternalItem = this.getItem(itemFqid);
    this.appEvents.performAction(item, index, contextId);
  }

  private async getState() {
    return this.messages;
  }

  private async logError(error: any, prefixMessage?: string) {
    let errorMessage = this.getErrorInfo(error);
    if (prefixMessage) {
      errorMessage = `${prefixMessage}\n${errorMessage}`;
    }

    this.logger.error(errorMessage);
    return errorMessage;
  }

  private async onFrontendReady() {
    try {
      await this.rpc.invoke("showCollections", [this.collections]);
    } catch (error) {
      this.logError(error);
    }
  }

  private toggleOutput(): boolean {
    return this.outputChannel.showOutput();
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
}
