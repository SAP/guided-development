import { AppEvents } from "../app-events";
import { CommandAction, ExecuteAction, SnippetAction } from '../actionTypes';
import { ICollection, IItem, IExecuteAction, ICommandAction, ISnippetAction } from '../types/GuidedDev';

export class ServerEvents implements AppEvents {
    public async performAction(item: IItem, index: number): Promise<any> {
        if (item) {
            let action = item[index == 1 ? 'action1' : 'action2'];
            if (action) {
                if (action instanceof CommandAction) {
                    let commandAction = (action as CommandAction);
                    console.log(`Mock executing command ${commandAction.command.name}`);
                    return Promise.resolve();
                } else if (action instanceof ExecuteAction) {
                    let executeAction = (action as ExecuteAction);
                    return executeAction.performAction();
                } else if (action instanceof SnippetAction) {
                    console.log(`Mock executing loadCodeSnippet ${action.snippet.snippetName}`);
                    return Promise.resolve();
                }
            }
        }
    }

    setData(extensionId: string, collections: ICollection[], items: IItem[]): void {
        console.log("setData...................");
    }
}
