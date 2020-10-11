import * as vscode from 'vscode';
import * as path from 'path';
import { ICollection, CollectionType, IItem, ManagerAPI, IItemAction, IItemContext } from '@sap-devx/guided-development-types';
import { bas, IExecuteAction } from '@sap-devx/bas-platform-types';
// @ts-ignore
import * as datauri from "datauri";

const EXT_ID = "saposs.contrib-cake";

const projectsMap: Map<string, any> = new Map();

let extensionPath: string;

let eatAction: IExecuteAction,
    buyAction: IExecuteAction,
    mixAction: IExecuteAction,
    bakeAction: IExecuteAction,
    pourAction: IExecuteAction

let bakeItemAction: IItemAction;
    
function initActions(basAPI: typeof bas) {
    eatAction = new basAPI.actions.ExecuteAction()
    eatAction.executeAction = () => {
        return vscode.window.showInformationMessage("The cake was delicious!!!");
    };
    buyAction = new basAPI.actions.ExecuteAction();
    buyAction.executeAction = () => {
        return vscode.window.showInformationMessage("You bought all required ingredients");
    };
    mixAction = new basAPI.actions.ExecuteAction();
    mixAction.executeAction = () => {
        return vscode.window.showInformationMessage("The cake mix is ready");
    };

    bakeAction = new basAPI.actions.ExecuteAction();
    bakeAction.executeAction = (params) => {
        if (params && params.length > 0) {
            return vscode.window.showInformationMessage(`The cake is ready (${params})`);
        } else {
            return vscode.window.showInformationMessage(`The cake is ready`);
        }
    };
    bakeItemAction = {
        name: "Bake",
        action: bakeAction,
        contexts: []
    };

    pourAction = new basAPI.actions.ExecuteAction();
    pourAction.executeAction = () => {
        return vscode.window.showInformationMessage("The cake mix was poured into the pan");
    };
}

function getCollections(): ICollection[] {
    const collections: ICollection[] = [];

    const noBakeCollection = {
        id: "collection1",
        title: "Make a No Bake Cake",
        description: "This is a recipe for making a no-bake cake",
        type: CollectionType.Scenario,
        itemIds: [
            `${EXT_ID}.buy-ingredients`,
            `${EXT_ID}.mix-ingredients`,
            `${EXT_ID}.pour-mix`,
            `${EXT_ID}.eat-cake`,
        ]
    };
    collections.push(noBakeCollection);

    const bakeCollection: ICollection = {
        id: "collection2",
        title: "Bake a Cake",
        description: "This is a repice for making baked cakes. You can bake a cake only if there is a bake.json file in your workspace",
        type: CollectionType.Scenario,
        itemIds: [
            `${EXT_ID}.buy-ingredients`,
            `${EXT_ID}.mix-ingredients`,
            `${EXT_ID}.pour-mix`,
            `${EXT_ID}.bake`,
            `${EXT_ID}.eat-cake`,
        ]
    };
    
    collections.push(bakeCollection);
    return collections;
}

function getItems(): Array<IItem> {
    bakeItemAction.contexts = [];
    for (const project of projectsMap) {
        const context: IItemContext = {
            project: project[1],
            params: [project[0]]
        }
        bakeItemAction.contexts.push(context);
    }

    return getInitialItems();
}

