import * as vscode from 'vscode';
import { AppEvents } from "./app-events";
import { IItem, ActionType, IExecuteAction, ICommandAction } from './types/GuidedDev';

export class VSCodeEvents implements AppEvents {
    public async performAction(item: IItem): Promise<any> {
        if (item && item.action.type) {
          switch (item.action.type) {
            case ActionType.Command:
              let commandAction = (item.action as ICommandAction);
              return vscode.commands.executeCommand(commandAction.command.name, commandAction.command.params);
            case ActionType.Execute:
              let executeAction = (item.action as IExecuteAction);
              return executeAction.performAction();
            case ActionType.Task:
              break;
          }
        }
    }
}
