import * as vscode from 'vscode';
import { AppEvents } from "./app-events";
import { IItem, ActionType } from './types/GuidedDev';

export class VSCodeEvents implements AppEvents {
    public async performAction(item: IItem): Promise<any> {
        if (item && item.action.type) {
          switch (item.action.type) {
            case ActionType.Command:
              return vscode.commands.executeCommand(item.action.command.name, item.action.command.params);
            case ActionType.Execute:
              return item.action.performAction();
            case ActionType.Task:
              break;
          }
        }
    }
}
