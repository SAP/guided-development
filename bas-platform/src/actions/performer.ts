import * as vscode from "vscode";
import { ActionType, IAction } from "./interfaces";
import { Action, CommandAction, ExecuteAction, FileAction, SnippetAction } from "./impl";

export async function _performAction(action: IAction): Promise<any> {
  if (action) {
    switch ((action as Action)._actionType) {
      case ActionType.Command:
        let commandAction = (action as CommandAction);
        return vscode.commands.executeCommand(commandAction.command.name, commandAction.command.params);
      case ActionType.Execute:
        let executeAction = (action as ExecuteAction);
        return executeAction.performAction();
      case ActionType.Snippet:
        let snippetAction = (action as SnippetAction);
        return vscode.commands.executeCommand("loadCodeSnippet", { contributorId: snippetAction.snippet.contributorId, snippetName: snippetAction.snippet.snippetName, context: snippetAction.snippet.context });
      case ActionType.File:
        let fileAction = (action as FileAction);
        return vscode.commands.executeCommand('vscode.open', fileAction.file.uri, {viewColumn: vscode.ViewColumn.Two});
    }
  }
}
