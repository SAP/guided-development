import * as vscode from 'vscode';
import { IItem, ManagerAPI } from '@sap-devx/guided-development';
import { bas, IExecuteAction } from "@sap-devx/bas-platform";

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

export async function activate(context: vscode.ExtensionContext) {
    console.log(`[Extension ${EXT_ID}] Activated`);
    const basAPI: typeof bas = vscode.extensions.getExtension("SAPOSS.@sap-devx/bas-platform")?.exports;

    bakeAction = new basAPI.actions.ExecuteAction();
    bakeAction.name = "Bake";
    bakeAction.performAction = () => vscode.window.showInformationMessage("Baking...");

    closeOvenAction = new basAPI.actions.ExecuteAction();
    closeOvenAction.name = "Close";
    closeOvenAction.performAction = () => vscode.window.showInformationMessage("Oven was closed");

    openOvenAction = new basAPI.actions.ExecuteAction();
    openOvenAction.name = "Open";
    openOvenAction.performAction = () => vscode.window.showInformationMessage("Oven is open");

    turnOnOvenAction = new basAPI.actions.ExecuteAction();
    turnOnOvenAction.name = "Turn on";
    turnOnOvenAction.performAction = () => vscode.window.showQuickPick(["80°","90°","100°"]);

    items = getItems();

    basAPI.getExtensionAPI<ManagerAPI>("SAPOSS.@sap-devx/guided-development").then((managerAPI) => {
        managerAPI.setData(EXT_ID, [], items);
    });
}

export function deactivate() { }

// OPEN ISSUES:
//   Collection that reference items from other contributors:
//      Are those items necessarily not bound to a specific project?
//      Does that mean they are static?
//      No labels?
//      Constant item IDs?
