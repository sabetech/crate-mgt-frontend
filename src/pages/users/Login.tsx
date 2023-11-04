import React from 'react';
import { Button, message, Form, Input } from 'antd';
import { useSignIn } from 'react-auth-kit'
import { signIn as login} from '../../services/AuthAPI';
import { IUser } from '../../interfaces/User';
import { AxiosError } from 'axios';
// import opk_img from '../../assets/opk_img.jpeg';
// import opk_img2 from '../../assets/opk_img2.jpeg';
// import opk_img3 from '../../assets/opk_img3.jpeg';
// import opk_img4 from '../../assets/opk_img4.jpeg';
import opk_logo from '../../assets/opk_logo.png';



const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

const Login: React.FC = () => {
    const signIn = useSignIn();
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values: IUser) => {
        // : Promise<ServerResponse<IUser | Error>>
        console.log(values);
        try {
            const response = await login({email:values.email, password: values.password});
            showSuccess('Login successful');
            if (response.status === 201){
                signIn({
                    token: response.data.token,
                    expiresIn: response.data.expires_at,
                    tokenType: response.data.token_type,
                    authState: response.data.user,
                });
            }
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
        <div style={{ display: 'flex', height: '100vh' }}>
            {contextHolder}
            <div style={{width: "50%"}}>
                <div >
                    <img src={opk_logo} alt="opk_logo" style={{ display: "block", marginTop:"10%", height:"auto", width: "50%", marginLeft: "auto", marginRight: "auto" }}/>
                </div>
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600, marginTop: "5%" }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    {/* <h1 style={{textAlign: "center"}}>Login</h1> */}
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
            <div style={{
                            width: "50%", 
                            backgroundImage: "url('../src/assets/opk_img4.jpeg')",
                            
                        }}>
                {/* <Carousel autoplay> */}
                    {/* <div>
                        <img src={opk_img} alt="opk" style={{ height: "100%", width: "100%" }}/>
                    </div>
                    <div>
                        <img src={opk_img2} alt="opk2" style={{ height: "100%", width: "100%" }}/>
                    </div>
                    <div>
                        <img src={opk_img3} alt="opk3" style={{ height: "100%", width: "100%" }}/>
                    </div>
                    <div>
                        <img src={opk_img4} alt="opk4" style={{ height: "100%", width: "100%"}}/>
                    </div> */}
                {/* </Carousel> */}
            </div>
    </div>
)
};

export default Login;