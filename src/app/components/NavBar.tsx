
'use client'

import { Menu, Button } from 'antd';
import type { MenuProps } from 'antd';
import { signOut, useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import useMessage from '../hook/useMessage';

export const NavBar = () => {
    const session = useSession();        
    const router = useRouter();
    const pathname = usePathname();
    const [showMessage] = useMessage()
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    useEffect(() => {
        let items: string[] = [];
        let path = pathname?.split('/')[1]
        items.push((!path || !pathname || pathname === "" || path === "")? "home": path)
        setSelectedItems(items)
    }, [pathname]);
    const items: MenuProps['items'] = [
        {
            label: 'HOME', key: 'home',
        },
        {
            label: 'PRIMIUM', key: 'primium',
        },
        {
            label: 'BOT', key: 'bot',
        },
        {
            label: 'PROFILE', key: 'profile'
        },
    ]

    const onClick: MenuProps['onClick'] = (e) => {
        if (e.key === 'home') {
            router.push('/')
        } else {
            router.push(`/${e.key}`)
        }
    };

    useEffect(() => {
        console.log("navbar unmounted.")
        return () => {
            console.log("navbar unmounted.")
        }
    }, [])

    const handleSignin = useCallback(() => {
        router.push('auth')
    }, [router])

    const handleSignout = useCallback(async (e: any) => {
        e.preventDefault()
        // router.push('/')
        await signOut();
        showMessage({type: "success", duration: 2, content: '로그아웃 되었습니다.'});        
    }, [showMessage])

    return (
        <>
            <div className="demo-logo" />
            <Menu theme="dark" mode="horizontal" items={items} style={{flex: 1}} onClick={onClick} selectedKeys={selectedItems}/>
            <div style={{margin: "auto"}}>
                { session.status === "authenticated"
                    ? <Button type="link" onClick={handleSignout}>LOGOUT</Button>
                    : <Button type="link" onClick={handleSignin}>LOGIN</Button>
                }
            </div>
            
        </>
    );
};

export default NavBar;