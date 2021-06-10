import { BasAction } from "@sap-devx/app-studio-toolkit-types";
import { ICollection, IItem } from "./types";

export interface AppEvents {
  performAction(action: BasAction): Promise<any>;
  setData(extensionId: string, collections: ICollection[], items: IItem[]): void;
}
