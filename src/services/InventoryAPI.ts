import * as api from './API';
import { ServerResponse } from '../interfaces/Server';
import { IStock } from '../interfaces/Product';
import { ILoadout } from '../interfaces/Inventory';
import { IVSECustomer } from '../interfaces/Customer';

export const getLoadouts = async (token: string, date: string): Promise<ServerResponse<ILoadout[]>> => {
    return (await api.get('/stocks/loadouts?date='+date, {'Authorization': token})).data;
}

export const getLoadoutByVSE = async (token: string, date: string): Promise<ServerResponse<IVSECustomer[]>> => {
    return (await api.get('/stocks/loadout-by-vse?date='+date, {'Authorization': token})).data;
}

export const takeStock = async (token: string, values: IStock): Promise<ServerResponse<string>> => {
    return (await api.post('/stocks/take-stock', values, {'Authorization': token})).data;
}

export const getStock = async (token: string, date: string) => {
    return (await api.get('/stocks/get-stock?date='+date, {'Authorization': token})).data
}

export const addLoadoutInfo = async (token: string, loadoutInfo: ILoadout): Promise<ServerResponse<string>> => {
    
    let values = Object.assign({}, loadoutInfo, { vse: loadoutInfo.vse.id });
    
    return (await api.post('/stocks/loadout', values, {'Authorization': token})).data;
}