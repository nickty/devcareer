import React, { useContext, useState } from 'react';
import {context} from '../../context'
import { UserSwitchOutlined, LoadingOutlined, SettingOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { toast } from 'react-toastify';

const becomeInstructor = () => {
    const [loading, setLoading] = useState(false)

    const {state: {user}} = useContext(context)

    const becomeInstruct = e => {
        setLoading(true)
        axios.post('/api/make-instructor')
        .then(res => {
            console.log(res)
            window.location.href = res.data
        })
        .catch(err => {
            console.log(err.response.status)
            toast('Stripe onboarding failed')
            setLoading(false)
        })

    }
  return <>
  <h2 className='jumbotron'>Become Instructor</h2>
  <div className='container'>
      <div className='row'>
          <div className='col-md-6 offset-md-3'>
              <div className='pt-4'>
                  <UserSwitchOutlined className='display-1 pb-3' />
                  <br />
                  <h3>Setup payout to publish courses on DevCareer</h3>
                  <p className='lead text-warning'>DevCareer Linked with bkash</p>
                  <Button className='mb-3' type='primary' shape='round' block icon={loading ? <LoadingOutlined /> : <SettingOutlined />} size='large' onClick={becomeInstruct} disabled={(user && user.role && user.role.includes('Instructor')) || loading}>{loading ? 'Proccessing..' : 'Payout Setup'}</Button>
                  <p className='lead'>You will be redirected to setup payment</p>

              </div>
          </div>
      </div>
  </div>
  </>;
};

export default becomeInstructor;