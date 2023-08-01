
'use client'

import React, { useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Row, Col, Spin } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import useMessage from '../hook/useMessage';

export const SignInForm = ({callback}: any) => {  
  const router = useRouter();
  const [loading, setLoading] = useState(false);  
  const [showMessage] = useMessage();

  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || "/";

  const onFinish = async (values: any) => {
    const {email, password, remember} = values;
    // console.log(`email: ${email}, password: ${password}, remember: ${remember}`);
    console.log("callbackUrl: ", callbackUrl)
    
    try {
      setLoading(true);
      const res = await signIn("credentials", {
        redirect: true,
        email: email,
        password: password,
        callbackUrl,
      });
      setLoading(false);
      if (!res?.error) {
        //router.push(callbackUrl);
        showMessage({type: "success", duration: 3, content: "정상적으로 로그인 되었습니다."});
      } else {
        showMessage({type: "error", duration: 3, content: "로그인 실패. 이메일과 패스워드를 확인해 주세요."});
      }
    } catch (error: any) {
      setLoading(false);
      showMessage({type: "error", duration: 3, content: "로그인 실패. 잠시후 다시 시도해 주세요."});
    }
  };

  return (
    <Row justify="center" align="middle" style={{flex: 1}}>
      <Col>
        <Form
          name="normal_login"
          style={{ maxWidth: 800, minWidth: 350 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, type: 'email', message: 'Please input your email!' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <a style={{float: 'right'}} href="">
              Forgot password
            </a>
          </Form.Item>

          <Form.Item>
            <Button disabled={loading} type="primary" htmlType="submit" style={{width: '100%'}}>
              {loading ?<Spin size='small' />: 'Log in'}
            </Button>
            Or <a onClick={callback}>register now!</a>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default SignInForm;