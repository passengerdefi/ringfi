import { BigNumber, ethers} from "ethers"; 
  import { clearPendingTxn, fetchPendingTxns } from "../reducers/PendingTxnsSlice";
import { createAsyncThunk } from "@reduxjs/toolkit"; 
import { error, info } from "../reducers/MessagesSlice";
import { IActionValueAsyncThunk, IChangeApprovalAsyncThunk, IJsonRPCError, IStakeAsyncThunk, IZapAsyncThunk } from "./interfaces"; 
 import deps from "../abi/deployments.mainnet.json";
 import ierc20 from '../abi/ERC20.json'
import { BNToEther } from "../handlers";
import { tokenBalance,getSwaps } from '../functions/useStatistics';
import { TOKEN } from "../appconfig";
import { beefyUniV2ZapABI } from "../appconfig/abi";
import { bscZaps } from "../appconfig/bsc_zaps";



interface IUAData {
    address: string;
    amount: string;
    approved: boolean;
    txHash: string | null;
    type: string | null;
  }

export const zapInToken = createAsyncThunk(
    "app/stakeToken",
    async ({ vaultAddress,
      swapAmountOutMin,
      token,
      zapvalue,provider, address,notifications  }: IZapAsyncThunk, { dispatch }) => {
      if (!provider) {
        dispatch(error("Please connect your wallet!"));
        return;
      }
  
      const signer = provider.getSigner();
      const poolContract = new ethers.Contract(
        bscZaps.zapAddress,
          beefyUniV2ZapABI,
          signer
      );  
      
      let depositTx;
      let uaData: IUAData = {
        address: address,
        amount: zapvalue.toString(),
        approved: true,
        txHash: null,
        type: null,
      }; 
  
      try {
        
          console.log("Zap address "+address);
          console.log("Zap token ere "+token);
          console.log("Zap pool ere "+vaultAddress);
          console.log("Zap amount ere "+uaData.amount);

          const testNum = BigNumber.from(parseInt(swapAmountOutMin.toFixed(0)));
          console.log("Zap swapAmountOutMin ere "+testNum);

          // won't run if stakeAllowance > 0
          depositTx = await poolContract.beefIn(vaultAddress,testNum.toString(),
            token,
            uaData.amount);
        
          console.log("Zap Tnx recieved ere "+depositTx);
  
        const text = "Zap Token";
        const pendingTxnType = "zap";
        dispatch(fetchPendingTxns({ txnHash: depositTx.hash, text, type: pendingTxnType }));
  
        await depositTx.wait();
      } catch (e: unknown) { 
  

        console.log("Zap Tnx recieved ere "+e);
        notifications.showNotification({
          color: 'red',
          title: 'Error.',
          message: (e as IJsonRPCError).message,
        })
  
  
        return;
      } finally {
        if (depositTx) {
          dispatch(clearPendingTxn(depositTx.hash));
          notifications.showNotification({
              title: 'Info.',
              message: 'Succesfully Zapped',
            })
            window.location.reload();
      
        }
      } 
    },
  );
  