import { AppThunk } from '../store'
import {
  updateBankConfig,
  updateBankTransfers,
  updateUserBankStatistic,
  setLoading,
  setMessage, setGameBalance
} from './userSlice'
import { BankApi } from '../../api/bank.api'
import data from '../../data.json'
import { getAuthData } from '../../Components/helpers'
import { sendTransaction } from '../../api/transact.api'
import { MessageEnum } from '../types'
import { BalanceApi } from '../../api/balance.api'
import { updateGameBalanceThunk, updateUserBalanceThunk } from './balanceThunk'

export const updateUserBankStatisticThunk = (): AppThunk => async (dispatch, getState) => {
    try {
        const accountName = getState().user.userData.accountName
        const response = await BankApi.getUserBankStatistic(accountName)

        dispatch(updateUserBankStatistic(response.data.rows[0]))
    }
    catch (error:any) {
        const message = 'Bank statistic error'
        console.log(message)
    }
}

export const updateBankTransfersThunk = (): AppThunk => async (dispatch, getState) => {
    try {
        const accountName = getState().user.userData.accountName

        const response = await BankApi.getBankTransfers(accountName)

        dispatch(updateBankTransfers(response.data.rows))
    }
    catch (error:any) {
        const message = 'Bank statistic error'
        console.log(message)
    }
}

export const updateBankConfigThunk = (): AppThunk => async (dispatch, getState) => {
    try {
        const response = await BankApi.getUserBankConfig()

        dispatch(updateBankConfig(response.data.rows[0]))
    }
    catch (error:any) {
        const message = 'Bank statistic error'
        console.log(message)
    }
}

// Example BankInThunk(100, '0 days')
export const BankInThunk =
  (amount: number, stakedDays: string): AppThunk =>
    async (dispatch, getState) => {
      try {
        const userData = getState().user.userData

        const action = {
          account: data.game_account,
          name: 'bankin',
          authorization: [getAuthData(userData)],
          data: {
            player: userData.accountName,
            amount: amount.toFixed(4) + ' MWM',
            staked_for_days: Number(stakedDays.split(' ')[0])
          }
        }

        dispatch(setLoading(true))

        const transactionHandler = setInterval(async () => {
          const bankTransfers = getState().user.bankTransfers
          const newBankTransfers = await BankApi.getBankTransfers(userData.accountName)

          if (newBankTransfers.data.rows.length > bankTransfers.length) {
            dispatch(updateBankTransfers(newBankTransfers.data.rows))
            dispatch(updateUserBankStatisticThunk())
            dispatch(updateBankConfigThunk())
            dispatch(updateGameBalanceThunk())
            dispatch(setLoading(false))
            clearInterval(transactionHandler)
          }
        }, 5000)

        sendTransaction(userData, action)
          .catch((error: any) => {
            if (error?.json?.error?.name === 'tx_cpu_usage_exceeded' ||
              error?.json?.error?.name === 'tx_ram_usage_exceeded' ||
              error?.json?.error?.name === 'tx_net_usage_exceeded') {

              const message = error.json.error.what
              dispatch(setMessage({ type: MessageEnum.error, text: message }))
            } else {
              if (error.code !== 'E_CANCEL') {
                const errorMessage = 'Bank in error'
                dispatch(setMessage({ type: MessageEnum.error, text: errorMessage }))
              }
            }
            dispatch(setLoading(false))
            clearInterval(transactionHandler);
          })
      } catch (error) {
        dispatch(setLoading(false))
        const errorMessage = 'Bank in error'
        dispatch(setMessage({ type: MessageEnum.error, text: errorMessage }))
      }
    }

