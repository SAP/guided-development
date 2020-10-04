import { AppEvents } from "./app-events";
import { Contributors } from './contributors';
import { ICollection, IItem, IItemContext } from './types/GuidedDev';
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

  private getContext(item: IItem, contextId: string): IItemContext {
    if (item.contexts) {
      for (const context of item.contexts) {
        if (context.id === contextId) {
          return context;
        }
      }
    }
  }

  public async performAction(item: IItem, index: number, contextId: string): Promise<any> {
    if (item) {
      const context: IItemContext = this.getContext(item, contextId);
      let action: IAction;
      let actionParameters: any[];
      if (index === 1) {
        action = item.action1;
        actionParameters = context?.action1Parameters;
      } else {
        actionParameters = context?.action2Parameters;
        action = item.action2;
      }
      if (action) {
        switch (action._actionType) {
          case ActionType.Command:
            (action as ICommandAction).command.params = actionParameters;
            break;
        }
        this.basAPI?.actions?.performAction(action);
      }
    }
  }

  public setData(extensionId: string, collections: ICollection[], items: IItem[]): void {
    Contributors.getInstance().setData(extensionId, collections, items);
  }
}
