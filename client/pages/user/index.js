import React, { useContext } from 'react';
import UserRoute from '../../components/routes/UserRoute';

import {context} from '../../context'

const index = () => {

    
    const {state: { user}} = useContext(context)

      
  return <UserRoute>
      <h2 className='jumbotron'>User Dashboard</h2>
  </UserRoute>
};

export default index;
