import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BalanceType, MessageEnum } from '../types'
import { GlobalStatisticType, InventoryItemType, TemplateType, UserDataType, WalletEnum } from '../../Components/types'

export interface UserState {
  isLoggedIn: boolean
  isLoading: boolean
  feePercent: number
  isNewUser: {
    isNew: boolean,
    referralInviter: string | null
  }
  message: {
    type: MessageEnum,
    text: string | null
  }
  userData: UserDataType
  stakedList: Array<InventoryItemType>
  unStakedList: Array<InventoryItemType>
  templates: Array<TemplateType>
  userBalance: BalanceType
  gameBalance: BalanceType
  isUserBot: boolean
  receiveResult: {template_id: string, failure: boolean} | null
  globalStatistic: GlobalStatisticType | null
  leaderboard: Array<{ name: string, profitability: number, totalPercent: number }>
  userBankStatistic: any,
  bankTransfers: Array<any>,
  bankConfig: any
}

const initialState: UserState = {
  message: {
    type: MessageEnum.noType,
    text: null
  },
  isUserBot: false,
  isNewUser: {
    isNew: false,
    referralInviter: null
  },
  receiveResult: null,
  isLoading: false,
  isLoggedIn: false,
  feePercent: 0,
  userData: {
    loginType: WalletEnum.wax,
    accountName: '',
    anchorSession: {},
    waxSession: {},
    profitability: 0,
    tokens_burned: '0 MWM'
  },
  leaderboard: [],
  userBalance: {
    money: 0,
    gold: 0
  },
  gameBalance: {
    money: 0,
    gold: 0
  },
  stakedList: [],
  unStakedList: [],
  templates: [],
  globalStatistic: null,
  userBankStatistic: {},
  bankTransfers: [],
  bankConfig: {}
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state: UserState, action: PayloadAction<any>) => {
      state.userData = action.payload
      state.isLoggedIn = true
    },
    setUserBalance: (state: UserState, action: PayloadAction<BalanceType>) => {
      state.userBalance = action.payload
    },
    setGameBalance: (state: UserState, action: PayloadAction<BalanceType>) => {
      state.gameBalance = action.payload
    },
    setStakedList: (state: UserState, action: PayloadAction<any>) => {
      state.stakedList = action.payload
    },
    setUnStakedList: (state: UserState, action: PayloadAction<any>) => {
      state.unStakedList = action.payload
    },
    setTemplates: (state: UserState, action: PayloadAction<any>) => {
      state.templates = action.payload
    },
    setFeePercent: (state: UserState, action: PayloadAction<number>) => {
      state.feePercent = action.payload
    },
    setMessage: (
      state: UserState,
      action: PayloadAction<{
        type: MessageEnum,
        text: string | null
      }>
    ) => {
      state.message.type = action.payload.type
      state.message.text = action.payload.text
    },
    setLoading: (
      state: UserState,
      action: PayloadAction<boolean>
    ) => {
      state.isLoading = action.payload
    },
    changeUserStatus: (
      state: UserState,
      action: PayloadAction<{
        isNew: boolean,
        referralInviter: string | null
      }>
    ) => {
      state.isNewUser.isNew = action.payload.isNew
      state.isNewUser.referralInviter = action.payload.referralInviter
    },
    updateUserStatistic: (
      state: UserState,
      action: PayloadAction<{ profitability: number, tokens_burned: string }>
    ) => {
      state.userData = {
        ...state.userData,
        ...action.payload
      }
    },
    updateGlobalStatistic: (
      state: UserState,
      action: PayloadAction<GlobalStatisticType>
    ) => {
      state.globalStatistic = action.payload;
    },
    updateLeaderboardStatistic: (
      state: UserState,
      action: PayloadAction<any>
    ) => {
      state.leaderboard = action.payload;
    },
    updateReceiveResult: (
      state: UserState,
      action: PayloadAction<{template_id: string, failure: boolean}  | null>
    ) => {
      state.receiveResult = action.payload;
    },
    updateUserBankStatistic: (
      state: UserState,
      action: PayloadAction<any>
    ) => {
      state.userBankStatistic = action.payload;
    },
    updateBankTransfers: (
      state: UserState,
      action: PayloadAction<any>
    ) => {
      state.bankTransfers = action.payload;
    },
    updateBankConfig: (
      state: UserState,
      action: PayloadAction<any>
    ) => {
      state.bankConfig = action.payload;
    }
  }
})

// Action creators are generated for each case reducer function
export const {
  setUserData,
  setUserBalance,
  setGameBalance,
  setStakedList,
  setUnStakedList,
  setFeePercent,
  setMessage,
  setTemplates,
  setLoading,
  changeUserStatus,
  updateUserStatistic,
  updateGlobalStatistic,
  updateLeaderboardStatistic,
  updateReceiveResult,
  updateUserBankStatistic,
  updateBankTransfers,
  updateBankConfig
} = userSlice.actions

export default userSlice.reducer
