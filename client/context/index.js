import axios from "axios";
import { useRouter } from "next/router";
import { useReducer, createContext, useEffect } from "react";

// initiale state
const initialState = {
    user: null
}

// create context 
const context = createContext()

// root reducer
const rootReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {...state, user: action.payload}
        case 'LOGOUT':
            return {...state, user: null}
        default: 
            return state;
    }
}

// context provider 
const Provider = ({children}) => {
    const [state, dispatch]= useReducer(rootReducer, initialState)

    const router = useRouter()

    useEffect(() => {
        dispatch({
            type: 'LOGIN',
            payload: JSON.parse(window.localStorage.getItem("user"))
        })
    }, [])

    axios.interceptors.response.use(
        function(response){
            //any status ocde that lie within the range of 2xx causethis function
            //will run 
            return response;

        }, 
        function(error){
            //any status code that falls outside of range of 2xx
            //call this function 
            let res = error.response;
            if(res.status === 401 && res.config && !res.config._isRetryRequest){
                return new Promise((resolve, reject) => {
                    axios.get('/api/logout').then((data) => {
                        console.log('/401 error')
                        dispatch({
                            type: 'LOGOUT'
                        })
                        window.localStorage.removeItem('user')
                        router.push('login')
                    }).catch((error) => {
                        console.log('Axios interceptors', error)
                    })
                })
            }

            return Promise.reject(error)
        }
    )

    return (
        <context.Provider value={{state, dispatch}}>
            {children}
        </context.Provider>
    )
}

export {context, Provider}