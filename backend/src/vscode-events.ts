import { AppEvents } from "./app-events";
import { Contributors } from './contributors';
import { ICollection, IItem, IItemContext, IItemAction } from './types';
import { ActionType, bas, IAction, ICommandAction, IExecuteAction } from "@sap-devx/bas-platform-types";

export class VSCodeEvents implements AppEvents {
  basAPI: any;

  private constructor() {

  }

  private static vsCodeEvents: VSCodeEvents;

  public static getInstance(): VSCodeEvents {
    if (!this.vsCodeEvents) {
      this.vsCodeEvents = new VSCodeEvents();
    }
    return this.vsCodeEvents;
  }

  public setBasAPI(basAPI: typeof bas): void {
    this.basAPI = basAPI;
  }

  private getContext(item: IItem, index: number, contextId: string): IItemContext {
    const action = (index === 1 ? item.action1 : item.action2);
    if (action.contexts) {
      for (const context of action.contexts) {
        if (context.project === contextId) {
          return context;
        }
      }
    }
  }

  public async performAction(action: IAction): Promise<any> {
    this.basAPI?.actions?.performAction(action);
  }

  public setData(extensionId: string, collections: ICollection[], items: IItem[]): void {
    Contributors.getInstance().setData(extensionId, collections, items);
  }
}
