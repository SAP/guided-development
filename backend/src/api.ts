import { CommandAction, ExecuteAction, FileAction, SnippetAction } from './actionTypes';
import { ICollection, ICommand, ICommandAction, IExecuteAction, IFile, IFileAction, IItem, ISnippet, ISnippetAction, ManagerAPI } from './types/GuidedDev';

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
    },

    createFileAction: (name: string, title: string, file: IFile): IFileAction => {
        const action = new FileAction();
        action.name = name;
        action.title = title;
        action.file = file;
        return action;
    }
}

export default api;
