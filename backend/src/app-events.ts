import { IItem } from "./types/GuidedDev";

export interface AppEvents {
  performAction(item: IItem, index: number): Promise<any>;
}
