import { configureStore } from "@reduxjs/toolkit"; 
  import messagesReducer from "./reducers/MessagesSlice";
  import networkReducer from "./reducers/NetworkSlice";
  import appReducer from "./reducers/AppSlice";
  import pendingTransactionsReducer from "./reducers/PendingTxnsSlice";

// reducers are named automatically based on the name field in the slice
// exported in slice files by default as nameOfSlice.reducer

const store = configureStore({
  reducer: { 
     network: networkReducer,
     app: appReducer,
     pendingTransactions: pendingTransactionsReducer, 
     messages: messagesReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
