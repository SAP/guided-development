import { AppEvents } from "../app-events";
import { IItem, ActionType } from '../types/GuidedDev';

export class ServerEvents implements AppEvents {
    public async performAction(item: IItem): Promise<any> {
        if (item && item.action.type) {
            switch (item.action.type) {
                case ActionType.Command:
                    console.log(`Mock executing command ${item.action.command.name}`);
                    return Promise.resolve();
                case ActionType.Execute:
                    return item.action.performAction();
                case ActionType.Task:
                    break;
            }
        }
    }
}
