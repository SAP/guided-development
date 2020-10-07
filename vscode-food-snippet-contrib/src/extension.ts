import { ISnippet } from '@sap-devx/code-snippet-types';
import { ICollection, CollectionType, IItem, ManagerAPI } from '@sap-devx/guided-development-types';
import { bas, IExecuteAction, ISnippetAction, IFileAction } from '@sap-devx/bas-platform-types';
import * as vscode from 'vscode';
import * as _ from 'lodash';
import * as path from 'path';
import { ConfigHelper } from "./configHelper";
const datauri = require("datauri");

const EXT_ID = "saposs.vscode-food-snippet-contrib";
const foodqCollectionMap: Map<string, ICollection> = new Map(); // key is dirname; value is collection
const foodqItemsMap: Map<string, Array<string>> = new Map(); // key is dirname; value is array of item ids
let extensionPath: string;

let foodqAction: IExecuteAction;
let michelin3StarsAction: IFileAction;
let michelin2StarsAction: IFileAction;
let groceryListAction: ISnippetAction;
let foodqCollectionTemplate: ICollection = {
    id: "collection2",
    title: "Restaurants",
    description: "Review list of restaurants. You can take-away, delivery, order a place. if there is a foodq.json file in your workspace",
    type: CollectionType.Scenario,
    itemIds: [
        `${EXT_ID}.foodq-restaurant`,
        `${EXT_ID}.michelin-restaurants`
    ]
};

function getCollections(): ICollection[] {
    const collections: ICollection[] = [];

    let collection: ICollection = {
        id: "collection1",
        title: "Create Grocery List",
        description: "This is a tool to create grocery list",
        type: CollectionType.Scenario,
        itemIds: [
            `${EXT_ID}.create-grocery-list`
        ]
    };
    collections.push(collection);

    for (const collection of foodqCollectionMap.values()) {
        collections.push(collection);
    }

    return collections;
}

