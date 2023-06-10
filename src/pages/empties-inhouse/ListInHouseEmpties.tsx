import { useAuthHeader } from "react-auth-kit";
import { useQuery } from '@tanstack/react-query';
import { IEmptiesInHouseCount } from "../../interfaces/Empties";
import { ServerResponse } from "../../interfaces/Server";
import { getInHouseEmpties } from "../../services/EmptiesAPI";

const ListInHouseEmpties = () => {
    const authHeader = useAuthHeader();

    const { data: inHouseEmpties } = useQuery<ServerResponse<IEmptiesInHouseCount[]>, Error>({
        queryKey: ['in-house-empties'],
        queryFn: () => getInHouseEmpties(authHeader()),
    });

    return (
        <>
            <h1>List In House Empties</h1>
        </>
    )
}

export default ListInHouseEmpties;