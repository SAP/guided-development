import * as vscode from 'vscode';
import { AppEvents } from "./app-events";
import { IItem } from './types/GuidedDev';

export class VSCodeEvents implements AppEvents {
    public async performAction(item: IItem): Promise<any> {
        if (item && item.action.type) {
          switch (item.action.type) {
            case 'command':
              return vscode.commands.executeCommand(item.action.command.name, item.action.command.params);
              break;
            case 'execute':
              return item.action.performAction();
              break;
            case 'task':
              break;
          }
        }
    }
}
