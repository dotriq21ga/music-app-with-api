import { persistStore } from 'redux-persist'
import { CookieStorage } from 'redux-persist-cookie-storage'
import Cookies from 'cookies-js';
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducer";
import thunk from 'redux-thunk';
import persistReducer from 'redux-persist/es/persistReducer';

const reducers = combineReducers({
    data: rootReducer,
});

const persistConfig = {
    key: "root",
    storage: new CookieStorage(Cookies/*, options */)
}

const persistedReducer = persistReducer(persistConfig, reducers)

const store = configureStore({
    reducer: persistedReducer,
    middleware: [thunk],
});

export default store;

export let persistor = persistStore(store)


