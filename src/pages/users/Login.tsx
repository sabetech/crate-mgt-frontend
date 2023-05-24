import React from 'react';
import { Button, message, Form, Input } from 'antd';
import { useSignIn } from 'react-auth-kit'
import { signIn as login} from '../../services/AuthAPI';
import { IUser } from '../../interfaces/User';
import { AxiosError } from 'axios';



const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

const Login: React.FC = () => {
    const signIn = useSignIn();
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values: IUser) => {
        // 
        console.log(values);
        try {
            const response = await login({email:values.email, password: values.password});
            showSuccess('Login successful');
            // signIn({
            //     token: response.data.token,
            //     expiresIn: response.data.expires_in,
            //     tokenType: response.data.token_type,
            // });
        } catch (error: AxiosError<any> | any) {
            if (error.response.status === 401) {
                console.log(error.response.data.message);
                showError(error.response.data.message);
            }
        }
    };

    const showError = (msg:string) => {
        messageApi.open({
          type: 'error',
          content: msg,
        });
      };

      const showSuccess = (msg:string) => {
        messageApi.open({
          type: 'success',
          content: msg,
        });
      };

    return (
        <div style={{marginTop: '20%', }}>
            {contextHolder}
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                label="Username"
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
                >
                <Input.Password />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
                </Form.Item>
            </Form>
    </div>
)
};

export default Login;