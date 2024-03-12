import * as api from './API';
import { IEmptyLog, IEmptyReturnedLog, IEmptiesInHouseCount, IEmptiesBalance } from '../interfaces/Empties';
import { ServerResponse  } from '../interfaces/Server'

export const getEmptiesLog = async (token: string): Promise<ServerResponse<IEmptyLog[]>> => {
    return (await api.get('/empties-receiving-logs', {'Authorization': token})).data;
}

export const getEmptiesBalance = async (token: string): Promise<ServerResponse<IEmptiesBalance[]>> => {
    return (await api.get('/empties/balance', {'Authorization': token})).data;
}

export const getEmptiesReturnedLog = async (token: string): Promise<ServerResponse<IEmptyReturnedLog[]>> => {
    return (await api.get('/empties-returned-logs', {'Authorization': token})).data;
}

export const addEmptiesLog = async (values: IEmptyLog, token: string): Promise<ServerResponse<string>> => {
    return (await api.postWithFile('/empties-receiving-logs', values, {'Authorization': token})).data;
}

export const addEmptiesReturnedLog = async (values: IEmptyReturnedLog, token: string): Promise<ServerResponse<string>> => {
    return (await api.post('/empties-returned-logs', values, {'Authorization': token})).data;
}

export const AddInHouseEmptiesCount = async (values: IEmptiesInHouseCount, token: string): Promise<ServerResponse<string>> => {
    return (await api.post('/empties-onground-log', values, {'Authorization': token})).data;
}

export const getInHouseEmpties = async (token: string): Promise<ServerResponse<IEmptiesInHouseCount[]>> => {
    return (await api.get('/empties-onground-log', {'Authorization': token})).data;
}

export const toggleApprovePurchaseOrder = async (id: number, approved: boolean, token: string): Promise<ServerResponse<string>> => {
    return (await api.put(`/empties-receiving-logs/${id}`, {approved: !approved}, {'Authorization': token})).data;
}

export const deletePurchaseOrder = async (id: number, token: string): Promise<ServerResponse<string>> => {
    return (await api.deleteRequest(`/empties-receiving-logs/${id}`, {'Authorization': token})).data;
}

export const addCustomerEmptiesLoan = async (values: IEmptyLog, token: string): Promise<ServerResponse<string>> => {
    return (await api.post('/empties-loan', values, {'Authorization': token})).data;
}