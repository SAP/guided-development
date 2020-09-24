import { ICollection, IItem } from "./types/GuidedDev";

export interface AppEvents {
  performAction(item: IItem, index: number): Promise<any>;
  setData(extensionId: string, collections: ICollection[], items: IItem[]): void;
}
