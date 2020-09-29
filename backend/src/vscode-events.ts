import { AppEvents } from "./app-events";
import { Contributors } from './contributors';
import { ICollection, IItem } from './types/GuidedDev';
import { bas } from "bas-platform"

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

  public async performAction(item: IItem, index: number): Promise<any> {
    if (item) {
      let action = item[index == 1 ? 'action1' : 'action2'];
      if (action) {
        this.basAPI?.actions?.performAction(action);
      }
    }
  }

  public setData(extensionId: string, collections: ICollection[], items: IItem[]): void {
    Contributors.getInstance().setData(extensionId, collections, items);
  }
}
