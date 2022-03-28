import { ethers } from "ethers";
import { setAll, getTokenPrice } from "../handlers";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IBaseAsyncThunk,IAppData, IStakingInfo } from "./interfaces";
import axios from "axios";
import Parse from 'parse';
 

export const loadAppDetails = createAsyncThunk(
  "app/loadAppDetails",
  async ({ networkID, provider }: IBaseAsyncThunk, { dispatch }) => {
    let stakingPoolInfo: Array<IStakingInfo>=[];

    console.log('Loading App Details before loading the APP');
 
    return { 
      stakingInfo: stakingPoolInfo,
      loading: false,
      loadingMarketPrice: false,
      chainid: 56,
      chainScanUrl: '',
      networkName:'',
      baseCurrency:'',
      appId: 0,
      appName:'',
      banner:'' 
    } as  IAppData;
  },
);
  

const initialArray: Array<IStakingInfo> = [];


const initialState: IAppData = {
  loading: false,
  loadingMarketPrice: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAppDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAppDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAppDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.error(error.name, error.message, error.stack);
      }) 
  },
});

const baseInfo = (state: RootState) => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