// Example BankOutThunk(id), where id is ID of transfer
export const BankOutThunk =
  (id: number | string): AppThunk =>
    async (dispatch, getState) => {
      try {
        const userData = getState().user.userData

        const action = {
          account: data.game_account,
          name: 'bankout',
          authorization: [getAuthData(userData)],
          data: {
            player: userData.accountName,
            id
          }
        }

        dispatch(setLoading(true))

        const transactionHandler = setInterval(async () => {
          const bankTransfers = getState().user.bankTransfers
          const newBankTransfers = await BankApi.getBankTransfers(userData.accountName)

          if (newBankTransfers.data.rows.length < bankTransfers.length) {
            dispatch(updateBankTransfers(newBankTransfers.data.rows))
            dispatch(updateBankConfigThunk())
            dispatch(updateGameBalanceThunk())
            dispatch(updateUserBankStatisticThunk())
            dispatch(setLoading(false))
            clearInterval(transactionHandler)
          }
        }, 5000)

        sendTransaction(userData, action)
          .catch((error: any) => {
            if (error?.json?.error?.name === 'tx_cpu_usage_exceeded' ||
              error?.json?.error?.name === 'tx_ram_usage_exceeded' ||
              error?.json?.error?.name === 'tx_net_usage_exceeded') {

              const message = error.json.error.what
              dispatch(setMessage({ type: MessageEnum.error, text: message }))
            } else {
              if (error.code !== 'E_CANCEL') {
                const errorMessage = 'Bank out error'
                dispatch(setMessage({ type: MessageEnum.error, text: errorMessage }))
              }
            }
            dispatch(setLoading(false))
            clearInterval(transactionHandler);
          })
      } catch (error) {
        dispatch(setLoading(false))
        const errorMessage = 'Bank out error'
        dispatch(setMessage({ type: MessageEnum.error, text: errorMessage }))
      }
    }


// Example ClaimGoldThunk()
export const ClaimGoldThunk =
  (): AppThunk =>
    async (dispatch, getState) => {
      try {
        const userData = getState().user.userData

        const action = {
          account: data.game_account,
          name: 'claimgold',
          authorization: [getAuthData(userData)],
          data: {
            player: userData.accountName
          }
        }

        dispatch(setLoading(true))

        const transactionHandler = setInterval(async () => {
          const goldBalance = getState().user.gameBalance.gold
          const response = await BalanceApi.updateGameBalance(userData.accountName)

          const balanceArray = response.data.rows.length === 0
            ? ['0']
            : response.data.rows[0].balance
          const newGoldBalance = parseFloat(balanceArray[1]?.split(' ')[0] || 0)

          if(newGoldBalance > goldBalance) {
            dispatch(setGameBalance({
              money: parseFloat(balanceArray[0].split(' ')[0]),
              gold: parseFloat(balanceArray[1]?.split(' ')[0] || 0)
            }))
            dispatch(updateUserBankStatisticThunk())
            dispatch(setLoading(false))
            clearInterval(transactionHandler)
          }
          // const toolsList = await InventoryApi.getToolsTable(userData.accountName)
          // const mineAsset = toolsList.data.rows
          //   .find((row: { asset_id: string; }) => row.asset_id === item.id);
          //
          // const testDateNow = new Date(item.last_claimed);
          // const timeToCheck = testDateNow.getTime();
          // if (mineAsset.last_claimed * 1000  > timeToCheck) {
          //   dispatch(getStakedListThunk())
          //   dispatch(updateGameBalanceThunk())
          //   dispatch(setLoading(false))
          //   cb(false)
          //   clearInterval(transactionHandler)
          // }
        }, 5000)

        sendTransaction(userData, action)
          .catch((error: any) => {
            if (error?.json?.error?.name === 'tx_cpu_usage_exceeded' ||
              error?.json?.error?.name === 'tx_ram_usage_exceeded' ||
              error?.json?.error?.name === 'tx_net_usage_exceeded') {

              const message = error.json.error.what
              dispatch(setMessage({ type: MessageEnum.error, text: message }))
            } else {
              if (error.code !== 'E_CANCEL') {
                const errorMessage = 'Claim gold error'
                dispatch(setMessage({ type: MessageEnum.error, text: errorMessage }))
              }
            }
            dispatch(setLoading(false))
            clearInterval(transactionHandler);
          })
      } catch (error) {
        dispatch(setLoading(false))
        const errorMessage = 'Claim gold error'
        dispatch(setMessage({ type: MessageEnum.error, text: errorMessage }))
      }
    }
