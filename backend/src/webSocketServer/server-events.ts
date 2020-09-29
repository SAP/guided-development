import { AppEvents } from "../app-events";
import { ICollection, IItem } from '../types/GuidedDev';

export class ServerEvents implements AppEvents {
    public async performAction(item: IItem, index: number): Promise<any> {
        if (item) {
            let action = item[index == 1 ? 'action1' : 'action2'];
            if (action) {
                console.log(`Mock executing command ${action.name}`);
                return Promise.resolve();    
            }
        }
    }

    setData(extensionId: string, collections: ICollection[], items: IItem[]): void {
        console.log("setData...................");
    }
}
