import * as api from './API';
import { IEmptyLog } from '../interfaces/Empties';
import { ServerResponse  } from '../interfaces/Server'

export const getEmptiesLog = async (token: string): Promise<ServerResponse<IEmptyLog[]>> => {
    return (await api.get('/empties-receiving-logs', {'Authorization': token})).data;
}
