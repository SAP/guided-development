import { IItem } from "./types/GuidedDev";

export interface AppEvents {
  performAction(item: IItem): Promise<any>;
}
