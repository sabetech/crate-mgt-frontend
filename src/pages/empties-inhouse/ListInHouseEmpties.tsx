import React from 'react';
import { useAuthHeader } from 'react-auth-kit';


const ListInHouseEmpties = () => {
    const authHeader = useAuthHeader();

    // const { data: inHouseEmpties } = useQuery<ServerResponse<IEmptyLog[]>, Error>({
    //     queryKey: ['empties_received'],
    // });


    return (
        <>
            <h1>List In House Empties</h1>
        </>
    )
}

export default ListInHouseEmpties;