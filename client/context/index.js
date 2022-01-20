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

    useEffect(() => {
        dispatch({
            type: 'LOGIN',
            payload: JSON.parse(window.localStorage.getItem("user"))
        })
    }, [])

    return (
        <context.Provider value={{state, dispatch}}>
            {children}
        </context.Provider>
    )
}

export {context, Provider}