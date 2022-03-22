import { ethers } from "ethers";
import { setAll, getTokenPrice } from "../handlers";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IBaseAsyncThunk,IAppData, IStakingInfo } from "./interfaces";
import axios from "axios";
import Parse from 'parse';
import { APP_ID } from "../appconfig" 


export const loadAppDetails = createAsyncThunk(
  "app/loadAppDetails",
  async ({ networkID, provider }: IBaseAsyncThunk, { dispatch }) => {
    let stakingPoolInfo: Array<IStakingInfo>=[];

    console.log('Loading App Details before loading the APP');

    console.log(APP_ID);

    const AppConfig: Parse.Object = Parse.Object.extend('AppConfig');
    const queryAppConfig: Parse.Query = new Parse.Query('AppConfig');
    queryAppConfig.equalTo('appId', APP_ID);

    const object: Parse.Object[] = await queryAppConfig.find();
    // Access the Parse Object attributes using the .GET method
    const appId: string = object[0].get('appId')
    const appName: string = object[0].get('appName')
    const baseCurrency: string = object[0].get('baseCurrency')
    const chainid: string = object[0].get('chainid')
    const chainScanUrl: string = object[0].get('chainScanUrl')
    const networkName: string = object[0].get('networkName')
    const banner: string = object[0].get('banner')
    console.log(appId);
    console.log(appName);
    console.log(baseCurrency);
    console.log(chainid);
    console.log(chainScanUrl);
    console.log(networkName);
    console.log(banner); 

    if (appId) {

      const PoolConfig: Parse.Object = Parse.Object.extend('PoolConfig');
      const query: Parse.Query = new Parse.Query('PoolConfig');
      query.equalTo('appId', appId);

      const results: Parse.Object[] = await query.find();

      for (const object of results) {
        // Access the Parse Object attributes using the .GET method
        const appId: string = object.get('appId')
        const poolId: string = object.get('poolId')
        const stakingAPY: string = object.get('stakingAPY')
        const stakingTvl: string = object.get('stakingTvl')
        const stakingTokenName: string = object.get('stakingTokenName')
        const stakingTokenAddress: string = object.get('stakingTokenAddress')
        const stakingTokenLogo: string = object.get('stakingTokenLogo')
        const poolContractName: string = object.get('poolContractName')
        const poolContractAddress: string = object.get('poolContractAddress')
        const poolContractLogo: string = object.get('poolContractLogo')
        const tokenBuyurl: string = object.get('tokenBuyurl')
        const poolName: string = object.get('PoolName')
        console.log(appId);
        console.log(poolId);
        console.log(stakingAPY);
        console.log(stakingTvl);
        console.log(stakingTokenName);
        console.log(stakingTokenAddress);
        console.log(stakingTokenLogo);
        console.log(poolContractName);
        console.log(poolContractAddress);
        console.log(poolContractLogo);
        console.log(tokenBuyurl);
        console.log(poolName);

        const temp:IStakingInfo = {
        appId: parseInt(appId),
        poolId: parseInt(poolId),
        stakingAPY: parseInt(stakingAPY),
        stakingTvl: parseInt(stakingTvl),
        stakingTokenName: stakingTokenName,
        stakingTokenAddress: stakingTokenAddress,
        stakingTokenLogo: stakingTokenLogo,
        poolContractName: poolContractName,
        poolContractAddress: poolContractAddress,
        poolContractLogo: poolContractLogo,
        tokenBuyurl: tokenBuyurl,
        poolName: poolName,}

        stakingPoolInfo.push(temp); 
      }  
    } 
    return { 
      stakingInfo: stakingPoolInfo,
      loading: false,
      loadingMarketPrice: false,
      chainid: parseInt(chainid),
      chainScanUrl: chainScanUrl,
      networkName:networkName,
      baseCurrency:baseCurrency,
      appId: parseInt(appId),
      appName:appName,
      banner:banner 
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
