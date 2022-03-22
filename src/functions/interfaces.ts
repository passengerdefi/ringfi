import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { NotificationsContextProps } from "@mantine/notifications/lib/types";

export enum NetworkID {
  Mainnet = 56,
  Testnet = 4,
  Avalanche_MAIN = 43114, 
}

export interface IJsonRPCError {
  readonly data: any;
  readonly message: string;
  readonly code: number;
}

export interface IBaseAsyncThunk {
  readonly networkID: NetworkID;
  readonly provider: StaticJsonRpcProvider | JsonRpcProvider;
}

export interface IChangeApprovalAsyncThunk extends IBaseAsyncThunk {
  readonly token: string;
  readonly address: string;
  readonly pool: string;
  readonly notifications: NotificationsContextProps;
}

export interface IStakeAsyncThunk extends IBaseAsyncThunk {
  readonly token: string;
  readonly amount: number;
  readonly address: string;
  readonly pool: string;
  readonly claimFlag:boolean;
  readonly notifications: NotificationsContextProps;
}

export interface IActionAsyncThunk extends IBaseAsyncThunk {
  readonly action: string;
  readonly address: string;
}

export interface IValueAsyncThunk extends IBaseAsyncThunk {
  readonly value: string;
  readonly address: string;
}

export interface IActionValueAsyncThunk extends IValueAsyncThunk {
  readonly action: string;
  readonly callback?: () => void;
  readonly isOld?: boolean;
}

export interface IBaseAddressAsyncThunk extends IBaseAsyncThunk {
  readonly address: string;
}

// Account Slice

export interface ICalcUserBondDetailsAsyncThunk extends IBaseAddressAsyncThunk {}