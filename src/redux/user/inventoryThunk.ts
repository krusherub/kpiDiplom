import { InventoryApi } from '../../api/inventory.api'
import { AppThunk } from '../store'
import { setLoading, setMessage, setStakedList, setUnStakedList } from './userSlice'
import { InventoryItemType, WalletEnum } from '../../Components/types'
import { sendTransaction } from '../../api/transact.api'
import { MessageEnum } from '../types'
import data from '../../data.json'
import { getAuthData } from '../../Components/helpers'
import { statisticThunk } from './statisticThunk'
import { updateGameBalanceThunk } from './balanceThunk'

export const getStakedListThunk =
  (): AppThunk => async (dispatch, getState) => {
    try {
      const accountName = getState().user.userData.accountName

      const stakedList = await InventoryApi.getStakedList(accountName)

      dispatch(setStakedList(stakedList))
    } catch (error) {
      const errorMessage = 'Unable to load staked list. Please reload the page'
      dispatch(setMessage({ type: MessageEnum.error, text: errorMessage }))
    }
  }

export const getUnStakedListThunk =
  (): AppThunk => async (dispatch, getState) => {
    try {
      const owner = getState().user.userData.accountName

      const unStakedList = await InventoryApi.getUnStakedList(owner)

      dispatch(setUnStakedList(unStakedList))
    } catch (error) {
      const errorMessage = 'Unable to load unstaked list. Please reload the page'
      dispatch(setMessage({ type: MessageEnum.error, text: errorMessage }))
    }
  }

export const stakeThunk = (inventory: Array<InventoryItemType>): AppThunk => async (dispatch, getState) => {
  try {
    if (!inventory) throw 'No item selected'

    const oldStakedList = getState().user.stakedList
    const oldUnStakedList = getState().user.unStakedList
    const userData = getState().user.userData

    const action = {
      account: data.atomicAssetsAccountName,
      name: data.transferActionName,
      authorization: [getAuthData(userData)],
      data: {
        from: userData.accountName,
        to: data.game_account,
        asset_ids: inventory.map(item => item.id),
        memo: 'stake'
      }
    }
    dispatch(setLoading(true))

    const transactionHandler = setInterval(async () => {
      const newUnStakedList = await InventoryApi.getUnStakedList(userData.accountName)
      const newStakedList = await InventoryApi.getStakedList(userData.accountName)
      if (newStakedList.length - oldStakedList.length === inventory.length &&
        oldUnStakedList.length - newUnStakedList.length === inventory.length) {
        newStakedList.sort((a, b) => {
          return a.template_id === b.template_id ? 0 :
            a.template_id > b.template_id ? 1 : -1
        })
        newUnStakedList.sort((a, b) => {
          return a.template_id === b.template_id ? 0 :
            a.template_id > b.template_id ? 1 : -1
        })

        dispatch(setStakedList(newStakedList))
        dispatch(setUnStakedList(newUnStakedList))
        dispatch(setLoading(false))
        dispatch(updateGameBalanceThunk())
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
          if (error.message.includes('assertion failure with message')) {
            const message = error.message.replace('assertion failure with message:', '')
            dispatch(setMessage({ type: MessageEnum.error, text: message }))
          } else {
            if (error.code !== 'E_CANCEL') {
              const message = 'Stake error'
              dispatch(setMessage({ type: MessageEnum.error, text: message }))
            }
          }
        }
        dispatch(setLoading(false))
        clearInterval(transactionHandler)
      })
  } catch (error) {
    dispatch(setLoading(false))
    const errorMessage = 'Stake error. Please reload the page'
    dispatch(setMessage({ type: MessageEnum.error, text: errorMessage }))
  }
}

export const unStakeThunk = (inventory: Array<InventoryItemType>): AppThunk => async (dispatch, getState) => {
  try {
    if (!inventory) throw 'No item selected'

    const oldStakedList = getState().user.stakedList
    const oldUnStakedList = getState().user.unStakedList
    const userData = getState().user.userData

    const action = {
      account: data.game_account,
      name: data.unStakeActionName,
      authorization: [getAuthData(userData)],
      data: {
        asset_owner: userData.accountName,
        asset_ids: inventory.map(item => item.id)
      }
    }
    dispatch(setLoading(true))

    const transactionHandler = setInterval(async () => {
      const newUnStakedList = await InventoryApi.getUnStakedList(userData.accountName)
      const newStakedList = await InventoryApi.getStakedList(userData.accountName)
      if (newUnStakedList.length - oldUnStakedList.length === inventory.length &&
        oldStakedList.length - newStakedList.length === inventory.length) {
        newStakedList.sort((a, b) => {
          return a.template_id === b.template_id ? 0 :
            a.template_id > b.template_id ? 1 : -1
        })
        newUnStakedList.sort((a, b) => {
          return a.template_id === b.template_id ? 0 :
            a.template_id > b.template_id ? 1 : -1
        })

        dispatch(setStakedList(newStakedList))
        dispatch(setUnStakedList(newUnStakedList))
        dispatch(setLoading(false))
        dispatch(updateGameBalanceThunk())
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
          if (error.message.includes('assertion failure with message')) {
            const message = error.message.replace('assertion failure with message:', '')
            dispatch(setMessage({ type: MessageEnum.error, text: message }))
          } else {
            if (error.code !== 'E_CANCEL') {
              const message = 'Unstake error'
              dispatch(setMessage({ type: MessageEnum.error, text: message }))
            }
          }
        }
        dispatch(setLoading(false))
        clearInterval(transactionHandler)
      })
  } catch (error) {
    dispatch(setLoading(false))
    const errorMessage = 'Unstake error. Please reload the page'
    dispatch(setMessage({ type: MessageEnum.error, text: errorMessage }))
  }
}
