import { SyncOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { context } from '../context';

const forgotPassword = () => {

  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState(false)
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)

  //context user
  const {state: {user}} = useContext(context)
  //router
  const router = useRouter()

  useEffect(() => {
    if(user !== null) router.push('/')
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const { data } = await axios.post('/api/forgot-password', {email})
      setSuccess(true)
      setLoading(false)
      toast('Check email for secret code')
    } catch (error) {
      setLoading(false)
      toast(error.response.data)
    }
  }
  const handleResetPassword = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('/api/reset-password', {
        email, code, newPassword
      })
      setEmail('')
      setCode('')
      setNewPassword('')
      setLoading(false)
    } catch (error) {
      console.log(error)
      toast(error.response.data)
    }
  }
  return <>

  <h2 className='jumbotron'>Forgot Password Form</h2>
  <div className='container col-md-4 offset-md-4 pb-5 mt-3'>
    <form onSubmit={success ? handleResetPassword : handleSubmit}>
      <input type='email' required placeholder='Enter Email' value={email} className="form-control p-2" onChange={e=> setEmail(e.target.value) } />

      {success && <>
        <input type='text' required placeholder='Enter Code' value={code} className="form-control p-2" onChange={e=> setCode(e.target.value) } />
        <input type='password' required placeholder='Enter New Password' value={newPassword} className="form-control p-2" onChange={e=> setNewPassword(e.target.value) } />

      </>}
      <button disabled={loading || !email} className='btn btn-primary btn-block p-2 mt-3'>
        {loading ? <SyncOutlined spin /> : 'Submit'}
      </button>
    </form>
  </div>
  </>;
};

export default forgotPassword;

