/** @format */

import React, { useState, useEffect, useContext } from 'react';
// import {context} from '../../context'
import {
  DollarOutlined,
  SettingOutlined,
  LoadingOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { currencyFormatter } from '../../utils/helpers';
import InstructorRoute from '../../components/routes/InstructorRoute';
import axios from 'axios';

const revenue = () => {
  const [balance, setBalance] = useState({ pending: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    sendBalanceRequest();
  }, []);

  const sendBalanceRequest = async () => {
    const { data } = await axios.get('/api/instructor/balance');

    setBalance(data);
  };
  const handlePayoutSettings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/instructor/payout-settings`);
      window.location.href = data;
    } catch (error) {
      console.log(error);
      setLoading(false);
      alert('Unable to access payout settings');
    }
  };
  return (
    <InstructorRoute>
      <div className='container'>
        <div className='row pt-2'>
          <div className='col-md-8 offset-md-2 bg-light p-5'>
            <h2>
              Revenue report <DollarOutlined />{' '}
            </h2>
            <small>
              You get paid direclty from stirpe to your back account every 48
              hours
            </small>
            <hr />
            <h4>
              Pending Balance{' '}
              <span>
                {balance.pending &&
                  balance.pending.map((bp, i) => {
                    <span className='float-right'>
                      {/* {currencyFormatter(balance.pending)} */}
                      balance.pending
                    </span>;
                  })}
              </span>
            </h4>
            <small>For 48 hours</small>
            <hr />
            <h4>
              Payouts{' '}
              {!loading ? (
                <SettingOutlined
                  className='float-right'
                  onClick={handlePayoutSettings}
                />
              ) : (
                <SyncOutlined spin />
              )}
            </h4>
            <small>Update your stripe account</small>
          </div>
        </div>
      </div>
    </InstructorRoute>
  );
};

export default revenue;
