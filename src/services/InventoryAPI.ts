import * as api from './API';
import { ServerResponse } from '../interfaces/Server';
import { IStock } from '../interfaces/Product';

export const getLoadouts = async (token: string): Promise<ServerResponse<string>> => {
    return (await api.get('/stocks/loadouts', {'Authorization': token})).data;
}
export const takeStock = async (token: string, values: IStock): Promise<ServerResponse<string>> => {
    return (await api.post('/stocks/take-stock', values, {'Authorization': token})).data;
}

export const getStock = async (token: string, date: string) => {
    return (await api.get('/stocks/get-stock?date='+date, {'Authorization': token})).data
}

export const addLoadoutInfo = async (token: string, values: any): Promise<ServerResponse<string>> => {
    return (await api.post('/stocks/loadout', values, {'Authorization': token})).data;
}