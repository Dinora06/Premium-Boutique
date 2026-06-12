import {createStore, applyMiddleware, compose} from 'redux'
import { composeWithDevTools} from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import allReducers from './reducers/index'

const middleware = [thunk]
const composeEnhancers = process.env.NODE_ENV === 'development' ? composeWithDevTools : compose;

const userInfoFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null

let initialState = {
    userLoginReducer: { userInfo: userInfoFromStorage }
}

const store = createStore(allReducers, initialState, composeEnhancers(applyMiddleware(...middleware)))

export default store