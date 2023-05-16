import * as api from './API';
import { IEmptyLog, IEmptyReturnedLog } from '../interfaces/Empties';
import { ServerResponse  } from '../interfaces/Server'

export const getEmptiesLog = async (token: string): Promise<ServerResponse<IEmptyLog[]>> => {
    return (await api.get('/empties-receiving-logs', {'Authorization': token})).data;
}

export const getEmptiesReturnedLog = async (token: string): Promise<ServerResponse<IEmptyReturnedLog[]>> => {
    return (await api.get('/empties-returned-logs', {'Authorization': token})).data;
}