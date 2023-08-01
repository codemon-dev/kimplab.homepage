"use client"
import React, { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { NoticeType } from 'antd/es/message/interface';
import { message } from 'antd';
import { NextPage } from 'next';
import { Props } from 'next/script';
import SignInForm from '../components/SignInForm';
import SignUpForm from '../components/SignUpForm';
export default function AuthPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoginForm, setIsLoginForm] = useState<boolean>(true)
  const session = useSession();
  const router = useRouter();
  useEffect(() => {
    console.log("authPage is mounted")
    if (session && session.data?.user) {
      router.push('/');
    }
    return () => {
      console.log("authPage is unmounted")
    }
  }, [session, router])

  const toggleToSigninForm = useCallback(() => {
    setIsLoginForm(false)
  }, [])

  const toggleToLoginForm = useCallback(() => {
    setIsLoginForm(true)
  }, [])

  const showMessage = (type: NoticeType, content: React.ReactNode) => {
    console.log("content", content)
    messageApi.open({
      type,
      duration: 2,
      content,
    });
  };

  return (    
    <>
      {contextHolder}
      {
        isLoginForm === true 
          ? <SignInForm key="siginin" callback={toggleToSigninForm} showMessage={showMessage}/>
          : <SignUpForm key="siginup" callback={toggleToLoginForm} showMessage={showMessage} />
      }
    </>
  );
};

// export default AuthPage;