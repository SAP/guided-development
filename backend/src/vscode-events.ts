import * as vscode from 'vscode';
import { AppEvents } from "./app-events";
import { IItem } from './types/GuidedDev';

export class VSCodeEvents implements AppEvents {
    public async performAction(item: IItem): Promise<any> {
        if (item && item.actionType) {
          switch (item.actionType) {
            case 'command':
              return vscode.commands.executeCommand(item.command.name, item.command.params);
              break;
            case 'execute':
              return item.performAction();
              break;
            case 'task':
              break;
          }
        }
    }
}
