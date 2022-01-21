import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios'
import { toast } from 'react-toastify';
import { SyncOutlined } from '@ant-design/icons';
import Link from 'next/link'
import { context } from '../context';
import { useRouter } from 'next/router'

const login = () => {
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const {state, dispatch} = useContext(context)

  const {user} = state

  useEffect(() => {
    if(user !== null) router.push('/')
  }, [user])

  const handleSubmit = async (e) => {
      e.preventDefault()
      // console.table({name, email, password})

     try {
       setLoading(true)
      const { data } = await axios.post(`/api/login`, { email, password})
      // console.log(data)

      // toast.success('Registration successful.Please login')
      dispatch({
        type: 'LOGIN',
        payload: data
      })
      // SAVE IN LOCAL STOREAGE
      window.localStorage.setItem('user', JSON.stringify(data))
      setLoading(false)
      router.push('/')
     } catch (error) {
      toast.error(error.response.data) 
      setLoading(false)
     }
  }
return <>
    <div className='jumbotron'>
      <h2>Login</h2>
    </div>
    <div className='container col-md-4 offset-md-4 pb-5'>
        <form onSubmit={handleSubmit}>
          
          <input placeholder='Enter email' required type="email" className="form-control mb-4 p-2" value={email} onChange={e => setEmail(e.target.value)} />
          <input placeholder='Enter password' required type="password" className="form-control mb-4 p-2" value={password} onChange={e => setPassword(e.target.value)} />
          <br />
          <button className='btn btn-block btn-primary p-2' disabled={!email || !password || loading}>{loading ? <SyncOutlined spin />: 'Submit'}</button>
        </form>
        <p className='text-center p-3'>
          New here?
          <Link href="/register"><a>Register</a></Link>
        </p>
    </div>
</>;
};

export default login;
