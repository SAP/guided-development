import * as _ from "lodash";
import { AppLog } from "./app-log";
import { IRpc } from "@sap-devx/webview-rpc/out.ext/rpc-common";
import { IChildLogger } from "@vscode-logging/logger";
import { AppEvents } from "./app-events";
import { IInternalItem, IInternalCollection } from "./Collection";
import { ItemAction, IItemContext } from "./types";
import { ActionType, ICommandAction, IExecuteAction, IFileAction, ISnippetAction } from "@sap-devx/bas-platform-types";

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
      for (const item of collection.items) {
        if (item.fqid === itemFqid) {
          return item;
        }
        if (item.items) {
          for (const subItem of item.items) {
            if (subItem.fqid === itemFqid) {
              return subItem;
            }  
          }
        }
      }
    }
    // TODO - console log: item does not exist
  }

  private async performAction(itemFqid: string, index: number, context?: IItemContext<any>) {
    const item: IInternalItem = this.getItem(itemFqid);

    let itemAction: ItemAction;
    let actionParameters: any = context?.params;
    if (index === 1) {
      itemAction = item.action1;
    } else {
      itemAction = item.action2;
    }
    if (itemAction) {
      if (actionParameters) {
        switch (itemAction.action.actionType) {
          case ActionType.Command:
            (itemAction.action as ICommandAction).params = actionParameters;
            break;
          case ActionType.Execute:
            (itemAction.action as IExecuteAction).params = actionParameters;
            break;
          case ActionType.File:
            (itemAction.action as IFileAction).uri = actionParameters;
            break;
          case ActionType.Snippet:
            (itemAction.action as ISnippetAction).context = actionParameters;
            break;
        }
      }
      this.appEvents.performAction(itemAction.action);
    }
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
