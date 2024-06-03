import { AppThunk } from '../store'
import { changeUserStatus, setGameBalance, setMessage, setUserBalance, updateUserStatistic } from './userSlice'
import { BalanceApi } from '../../api/balance.api'
import { MessageEnum } from '../types'

const parseUserBalance = (response: any) => {
  if (response.data.length === 0) {
    return parseFloat('0')
  }
  return parseFloat(response.data[0].slice(0, 6))
}

export const updateUserBalanceThunk = (): AppThunk => async (dispatch, getState) => {
  try {
    const accountName = getState().user.userData.accountName
    const isLoggedIn = getState().user.isLoggedIn

    if (!isLoggedIn) {
      return null
    }

    const response = await BalanceApi.updateUserBalance(accountName)

    dispatch(setUserBalance({
      money: parseUserBalance(response[0]),
      // TODO: make gold
      gold: 0
    }))
  } catch (error) {
    const errorMessage = 'Unable to update user balance. Please reload the page'
    console.log(errorMessage)
  }
}

export const updateGameBalanceThunk = (): AppThunk => async (dispatch, getState) => {
  try {
    const accountName = getState().user.userData.accountName
    const isLoggedIn = getState().user.isLoggedIn

    if (!isLoggedIn) {
      return null
    }

    const response = await BalanceApi.updateGameBalance(accountName)

    const balanceArray = response.data.rows.length === 0
      ? ['0']
      : response.data.rows[0].balance

    if (response.data.rows.length === 0) {
      const url = new URL(window.location.href);
      const ref = await url.searchParams.get("ref");
      console.log(window.location.href)
      dispatch(changeUserStatus({ isNew: true, referralInviter: ref as string }))
      return;
    }

    dispatch(updateUserStatistic({
      profitability: response.data.rows[0].profitability,
      tokens_burned: response.data.rows[0].tokens_burned
    }))

    dispatch(setGameBalance({
      money: parseFloat(balanceArray[0].split(' ')[0]),
      gold: parseFloat(balanceArray[1]?.split(' ')[0] || 0)
    }))

  } catch (error) {
    const errorMessage = 'Unable to update game balance. Please reload the page'
    console.log(errorMessage)
  }
}

