import * as vscode from 'vscode';
import { CommandAction, ExecuteAction, SnippetAction } from './actionTypes';
import { AppEvents } from "./app-events";
import { Contributors } from './contributors';
import { ICollection, IItem } from './types/GuidedDev';

export class VSCodeEvents implements AppEvents {
  public async performAction(item: IItem, index: number): Promise<any> {
    if (item) {
      let action = item[index == 1 ? 'action1' : 'action2'];
      if (action) {
        if (action instanceof CommandAction) {
          let commandAction = (action as CommandAction);
          return vscode.commands.executeCommand(commandAction.command.name, commandAction.command.params);
        } else if (action instanceof ExecuteAction) {
          let executeAction = (action as ExecuteAction);
          return executeAction.performAction();
        } else if (action instanceof SnippetAction) {
          return vscode.commands.executeCommand("loadCodeSnippet", {contributorId: action.snippet.contributorId, snippetName: action.snippet.snippetName, context: action.snippet.context});
        }
      }
    }
  }

  public setData(extensionId: string, collections: ICollection[], items: IItem[]): void {
    Contributors.getInstance().setData(extensionId, collections, items);
  }
}
