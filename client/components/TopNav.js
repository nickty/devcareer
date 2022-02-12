/** @format */

import React, { useContext, useEffect, useState } from 'react';
import { Menu } from 'antd';
import Link from 'next/link';
import {
  AppstoreOutlined,
  LayoutOutlined,
  LoginOutlined,
  UserAddOutlined,
  CoffeeOutlined,
  CarryOutOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { context } from '../context';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

const { Item, SubMenu, ItemGroup } = Menu;

const TopNav = () => {
  const [current, setCurrent] = useState('');
  const { state, dispatch } = useContext(context);
  const { user } = state;
  const router = useRouter();
  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser]);

  const logout = async () => {
    dispatch({
      type: 'LOGOUT',
    });
    window.localStorage.removeItem('user');

    const { data } = await axios.get('/api/logout');
    toast(data.message);
    router.push('/login');
  };
  return (
    <Menu mode='horizontal' selectedKeys={[current]} className='mb-2'>
      <Item
        key='/'
        onlick={(e) => setCurrent(e.key)}
        icon={<AppstoreOutlined />}>
        <Link href='/'>
          <a>DeCareer</a>
          {/* <img src='/imgs/devcareer-logo.png' height={150} /> */}
        </Link>
      </Item>
      {user && user.role && user.role.includes('Instructor') ? (
        <Item
          key='/instructor/course/create'
          onlick={(e) => setCurrent(e.key)}
          icon={<CarryOutOutlined />}>
          <Link href='/instructor/course/create'>
            <a>Create Course</a>
          </Link>
        </Item>
      ) : (
        <Item
          key='/user/becomeInstructor'
          onlick={(e) => setCurrent(e.key)}
          icon={<TeamOutlined />}>
          <Link href='/user/becomeInstructor'>
            <a>Become Instructor</a>
          </Link>
        </Item>
      )}

      {user === null && (
        <>
          <Item
            key='/login'
            onlick={(e) => setCurrent(e.key)}
            style={{ marginLeft: 'auto' }}
            icon={<LoginOutlined />}>
            <Link href='/login'>
              <a>Login</a>
            </Link>
          </Item>
          <Item
            key='/register'
            onlick={(e) => setCurrent(e.key)}
            icon={<UserAddOutlined />}>
            <Link href='/register'>
              <a>Register</a>
            </Link>
          </Item>
        </>
      )}

      {user && user.role && user.role.includes('Instructor') && (
        <Item
          key='/instructor'
          onlick={(e) => setCurrent(e.key)}
          icon={<LayoutOutlined />}
          style={{ marginLeft: 'auto' }}>
          <Link href='/instructor'>
            <a>Instructor</a>
          </Link>
        </Item>
      )}
      {user !== null && (
        <SubMenu
          icon={<CoffeeOutlined />}
          title={user && user.name}
          // style={{ marginLeft: 'auto' }}
        >
          <ItemGroup>
            <Item key='/user' icon={<LayoutOutlined />}>
              <Link href='/user'>
                <a>Dashboard</a>
              </Link>
            </Item>
            <Item onClick={logout} icon={<LayoutOutlined />}>
              Logout
            </Item>
          </ItemGroup>
        </SubMenu>
      )}
    </Menu>
  );
};

export default TopNav;