function getInitialItems(): Array<IItem> {
    const items: Array<IItem> = [];
    let item: IItem = {
        id: "eat-cake",
        title: "Eat Cake",
        description: "Bon appetite",
        image: {
            image: getImage(path.join(extensionPath, 'resources', 'cake1.jpg')),
            note: "image note of eat-cake"
        },
        action1: {
            name: "Eat",
            action: eatAction
        },
        labels: [
            { "Project Type": "All Cakes" }
        ]
    };
    items.push(item);

    item = {
        id: "buy-ingredients",
        title: "Buy Ingredients",
        description: "Buy relevant ingredeients for your cake",
        action1: {
            name: "Buy",
            action: buyAction
        },
        labels: []
    };
    items.push(item);

    item = {
        id: "mix-ingredients",
        title: "Mix Ingredients",
        description: "Mix ingredeients according to recipe",
        action1: {
            name: "Mix",
            action: mixAction
        },
        labels: []
    };
    items.push(item);

    item = {
        id: "bake",
        title: "Bake your cake",
        description: "Bake your cake",
        action1: bakeItemAction,
        labels: []
    };
    items.push(item);

    item = {
        id: "pour-mix",
        title: "Pour Mix into Pan",
        description: "Pour the cake mix into the pan",
        image: {
            image: getImage(path.join(extensionPath, 'resources', 'info.png')),
            note: "image note of pour-mix"
        },
        action1: {
            name: "Pour",
            action: pourAction
        },
        labels: []
    };
    items.push(item);

    item = {
        id: "place-pan",
        title: "Place Pan in Oven",
        description: "Place the pan with the mix in the oven",
        itemIds: [
            `${EXT_ID}.insert-pan`,
        ],
        labels: []
    };
    items.push(item);

    return items;
}

function addBakeCollection(dirPath: string): void {
    const name = path.parse(dirPath).name;
    projectsMap.set(dirPath, name);
}

function removeBakeCollection(dirPath: string): void {
    projectsMap.delete(dirPath);
}

export async function activate(context: vscode.ExtensionContext) {
    const basAPI: typeof bas = vscode.extensions.getExtension("SAPOSS.bas-platform")?.exports;
    initActions(basAPI);

    const managerAPI: ManagerAPI = await basAPI.getExtensionAPI("SAPOSS.guided-development");

    extensionPath = context.extensionPath;
    console.log(`[Extension ${EXT_ID}] Activated`);

    vscode.workspace.onDidChangeWorkspaceFolders((e) => {
        // when first folder is added to the workspace, the extension is reactivated, so we could let the find files upon activation handle this use-case
        // when last folder removed from workspace, the extension is reactivated, so we could let the find files upon activation handle this use-case

        for (const folder of e.removed) {
            console.dir(`${folder.uri.path} removed from workspace`);
            removeBakeCollection(folder.uri.path);
            managerAPI.setData(EXT_ID, getCollections(), getItems());
        }

        for (const folder of e.added) {
            console.dir(`${folder.uri.path} added to workspace`);
            addBakeCollection(folder.uri.path);
            managerAPI.setData(EXT_ID, getCollections(), getItems());
        }
    });

    const watcher = vscode.workspace.createFileSystemWatcher("**/bake.json");
    watcher.onDidDelete((e) => {
        console.log(`${e.path} deleted`);
        removeBakeCollection(path.dirname(e.path));
        managerAPI.setData(EXT_ID, getCollections(), getItems());
    });

    watcher.onDidCreate((e) => {
        console.log(`${e.path} created`);
        addBakeCollection(path.dirname(e.path));
        managerAPI.setData(EXT_ID, getCollections(), getItems());
    });

    watcher.onDidChange((e) => {
        console.log(`${e.path} changed`);
        // TODO: update items based on contents of bake.json?
        // managerAPI.setData(EXT_ID, getCollections(), getItems());
    });

    vscode.workspace.findFiles("**/bake.json").then((uris) => {
        for (const uri of uris) {
            console.log(`found ${uri.path} on activation`);
            addBakeCollection(path.dirname(uri.path));
            managerAPI.setData(EXT_ID, getCollections(), getItems());
        }
    });

    managerAPI.setData(EXT_ID, getCollections(), getItems());
}

function getImage(imagePath: string): string {
    let image;
    try {
        image = datauri.sync(imagePath);
    } catch (error) {
        // image = DEFAULT_IMAGE;
    }
    return image;
}


export function deactivate() { }

// OPEN ISSUES:
//   Collection that reference items from other contributors:
//      Are those items necessarily not bound to a specific project?
//      Does that mean they are static?
//      No labels?
//      Constant item IDs?
