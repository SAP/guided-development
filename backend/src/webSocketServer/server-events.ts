import { ActionType, IAction, ICommandAction, IExecuteAction, IFileAction, ISnippetAction } from "@sap-devx/bas-platform-types";
import { AppEvents } from "../app-events";
import { ICollection, IItem } from '../types';

export class ServerEvents implements AppEvents {
    public async performAction(action: IAction): Promise<any> {
        switch (action.actionType) {
            case ActionType.Execute:
                const executeAction: IExecuteAction = (action as IExecuteAction);
                if (executeAction.params) {
                    executeAction.executeAction(executeAction.params);
                } else {
                    executeAction.executeAction();
                }
                break;
            case ActionType.Command:
                const commandAction: ICommandAction = (action as ICommandAction);
                console.log(`Mock executing command ${commandAction.name}`);
                break;
            case ActionType.File:
                const fileAction: IFileAction = (action as IFileAction);
                console.log(`Mock opening file ${fileAction.uri.path}`);
                break;
            case ActionType.Snippet:
                const snippetAction: ISnippetAction = (action as ISnippetAction);
                console.log(`Mock running snippet ${snippetAction.snippetName}`);
                break;
            default:
                console.log(`Mock executing action of type ${action.actionType}`);
        }
        return Promise.resolve();    
    }

    setData(extensionId: string, collections: ICollection[], items: IItem[]): void {
        console.log("setData...................");
    }
}
