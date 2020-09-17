// import { IGuidedDev } from '@sap-devx/guided-development-types';
import { IItem, IAction, ManagerAPI, ICommandAction, IExecuteAction } from './types/GuidedDev';
import * as vscode from 'vscode';

const EXT_ID = "saposs.contrib-oven";

let items: IItem[];
let bakeAction: IExecuteAction,
    openOvenAction: IExecuteAction,
    closeOvenAction: IExecuteAction,
    turnOnOvenAction: IExecuteAction;

function getItems(): IItem[] {
    const items: Array<IItem> = [];
    let item: IItem = {
        id: "prep-oven",
        title: "Prepare Oven",
        description: "Prepare your oven",
        action1: turnOnOvenAction,
        labels: []
    };
    items.push(item);

    item = {
        id: "open-oven",
        title: "Open Oven",
        description: "Open your oven",
        action1: openOvenAction,
        labels: []
    };
    items.push(item);

    item = {
        id: "close-oven",
        title: "Close Oven",
        description: "Close your oven",
        action1: closeOvenAction,
        labels: []
    };
    items.push(item);

    item = {
        id: "bake",
        title: "Bake",
        description: "Bake",
        action1: bakeAction,
        labels: []
    };
    items.push(item);

    return items;
}

async function getManagerAPI(): Promise<ManagerAPI> {
    const manager = vscode.extensions.getExtension('SAPOSS.guided-development');
    
    // temporary hack until this is resolved
    //   https://github.com/eclipse-theia/theia/issues/8463
    const promise = new Promise<ManagerAPI>((resolve, reject) => {
        let intervalId: NodeJS.Timeout;
        if (!(manager?.isActive)) {
            intervalId = setInterval(() => {
                if (manager?.isActive) {
                    clearInterval(intervalId);
                    resolve(manager?.exports as ManagerAPI);
                }
            }, 500);
        }
    });

    return promise;
}

export async function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "contrib-oven" is now active!');

    const managerAPI = await getManagerAPI();

    bakeAction = managerAPI.createExecuteAction("Bake", "", () => {
        return vscode.window.showInformationMessage("Baking...");
    });
    closeOvenAction = managerAPI.createExecuteAction("Close", "", () => {
        return vscode.window.showInformationMessage("Oven was closed");
    });
    openOvenAction = managerAPI.createExecuteAction("Open", "", () => {
        return vscode.window.showInformationMessage("Oven is open");
    });
    turnOnOvenAction = managerAPI.createExecuteAction("Turn on", "", () => {
        return vscode.window.showQuickPick(["80°","90°","100°"]);
    });

    items = getItems();

    managerAPI.setData(EXT_ID, [], items);
}

export function deactivate() { }

// OPEN ISSUES:
//   Collection that reference items from other contributors:
//      Are those items necessarily not bound to a specific project?
//      Does that mean they are static?
//      No labels?
//      Constant item IDs?
