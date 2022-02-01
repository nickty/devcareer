import React, { useState, useEffect, useContext} from 'react';
// import {context} from '../../context'
import { DollarOutlined, SettingOutlined } from '@ant-design/icons';
// import {currency} from '../../utils/helpers'
import InstructorRoute from '../../components/routes/InstructorRoute';

const revenue = () => {

    const [balance, setBalance] = useState({pending: []})

    useEffect(() => {
        sendBalanceRequest()
    }, [])

    const sendBalanceRequest = async () => {

    }
const handlePayoutSettings = async () => {

}
  return <InstructorRoute>
      <div className="container">
            <div className='row pt-2'>
                <div className='col-md-8 offset-md-2 bg-light p-5'>
                    <h2>Revenue report <DollarOutlined /> </h2>
                    <small>You get paid direclty from stirpe to your back account every 48 hours</small>
                    <hr />
                    <h4>Pending Balance <span>$9090</span></h4>
                    <small>For 48 hours</small>
                    <hr />
                    <h4>
                        Payouts <SettingOutlined className='float-right' onClick={handlePayoutSettings} />
                    </h4>
                    <small>Update your stripe account</small>
                </div>
                </div>  
      </div>
  </InstructorRoute>;
};

export default revenue;
