import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, List, Skeleton, Modal, Form, Input, Select, message, Popconfirm } from "antd";
import { PlusOutlined, LockOutlined } from "@ant-design/icons";
import { getUsers, addUser, deleteUser, editUser } from "../../services/UsersAPI";
import { useAuthHeader, useAuthUser } from "react-auth-kit";
import { IUser } from "../../interfaces/User";
import { AppError } from "../../interfaces/Error";
const ManageUsers = () => {
    const [form] = Form.useForm();
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [currentUserId, setCurrentUserId] = useState<number | undefined>(undefined); //for editing
    const queryClient = useQueryClient()
    const user = useAuthUser()
    
    const authHeader = useAuthHeader();
    const [open, setOpen] = useState<boolean | undefined>(false);
    const [messageApi, contextHolder] = message.useMessage();

    const {data: users, isLoading} = useQuery({
        queryKey: ['users'],
        queryFn: () => getUsers(authHeader())
    });
    
    const { mutate, isLoading: isMutating } = useMutation(
        {
            mutationFn: (values: IUser) => {
                if (isAdding) return addUser(values, authHeader())
                else
                    if (currentUserId)
                        return editUser(currentUserId, values, authHeader())
                    else return new Promise((_, reject) => reject(new Error('User Id is not valid')))
            },
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey: ['users']});
                setOpen(false);
                messageApi.open({
                    type: 'success',
                    content: 'User has been saved!',
                  });
            },
            onError: (error: AppError) => {
                messageApi.open({
                    type: 'error',
                    content: error.response.data.message
                  });
            }
        }
    );

    const { mutate: removeUser } = useMutation(
        {
            mutationFn: (values: any) => deleteUser(values, authHeader()),
            onSuccess: (data) => {
                queryClient.invalidateQueries({queryKey: ['users']});
                console.log(data);
                messageApi.open({
                    type: 'success',
                    content: data.message,
                });
            },
            onError: (error: AppError) => {
                messageApi.open({
                    type: 'error',
                    content: error.message,
                });
            }
            
        }
    );

    const handleOk = () => {
        
        if (!isAdding || (form.getFieldValue('name') && form.getFieldValue('email') && form.getFieldValue('password') && form.getFieldValue('role'))) {
            const user = {
                name: form.getFieldValue('name'),
                email: form.getFieldValue('email'),
                password: form.getFieldValue('password'),
                role: form.getFieldValue('role')
            } as IUser;

            mutate(user);

            form.resetFields();
            return;
        }else{
            messageApi.open({
                type: 'error',
                content: 'Fill in all the fields!',
              });
        }
    }

    const handleCancel = () => {
        setOpen(false)
    }

    const handleDeleteConfirm = (id: number | undefined) => {
        if (id) removeUser(id);
        else messageApi.open({
            type: 'error',
            content: `User Id ${id} is not valid`
        })
    }

    const onEdit = (userId: number | undefined) => {
        if (userId) {
            setOpen(true);
            const user = users?.data?.find(user => user.id === userId);
            if (user) {
                form.setFieldsValue({
                    name: user.name,
                    email: user.email,
                    role: user.role
                });

                setIsAdding(false); //to tell the modal that we are editing
                setCurrentUserId(userId);
            }
        }
    }

    return (
        <div>
            {contextHolder}
            <h1>Manage Users</h1>
            <Button type="primary" shape="round" icon={<PlusOutlined />}
                onClick={() => {
                    setOpen(true);
                    setIsAdding(true);
                }}
            > 
                Add User
            </Button>
            <List 
                dataSource={users?.data || []}
                renderItem={item => (
                    <List.Item
                        actions={[<Button type="primary" ghost onClick={() => onEdit(item.id)}> Edit</Button>, 
                        (user()?.email === item.email) ? null : (
                            <Popconfirm
                                title="Delete the User"
                                description="Are you sure to delete this User?"
                                onConfirm={ () => handleDeleteConfirm(item.id) }
                                onCancel={() =>{}}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button type="primary" danger>Delete</Button>
                            </Popconfirm>
                        )

                    ]}
                    >
                        <Skeleton avatar title={false} loading={isLoading} active>
                        <List.Item.Meta
                            title={<a href="#">{item?.name} ({item?.role})</a>}
                            description={item?.email}
                        />
                        </Skeleton>
                    </List.Item>
                )}
            />
            <Modal
                title="Add New User"
                open={open}
                onOk={handleOk}
                confirmLoading={isMutating}
                onCancel={handleCancel}
            >
                <Form
                    layout="vertical"
                    size={"large"}
                    form={form}

                >
                    <Form.Item label="Name" name="name">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Email" name="email">
                        <Input 
                            type={"email"}
                        />
                    </Form.Item>
                    <Form.Item label="Password" name="password">
                        <Input 
                             prefix={<LockOutlined className="site-form-item-icon" />}
                             type="password"
                             placeholder="Password"
                            />
                    </Form.Item>
                    <Form.Item label="Select" name="role">
                        <Select>
                            <Select.Option value="admin">Admin</Select.Option>
                            <Select.Option value="operations manager">Operations Manager</Select.Option>
                            <Select.Option value="empties manager">Empties Manager</Select.Option>
                            <Select.Option value="cashier">Cashier</Select.Option>
                            <Select.Option value="sales manager">Sales Mgr</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default ManageUsers;