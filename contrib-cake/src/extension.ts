import * as vscode from 'vscode';
import * as path from 'path';
import * as _ from 'lodash';
import { ICollection, CollectionType, IItem, ManagerAPI } from '@sap-devx/guided-development-types';
import { bas, IExecuteAction } from '@sap-devx/bas-platform-types';

const datauri = require("datauri");

const EXT_ID = "saposs.contrib-cake";

const bakeCollectionMap: Map<string, ICollection> = new Map(); // key is dirname; value is collection
const bakeItemsMap: Map<string, Array<string>> = new Map(); // key is dirname; value is array of item ids
let extensionPath: string;
let bakeCollectionTemplate: ICollection;

let eatAction: IExecuteAction,
    buyAction: IExecuteAction,
    mixAction: IExecuteAction,
    insertAction: IExecuteAction,
    pourAction: IExecuteAction;

bakeCollectionTemplate = {
    id: "collection2",
    title: "Bake a Cake",
    description: "This is a repice for making baked cakes. You can bake a cake only if there is a bake.json file in your workspace",
    type: CollectionType.Scenario,
    itemIds: [
        `${EXT_ID}.buy-ingredients`,
        `saposs.contrib-oven.prep-oven`,
        `${EXT_ID}.mix-ingredients`,
        `${EXT_ID}.pour-mix`,
        `${EXT_ID}.place-pan`,
        `saposs.contrib-oven.bake`,
        `${EXT_ID}.eat-cake`,
    ]
};

function getCollections(): ICollection[] {
    const collections: ICollection[] = [];
    let collection: ICollection;

    collection = {
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
    collections.push(collection);

    for (const collection of bakeCollectionMap.values()) {
        collections.push(collection);
    }

    return collections;
}

function getItems(): Array<IItem> {
    const initialItems: Array<IItem> = getInitialItems();
    const items: Array<IItem> = [];

    for (const mapEntry of bakeItemsMap) {
        const dirname = mapEntry[0];
        const name = path.parse(dirname).name;

        for (const itemId of mapEntry[1]) {
            const origItem = initialItems.find(value => itemId.includes(`${EXT_ID}.${value.id}`));
            if (origItem) {
                const clonedItem: IItem = _.clone(origItem);
                clonedItem.id = `${origItem.id}-${name}`;
                clonedItem.labels = [
                    { "Project Name": name },
                    { "Project Type": "Baked Cake" },
                    { "Path": dirname }
                ]
        
                items.push(clonedItem);
            }
        }
    }

    items.push(...initialItems);
    return items;
}

function getInitialItems(): Array<IItem> {
    const items: Array<IItem> = [];
    let item: IItem = {
        id: "eat-cake",
        title: "Eat Cake",
        description: "Bon appetite",
        image: getImage(path.join(extensionPath, 'resources', 'cake1.jpg')),
        action1: eatAction,
        labels: [
            { "Project Type": "All Cakes" }
        ]
    };
    items.push(item);

    item = {
        id: "buy-ingredients",
        title: "Buy Ingredients",
        description: "Buy relevant ingredeients for your cake",
        action1: buyAction,
        labels: []
    };
    items.push(item);

    item = {
        id: "mix-ingredients",
        title: "Mix Ingredients",
        description: "Mix ingredeients according to recipe",
        action1: mixAction,
        labels: []
    };
    items.push(item);

    item = {
        id: "insert-pan",
        title: "Insert Pan into Oven",
        description: "Insert the pan into the oven",
        action1: insertAction,
        labels: []
    };
    items.push(item);

    item = {
        id: "pour-mix",
        title: "Pour Mix into Pan",
        description: "Pour the cake mix into the pan",
        image: getImage(path.join(extensionPath, 'resources', 'info.png')),
        action1: pourAction,
        labels: []
    };
    items.push(item);

    item = {
        id: "place-pan",
        title: "Place Pan in Oven",
        description: "Place the pan with the mix in the oven",
        itemIds: [
            "saposs.contrib-oven.open-oven",
            `${EXT_ID}.insert-pan`,
            "saposs.contrib-oven.close-oven"
        ],
        labels: []
    };
    items.push(item);

    return items;
}

function addBakeCollection(dirPath: string): void {
    const name = path.parse(dirPath).name;

    // clone collection template
    const collection: ICollection = JSON.parse(JSON.stringify(bakeCollectionTemplate));
    collection.id = `bake-${name}`;
    collection.title = `Bake a Cake (${name})`;
    for (const index in collection.itemIds) {
        collection.itemIds[index] = `${collection.itemIds[index]}-${name}`;
    }
    bakeCollectionMap.set(dirPath, collection);
    bakeItemsMap.set(dirPath, collection.itemIds);
}

function removeBakeCollection(dirPath: string): void {
    bakeCollectionMap.delete(dirPath);
    bakeItemsMap.delete(dirPath);
}

export async function activate(context: vscode.ExtensionContext) {
    const basAPI: typeof bas = vscode.extensions.getExtension("SAPOSS.bas-platform")?.exports;
    const managerAPI: ManagerAPI = await basAPI.getExtensionAPI("SAPOSS.guided-development");

    extensionPath = context.extensionPath;
    console.log(`[Extension ${EXT_ID}] Activated`);

    eatAction = new basAPI.actions.ExecuteAction()
    eatAction.name = "Eat"
    eatAction.performAction = () => {
        return vscode.commands.executeCommand("workbench.action.openGlobalSettings");
    };
    buyAction = new basAPI.actions.ExecuteAction();
    buyAction.name = "Buy";
    buyAction.performAction = () => {
        return vscode.commands.executeCommand("git.clone", "https://github.com/SAP/code-snippet.git");
    };
    mixAction = new basAPI.actions.ExecuteAction();
    mixAction.name = "Mix";
    mixAction.performAction = () => {
        return vscode.commands.executeCommand("git.clone", "https://github.com/SAP/code-snippet.git");
    };
    insertAction = new basAPI.actions.ExecuteAction();
    insertAction.name = "Insert"
    insertAction.performAction = () => {
        return vscode.commands.executeCommand("git.clone", "https://github.com/SAP/code-snippet.git");
    };
    pourAction = new basAPI.actions.ExecuteAction()
    pourAction.name = "Pour";
    pourAction.performAction = () => {
        return vscode.window.showInformationMessage("The cake mix was poured into the pan");
    };

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
