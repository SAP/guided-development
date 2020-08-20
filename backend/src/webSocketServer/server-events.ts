import { AppEvents } from "../app-events";
import { IItem } from '../types/GuidedDev';

export class ServerEvents implements AppEvents {
    public async performAction(item: IItem): Promise<any> {
        if (item && item.action.type) {
            switch (item.action.type) {
                case 'command':
                    console.log(`Mock executing command ${item.action.command.name}`);
                    return Promise.resolve();
                    break;
                case 'execute':
                    return item.action.performAction();
                    break;
                case 'task':
                    break;
            }
        }
    }
}
