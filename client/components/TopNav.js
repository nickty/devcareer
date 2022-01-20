import React, { useContext, useEffect, useState } from 'react';
import { Menu } from 'antd'
import Link from 'next/link'
import { AppstoreOutlined, LayoutOutlined, LoginOutlined, UserAddOutlined, CoffeeOutlined} from '@ant-design/icons'
import { context } from '../context';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router'

const {Item, SubMenu} = Menu

const TopNav = () => {
    const [current, setCurrent]= useState("")
    const {state, dispatch} = useContext(context)
const { user } = state
    const router = useRouter()
    useEffect(() => {
        process.browser && setCurrent(window.location.pathname)
    }, [process.browser])

    const logout = async () => {
        dispatch({
            type: 'LOGOUT',
            
        })
        window.localStorage.removeItem('user')

        const {data} = await axios.get('/api/logout')
        toast(data.message)
        router.push('/login')
    }
  return <Menu mode='horizontal' selectedKeys={[current]}>
      <Item key="/" onlick={e => setCurrent(e.key)} icon={<AppstoreOutlined />}>
          <Link href="/">
              <a>App</a>
          </Link>
      </Item>
      { user === null && (
          <>
          <Item key="/login" onlick={e => setCurrent(e.key)} icon={<LoginOutlined />}>
          <Link href="/login">
              <a>Login</a>
          </Link>
      </Item>
      <Item key="/register" onlick={e => setCurrent(e.key)} icon={<UserAddOutlined />}>
          <Link href="/register">
              <a>Register</a>
          </Link>
      </Item>
          </>
      )}
      { user !== null && (
          <SubMenu icon={<CoffeeOutlined />} title={user && user.name} style={{ marginLeft: 'auto' }}>
              <Item onClick={logout} icon={<LayoutOutlined />}>
          Logout
      </Item>
          </SubMenu>
      )}
  </Menu>;
};

export default TopNav;
