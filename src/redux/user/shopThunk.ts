import { AppThunk } from '../store'
import {
  setLoading,
  setMessage,
  updateReceiveResult
} from './userSlice'
import { MessageEnum } from '../types'
import data from '../../data.json'
import { getAuthData } from '../../Components/helpers'
import { sendTransaction } from '../../api/transact.api'
import { InventoryApi } from '../../api/inventory.api'
import { updateGameBalanceThunk } from './balanceThunk'
import { getUnStakedListThunk } from './inventoryThunk'
import {difference} from 'lodash'
import { statisticThunk } from './statisticThunk'

export const buyPackThunk = (cost: any): AppThunk =>
  async (dispatch, getState) => {
    try {
      const userData = getState().user.userData
      const oldUnStakedList = getState().user.unStakedList

      const action = {
        account: data.game_account,
        name: 'buybuilding',
        authorization: [getAuthData(userData)],
        data: {
          buyer: userData.accountName,
          cost: cost
        }
      }

      dispatch(setLoading(true))

      const transactionHandler = setInterval(async () => {
        const newUnStakedList: any = await InventoryApi.getUnStakedList(userData.accountName)

        if (newUnStakedList.length - oldUnStakedList.length === 1) {
          dispatch(getUnStakedListThunk())
          dispatch(updateGameBalanceThunk())
          dispatch(statisticThunk())
          dispatch(setLoading(false))
          let newUnStakedIds =  newUnStakedList.map((item: any) => item.id)
          let oldUnStakedIds =  oldUnStakedList.map((item: any) => item.id)
          let diffId = difference(newUnStakedIds, oldUnStakedIds)[0]
          let diff = newUnStakedList.filter((item: any) => item.id === diffId)[0]
          dispatch(updateReceiveResult({template_id: diff?.template_id, failure: false}))
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
              const errorMessage = 'Buy error'
              console.log(errorMessage)
            }
          }
          dispatch(setLoading(false))
          // clearInterval(transactionHandler)
        })
    } catch (error) {
      dispatch(setLoading(false))
      const errorMessage = 'Buy error'
      console.log(errorMessage)
    }
  }
