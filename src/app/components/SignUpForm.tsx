
'use client'

import React, { useState } from 'react';
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Spin,
} from 'antd';
import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import useMessage from '../hook/useMessage';

export const SignUpForm = ({callback}: any) => {  
  const [loading, setLoading] = useState(false);  
  const [showMessage] = useMessage();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    const {username, email, password} = values;
    console.log(`username: ${username}, email: ${email}`);
    setLoading(true);
    try {
      
      const res = await fetch(`/api/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: username,
          email: email,
          password: password,
        }),
      })
      const user = await res.json()
      console.log(user)
      if (!user) {
        setLoading(false);
        showMessage({type: "error", duration: 3, content: '회원가입 실패하였습니다. 잠시 후 다시 시도해주세요.'});
        return;
      }
      showMessage({type: "success", duration: 3, content: '정상적으로 회원가입 되었습니다. 로그인해주세요.'});
      callback();
    } catch (err) {
      console.log("err: ", err)
      showMessage({type: "error", duration: 3, content: '회원가입 실패하였습니다. 잠시 후 다시 시도해주세요.'});
      setLoading(false);
    }
  };

  return (
    <Row justify="center" align="middle" style={{flex: 1}}>
      <Col>
        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          style={{ maxWidth: 800, minWidth: 350 }}
          scrollToFirstError
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!', whitespace: true }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Username"/>
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ]}
          >
            <Input prefix={<MailOutlined className="site-form-item-icon"/>} placeholder="e-mail"/>
          </Form.Item>

          <Form.Item            
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
            hasFeedback
          >
            <Input.Password 
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder='Password' />
          </Form.Item>

          <Form.Item
            name="confirm"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }: any) => ({
                validator(_: any, value: any) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The new password that you entered do not match!'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Confirm Password" />
          </Form.Item>
          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_: any, value: any) =>
                  value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')),
              },
            ]}
          >
            <Checkbox>
              I have read the <a href="">agreement</a>
            </Checkbox>
          </Form.Item>
          <Form.Item >
            <Button disabled={loading} type="primary" htmlType="submit" style={{width: '100%'}}>
              {loading ?<Spin size='small' />: 'Register'}
            </Button>
            Or <a onClick={callback}>login now!</a>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default SignUpForm;

