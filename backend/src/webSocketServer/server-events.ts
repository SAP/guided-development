import { AppEvents } from "../app-events";
import { IItem, ActionType, IExecuteAction, ICommandAction } from '../types/GuidedDev';

export class ServerEvents implements AppEvents {
    public async performAction(item: IItem, index: number): Promise<any> {
        if (item) {
            let action = item[index == 1 ? 'action1' : 'action2'];
            if (action && action.type) {
              switch (action.type) {
                case ActionType.Command:
                  let commandAction = (action as ICommandAction);
                  console.log(`Mock executing command ${commandAction.command.name}`);
                  return Promise.resolve();
                case ActionType.Execute:
                    let executeAction = (action as IExecuteAction);
                    return executeAction.performAction();
                case ActionType.Task:
                    break;
                }
            }
        }
    }
}
