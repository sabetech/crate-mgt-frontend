import * as api from './API';
import { IEmptyLog, ServerResponse } from '../interfaces/Empties';

export const getEmptiesLog = async (token: string): Promise<ServerResponse<IEmptyLog[]>> => {
    return (await api.get('/empties-receiving-logs', {'Authorization': token})).data;
}
