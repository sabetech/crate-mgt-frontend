import { useQuery } from "@tanstack/react-query";
import { Button, List, Skeleton } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getUsers } from "../../services/UsersAPI";
import { useAuthHeader } from "react-auth-kit";
const ManageUsers = () => {

    const authHeader = useAuthHeader();

    const {data: users, isLoading} = useQuery({
        queryKey: ['users'],
        queryFn: () => getUsers(authHeader())
    });

    return (
        <div>
            <h1>Manage Users</h1>
            <Button type="primary" shape="round" icon={<PlusOutlined />}>Add User</Button>
            <List 
                dataSource={users?.data || []}
                renderItem={item => (
                    <List.Item
                        actions={[<Button type="primary">Edit</Button>, <Button type="primary" danger>Delete</Button>]}
                    >
                        <Skeleton avatar title={false} loading={isLoading} active>
                        <List.Item.Meta
                            title={<a href="#">{item?.name}</a>}
                            description={item?.email}
                        />
                        </Skeleton>
                    </List.Item>
                )}
            />
        </div>
    )
}

export default ManageUsers;