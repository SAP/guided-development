import { AppEvents } from "../app-events";
import { IItem } from '../types/GuidedDev';

export class ServerEvents implements AppEvents {
    public async performAction(item: IItem): Promise<any> {
        if (item && item.actionType) {
            switch (item.actionType) {
                case 'command':
                    console.log(`Mock executing command ${item.command.name}`);
                    return Promise.resolve();
                    break;
                case 'execute':
                    return item.performAction();
                    break;
                case 'task':
                    break;
            }
        }
    }
}
