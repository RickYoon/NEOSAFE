// store.js (or wherever you create your Redux store)
import { createStore } from 'redux';
import rootReducer from './WalletReducer'; // Make sure to import your rootReducer

const store = createStore(rootReducer);

export default store;