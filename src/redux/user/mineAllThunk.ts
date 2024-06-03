import { AppThunk } from '../store'
import data from '../../data.json'
import { getAuthData } from '../../Components/helpers'
import { setLoading, setMessage } from './userSlice'
import { getStakedListThunk } from './inventoryThunk'
import { updateGameBalanceThunk } from './balanceThunk'
import { sendTransaction } from '../../api/transact.api'
import { MessageEnum } from '../types'
import { BalanceApi } from '../../api/balance.api'

export const claimAllThunk =
  (): AppThunk =>
    async (dispatch, getState) => {
      try {
        const userData = getState().user.userData
        const stakedList = getState().user.stakedList
        const gameBalance = getState().user.gameBalance

        const action = {
          account: data.game_account,
          name: 'claimall',
          authorization: [getAuthData(userData)],
          data: {
            owner: userData.accountName,
            asset_ids: stakedList.filter((item) => !item.under_upgrade).map((item) => item.id)
          }
        }
        dispatch(setLoading(true))
        const transactionHandler = setInterval(async () => {
          const response = await BalanceApi.updateGameBalance(userData.accountName)

          const balanceArray = response.data.rows.length === 0
            ? ['0']
            : response.data.rows[0].balance


          if (parseFloat(balanceArray[0].split(' ')[0]) != gameBalance.money) {
            dispatch(getStakedListThunk())
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
                const errorMessage = 'Mine all error'
                dispatch(setMessage({ type: MessageEnum.error, text: errorMessage }))
              }
            }
            dispatch(setLoading(false))
            clearInterval(transactionHandler)
          })
      } catch (error) {
        dispatch(setLoading(false))
        const errorMessage = 'Mine all error'
        dispatch(setMessage({ type: MessageEnum.error, text: errorMessage }))
      }
    }

