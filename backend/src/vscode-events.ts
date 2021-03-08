import { AppEvents } from "./app-events";
import { Contributors } from './contributors';
import { ICollection, IItem } from './types';
import { bas, IAction } from "@sap-devx/app-studio-toolkit-types";

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

  public async performAction(action: IAction): Promise<any> {
    this.basAPI?.actions?.performAction(action);
  }

  public setData(extensionId: string, collections: ICollection[], items: IItem[]): void {
    Contributors.getInstance().setData(extensionId, collections, items);
  }
}
