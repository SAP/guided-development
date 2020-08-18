import * as _ from "lodash";
import { AppLog } from "./app-log";
import { IRpc } from "@sap-devx/webview-rpc/out.ext/rpc-common";
import { IChildLogger } from "@vscode-logging/logger";
import { ICollection, IItem } from "./types/GuidedDev";
import { AppEvents } from "./app-events";

export class GuidedDevelopment {

  private readonly uiOptions: any;
  private readonly rpc: IRpc;
  private appEvents: AppEvents;
  private readonly outputChannel: AppLog;
  private readonly logger: IChildLogger;
  private collections: Array<ICollection>;

  constructor(rpc: IRpc, appEvents: AppEvents, outputChannel: AppLog, logger: IChildLogger, messages: any, collections: ICollection[]) {
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
  }

  private getCollection(id: string): ICollection {
    const collection = this.collections.find((value) => {
      return value.id === id;
    });
    return collection;
  }

  private getItem(collectionId: string, itemFqid: string): IItem {
    const collection: ICollection = this.getCollection(collectionId);
    if (collection) {
      const item: IItem = collection.items.find((value) => {
        return (value.fqid === itemFqid);
      });
      return item;
    }
  }

  private async performAction(collectionId: string, itemFqid: string) {
    const item: IItem = this.getItem(collectionId, itemFqid);
    this.appEvents.performAction(item);
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

  private async onFrontendReady() {
    try {
      const response: any = await this.rpc.invoke("showCollections", [this.collections]);
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
