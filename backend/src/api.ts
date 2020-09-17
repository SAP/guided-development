import { CommandAction, ExecuteAction, SnippetAction } from './actionTypes';
import { IAction, ICollection, ICommand, ICommandAction, IExecuteAction, IItem, ISnippet, ISnippetAction, ManagerAPI } from './types/GuidedDev';

let _setData: any;
let _thisArg: any;

export function setSetData(thisArg: any, setData: any) {
    _thisArg = thisArg;
    _setData = setData;
}

const api: ManagerAPI = {
    setData: (extensionId: string, collections: ICollection[], items: IItem[]) => {
        if (_setData) {
            _setData.call(_thisArg, extensionId, collections, items);
        }
    },

    cloneItem: (item: IItem) => {
        // TODO: implement
        return JSON.parse(JSON.stringify(item)) as IItem;
    },

    createExecuteAction: (name: string, title: string, performAction: () => Thenable<any>): IExecuteAction => {
        const action = new ExecuteAction();
        action.name = name;
        action.title = title;
        action.performAction = performAction;
        return action;
    },

    createCommandAction: (name: string, title: string, command: ICommand): ICommandAction => {
        const action = new CommandAction();
        action.name = name;
        action.title = title;
        action.command = command;
        return action;
    },

    createSnippetAction: (name: string, title: string, snippet: ISnippet): ISnippetAction => {
        const action = new SnippetAction();
        action.name = name;
        action.title = title;
        action.snippet = snippet;
        return action;
    }

}

export default api;
