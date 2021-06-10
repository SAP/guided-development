import { BasAction, ICommandAction, IExecuteAction, IFileAction, ISnippetAction } from "@sap-devx/app-studio-toolkit-types";
import { AppEvents } from "../app-events";
import { ICollection, IItem } from '../types';

export class ServerEvents implements AppEvents {
    public async performAction(action: BasAction): Promise<any> {
        switch (action.actionType) {
            case "EXECUTE":
                const executeAction: IExecuteAction = (action as IExecuteAction);
                if (executeAction.params) {
                    executeAction.executeAction(executeAction.params);
                } else {
                    executeAction.executeAction();
                }
                break;
            case "COMMAND":
                const commandAction: ICommandAction = (action as ICommandAction);
                console.log(`Mock executing command ${commandAction.name}`);
                break;
            case "FILE":
                const fileAction: IFileAction = (action as IFileAction);
                console.log(`Mock opening file ${fileAction.uri.path}`);
                break;
            case "SNIPPET":
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