function getItems(): Array<IItem> {
    const initialItems: Array<IItem> = getInitialItems();
    const items: Array<IItem> = [];

    for (const mapEntry of foodqItemsMap) {
        const dirname = mapEntry[0];
        const name = path.parse(dirname).name;

        for (const itemId of mapEntry[1]) {
            const origItem = initialItems.find(value => itemId.includes(`${EXT_ID}.${value.id}`));
            if (origItem) {
                const clonedItem: IItem = _.clone(origItem);
                clonedItem.id = `${origItem.id}-${name}`;
                clonedItem.labels = [
                    { "Project Name": name },
                    { "Project Type": "foodq-restaurant" },
                    { "Project Path": dirname }
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
	let item: IItem;
    item = {
        id: "create-grocery-list",
        title: "Grocery List",
        description: "create grocery list",
        image: {
            image: getImage(path.join(extensionPath, 'resources', 'project from template.png')),
            note: "image note of create-grocery-list"
        },
        action1: groceryListAction,
        labels: [
            { "Project Type": "create-grocery-list" }
        ]
    };
    items.push(item);
    item = {
        id: "foodq-restaurant",
        title: "Foodq Restaurant",
        description: "Bon appetite",
        image: {
            image: getImage(path.join(extensionPath, 'resources', 'project from template.png')),
            note: "image note of foodq-restaurant"
        },
        action1: foodqAction,
        labels: [
            { "Project Type": "foodq-restaurant" }
        ]
    };
	items.push(item);
    item = {
        id: "michelin-restaurants",
        title: "Michelin Restaurants",
        description: "Bon appetite",
        image: {
            image: getImage(path.join(extensionPath, 'resources', 'project from template.png')),
            note: "image note of michelin-restaurants"
        },
        itemIds: [
			`${EXT_ID}.michelin-restaurants-3stars`,
			`${EXT_ID}.michelin-restaurants-2stars`
        ],
        labels: [
            { "Project Type": "michelin-restaurants" }
        ]
    };
	items.push(item);
    item = {
        id: "michelin-restaurants-3stars",
        title: "Michelin Restaurants 3 stars",
        description: "Bon appetite",
        image: {
            image: getImage(path.join(extensionPath, 'resources', 'project from template.png')),
            note: "image note of foodq-restaurant"
        },
        action1: michelin3StarsAction,
        labels: [
            { "Project Type": "foodq-restaurant" }
        ]
    };
	items.push(item);
    item = {
        id: "michelin-restaurants-2stars",
        title: "Michelin Restaurants 2 stars",
        description: "Bon appetite",
        image: {
            image: getImage(path.join(extensionPath, 'resources', 'project from template.png')),
            note: "image note of foodq-restaurant"
        },
        action1: michelin2StarsAction,
        labels: [
            { "Project Type": "foodq-restaurant" }
        ]
    };
	items.push(item);
    return items;
}

export async function activate(context: vscode.ExtensionContext) {
    const basAPI: typeof bas = vscode.extensions.getExtension("SAPOSS.bas-platform")?.exports;
    const managerAPI: ManagerAPI = await basAPI.getExtensionAPI("SAPOSS.guided-development");

	extensionPath = context.extensionPath;

    createGuidedDevActions(basAPI);
    createFileSystemWatcher("**/foodq.json", managerAPI);
    managerAPI.setData(EXT_ID, getCollections(), getItems());

    const api = {
		getCodeSnippets(context: any) {
			const snippets = new Map<string, ISnippet>();
			let snippet: ISnippet = {
				getMessages() {
					return {
						title: "Create Grocery List",
						description: "Stay organized with a grocery list to avoid buying items you don’t really need.",
						applyButton: "Create"
					};
				},
				async getQuestions() {
					return createCodeSnippetQuestions(context);
				},
				async getWorkspaceEdit(answers: any) {
					return createCodeSnippetWorkspaceEdit(answers, context);
				}
			}
			snippets.set("snippet_1", snippet);
			return snippets;
		},
    };

    return api;
}

function createGuidedDevActions(basAPI: typeof bas) {
    foodqAction = new basAPI.actions.ExecuteAction()
    foodqAction.name = "Order from restaurant"
    foodqAction.performAction = () => {
        return vscode.commands.executeCommand("loadYeomanUI", { filter: { type: "foodq" } });
	};
    groceryListAction = new basAPI.actions.SnippetAction()
    groceryListAction.name = "Create Grocery List"
    groceryListAction.snippet = {
        contributorId: EXT_ID, 
        snippetName: "snippet_1", 
        context: {}                    
    };
    michelin3StarsAction = new basAPI.actions.FileAction()
    michelin3StarsAction.name = "3 Stars Michelin restaurants"
    michelin3StarsAction.file = {uri: vscode.Uri.parse("https://guide.michelin.com/en/restaurants/3-stars-michelin")};
    michelin2StarsAction = new basAPI.actions.FileAction()
    michelin2StarsAction.name = "2 Stars Michelin restaurants"
    michelin2StarsAction.file = {uri: vscode.Uri.parse("https://guide.michelin.com/en/restaurants/2-stars-michelin")};
}

function createFileSystemWatcher(globPattern: vscode.GlobPattern, managerAPI: ManagerAPI) {
    vscode.workspace.onDidChangeWorkspaceFolders((e) => {
        // when first folder is added to the workspace, the extension is reactivated, so we could let the find files upon activation handle this use-case
        // when last folder removed from workspace, the extension is reactivated, so we could let the find files upon activation handle this use-case

        for (const folder of e.removed) {
            console.dir(`${folder.uri.path} removed from workspace`);
            removeFoodqCollection(folder.uri.path);
            managerAPI.setData(EXT_ID, getCollections(), getItems());
        }

        for (const folder of e.added) {
            console.dir(`${folder.uri.path} added to workspace`);
            addFoodqCollection(folder.uri.path);
            managerAPI.setData(EXT_ID, getCollections(), getItems());
        }
    });

    vscode.workspace.findFiles(globPattern).then((uris) => {
        for (const uri of uris) {
            console.log(`found ${uri.path} on activation`);
            addFoodqCollection(path.dirname(uri.path));
            managerAPI.setData(EXT_ID, getCollections(), getItems());
        }
    });

    const watcher = vscode.workspace.createFileSystemWatcher(globPattern);
    watcher.onDidDelete((e) => {
        console.log(`${e.path} deleted`);
        removeFoodqCollection(path.dirname(e.path));
        managerAPI.setData(EXT_ID, getCollections(), getItems());
    });

    watcher.onDidCreate((e) => {
        console.log(`${e.path} created`);
        addFoodqCollection(path.dirname(e.path));
        managerAPI.setData(EXT_ID, getCollections(), getItems());
    });

    watcher.onDidChange((e) => {
        console.log(`${e.path} changed`);
        // TODO: update items based on contents of bake.json?
        // managerAPI.setData(EXT_ID, getCollections(), getItems());
    });
}

function addFoodqCollection(dirPath: string): void {
    const name = path.parse(dirPath).name;

    // clone collection template
    const collection: ICollection = JSON.parse(JSON.stringify(foodqCollectionTemplate));
    collection.id = `foodq-${name}`;
    collection.title = `FoodQ Restaurant (${name})`;
    for (const index in collection.itemIds) {
        collection.itemIds[index] = `${collection.itemIds[index]}-${name}`;
    }
    foodqCollectionMap.set(dirPath, collection);
    foodqItemsMap.set(dirPath, collection.itemIds);
}

function removeFoodqCollection(dirPath: string): void {
    foodqCollectionMap.delete(dirPath);
    foodqItemsMap.delete(dirPath);
}


async function createCodeSnippetWorkspaceEdit(answers: any, context: any) {
	let outputFile: string;
	if (answers.path) {
		outputFile = answers.path + '/foodq.json';
	} else {
		let outputFolder = _.get(vscode, "workspace.workspaceFolders[0].uri.path");
		if (!outputFolder || !outputFolder.length) {
			vscode.window.showErrorMessage("Cannot find folder");
			return;
		}
		outputFile = outputFolder + '/foodq.json';
	}

	const docUri: vscode.Uri = vscode.Uri.parse(outputFile);

	const configurations = await ConfigHelper.readFile(docUri.fsPath);

	const config = {
		fruits: answers.fruits,
		grains: answers.grains,
		diary: answers.diary,
	};
	configurations['configurations'].push(config)

	const we = new vscode.WorkspaceEdit();
	we.createFile(docUri, { ignoreIfExists: true });

	const metadata = {needsConfirmation: true, label: "snippet contributor"};
	const newText = ConfigHelper.getString(configurations);
	const range = await ConfigHelper.getRange(docUri);
	we.replace(docUri, range, newText, metadata);

	return we;
}

function createCodeSnippetQuestions(context: any) : any[] {
	const questions: any[] = [];

    questions.push(
		{
		  guiOptions: {
			hint: "Select the fruits you want to add."
		  },
		  type: "checkbox",
		  name: "fruits",
		  message: "Fruits",
		  choices: [
			'Bannana',
			'Orange'
		  ]
		},
		{
			guiOptions: {
			  hint: "Select the grains you want to add."
			},
			type: "checkbox",
			name: "grains",
			message: "Grains",
			choices: [
			  'Bread',
			  'Pasta',
			  'Rice'
			]
		  },
		  {
			guiOptions: {
			  hint: "Select the diary you want to add."
			},
			type: "checkbox",
			name: "diary",
			message: "Diary",
			choices: [
			  'Milk',
			  'Yougurt',
			  'Cheese'
			]
		  },
		{
		  guiOptions: {
			hint: "Select the path to your grocery list.",
			type: "folder-browser",
		  },
		  type: "input",
		  name: "path",
		  message: "grocery list target folder",
		  default: "/home/user/projects"
		}
	  );
  
    return questions;
}

function getImage(imagePath: string) :string {
    let image;
    try {
      image = datauri.sync(imagePath);
    } catch (error) {
        // image = DEFAULT_IMAGE;
    }
    return image;
}

export function deactivate() {}
