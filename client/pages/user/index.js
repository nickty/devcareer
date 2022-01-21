import React, { useContext } from 'react';
import UserRoute from '../../components/routes/UserRoute';

import {context} from '../../context'

const index = () => {

    
    const {state: { user}} = useContext(context)

      
  return <UserRoute>
      <pre>{JSON.stringify(user, null, 4)}</pre>
  </UserRoute>
};

export default index;
