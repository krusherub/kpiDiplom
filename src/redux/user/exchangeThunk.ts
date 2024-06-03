import { AppThunk } from '../store'
import { ExchangeApi } from '../../api/exchange.api'
import { setFeePercent, setLoading, setMessage } from './userSlice'
import { sendTransaction } from '../../api/transact.api'
import { getTokenQuantities } from '../../Components/Exchange/helpers'
import { BalanceType, ExchangeTypeEnum, MessageEnum } from '../types'
import { updateGameBalanceThunk, updateUserBalanceThunk } from './balanceThunk'
import data from '../../data.json'
import { getAuthData } from '../../Components/helpers'


export const moneyDepositWithdrawThunk =
  (tokens: BalanceType, type: ExchangeTypeEnum): AppThunk =>
    async (dispatch, getState) => {
      try {
        const quantities = getTokenQuantities(tokens)
        const userData = getState().user.userData
        const withdrawAction = {
          account: data.game_account,
          name: data.withdrawActionName,
          authorization: [getAuthData(userData)],
          data: {
            owner: userData.accountName,
            quantities: ['']
          }
        }

        const depositAction = {
          account: data.token_address,
          name: data.transfersActionName,
          authorization: [getAuthData(userData)],
          data: {
            from: userData.accountName,
            to: data.game_account,
            memo: 'deposit',
            quantities: ['']
          }
        }
        const action =
          type === ExchangeTypeEnum.withdraw ? withdrawAction : depositAction

        if (quantities.length === 0) {
          return null
        }
        action.data.quantities = quantities

        dispatch(setLoading(true))

        sendTransaction(userData, action).then(
          ({ transaction }: { transaction: { id: string } }) => {
            setTimeout(() => {
              dispatch(updateUserBalanceThunk())
              dispatch(updateGameBalanceThunk())
              dispatch(setLoading(false))
            }, 5000)
          }
        )
          .catch((error: any) => {
            if (error?.json?.error?.name === 'tx_cpu_usage_exceeded' ||
              error?.json?.error?.name === 'tx_ram_usage_exceeded' ||
              error?.json?.error?.name === 'tx_net_usage_exceeded') {
              const message = error.json.error.what
              dispatch(setMessage({ type: MessageEnum.error, text: message }))
            } else {
              if (error.code !== 'E_CANCEL') {
                const errorMessage = `${type === ExchangeTypeEnum.deposit ? 'Deposit' : 'Withdraw'} error. Please reload the page`
                dispatch(setMessage({ type: MessageEnum.error, text: errorMessage }))
              }
            }
            dispatch(setLoading(false))
          })
      } catch (e) {
        dispatch(setLoading(false))
        const errorMessage = `${type === ExchangeTypeEnum.deposit ? 'Deposit' : 'Withdraw'} error. Please reload the page`
        dispatch(setMessage({ type: MessageEnum.error, text: errorMessage }))
      }
    }

