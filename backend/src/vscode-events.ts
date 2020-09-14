import * as vscode from 'vscode';
import { AppEvents } from "./app-events";
import { IItem, ActionType, IExecuteAction, ICommandAction, ISnippetAction } from './types/GuidedDev';

export class VSCodeEvents implements AppEvents {
    public async performAction(item: IItem, index: number): Promise<any> {
      if (item) {
        let action = item[index == 1 ? 'action1' : 'action2'];
        if (action && action.type) {
          switch (action.type) {
            case ActionType.Command:
              let commandAction = (action as ICommandAction);
              return vscode.commands.executeCommand(commandAction.command.name, commandAction.command.params);
            case ActionType.Snippet:
              let snippetAction = (action as ISnippetAction);
              return vscode.commands.executeCommand("loadCodeSnippet", {contributorId: snippetAction.snippet.contribId, snippetName: snippetAction.snippet.name, context: snippetAction.snippet.context});
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
