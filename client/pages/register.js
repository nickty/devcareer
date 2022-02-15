/** @format */

import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SyncOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { context } from '../context';
import { useRouter } from 'next/router';

const register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { state, dispatch } = useContext(context);

  const { user } = state;

  useEffect(() => {
    if (user !== null) router.push('/');
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.table({name, email, password})

    try {
      setLoading(true);
      const { data } = await axios.post(`/api/register`, {
        name,
        email,
        password,
      });
      console.log(data);

      toast.success('Registration successful.Please login');
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data);
      setLoading(false);
    }
  };
  return (
    <>
      <h2 className='bg-light p-5 rounded-lg  bg-primary text-center'>
        Register
      </h2>

      <div className='container col-md-4 offset-md-4 pb-5 mt-5'>
        <form onSubmit={handleSubmit}>
          <input
            placeholder='Enter name'
            required
            type='text'
            className='form-control mb-4 p-2'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder='Enter email'
            required
            type='email'
            className='form-control mb-4 p-2'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder='Enter password'
            required
            type='password'
            className='form-control mb-4 p-2'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button
            className='btn btn-block btn-primary p-2'
            disabled={!name || !email || !password || loading}>
            {loading ? <SyncOutlined spin /> : 'Submit'}
          </button>
        </form>
        <p className='text-center p-3'>
          Already registered?
          <Link href='/login'>
            <a> Login</a>
          </Link>
        </p>
      </div>
    </>
  );
};

export default register;
