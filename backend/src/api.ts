import { ICollection, IItem, ManagerAPI } from './types/GuidedDev';
export * from './types/GuidedDev';

let _setData: any;
let _thisArg: any;

export function setSetData(thisArg: any, setData: any) {
    _thisArg = thisArg;
    _setData = setData;
}

export const managerApi: ManagerAPI = {
    setData: (extensionId: string, collections: ICollection[], items: IItem[]) => {
        if (_setData) {
            _setData.call(_thisArg, extensionId, collections, items);
        }
    },
}
