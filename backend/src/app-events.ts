import { IAction } from "@sap-devx/app-studio-toolkit-types";
import { ICollection, IItem } from "./types";

export interface AppEvents {
  performAction(action: IAction): Promise<any>;
  setData(extensionId: string, collections: ICollection[], items: IItem[]): void;
}
