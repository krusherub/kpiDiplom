import { AppThunk } from '../store'
import { changeUserStatus, setLoading, setMessage, setUserData } from './userSlice'
import { MessageEnum } from '../types'
import { WalletEnum } from '../../Components/types'
import AnchorLink from 'anchor-link'
import AnchorLinkBrowserTransport from 'anchor-link-browser-transport'
import * as waxjs from '@waxio/waxjs/dist'
import mainData from '../../data.json'
import data from '../../data.json'
import { getAuthData } from '../../Components/helpers'
import { InventoryApi } from '../../api/inventory.api'
import { sendTransaction } from '../../api/transact.api'
import { CheckersApi } from '../../api/checkers.api'

export const loginThunk =
  (type: WalletEnum, selectedChain: any): AppThunk => async (dispatch, getState) => {
    try {
      const userData = getState().user.userData
      const transport = new AnchorLinkBrowserTransport()

      let newUserData = {
        loginType: userData.loginType,
        accountName: userData.accountName,
        anchorSession: userData.anchorSession,
        waxSession: userData.waxSession,
        profitability: 0,
        tokens_burned: '0 MWM'
      }

      newUserData.loginType = type


      if (type === 'wax') {
        newUserData.waxSession = new waxjs.WaxJS({
          rpcEndpoint: selectedChain.nodeUrl
        })
        /*newUserData.waxSession.login('modernworld').then((respData: any) => {
          dispatch(setUserData({ ...newUserData, accountName: respData }))

          dispatch(setLoading(false))
        })*/
      } else {
        dispatch(setLoading(true))
        const anchorLink = new AnchorLink({
          transport,
          chains: [{
            chainId: mainData.anchorChainId,
            nodeUrl: mainData.anchorEndpoint
          }]
        })
        anchorLink.login('modernworld').then(async (identity) => {
          const { session } = identity
          newUserData.anchorSession = session
          newUserData.accountName = session.auth.toString().split('@')[0]

          dispatch(setUserData(newUserData))
          dispatch(setLoading(false))
        }).catch((error: any) => {
          if (error?.json?.error?.name === 'tx_cpu_usage_exceeded' ||
            error?.json?.error?.name === 'tx_ram_usage_exceeded' ||
            error?.json?.error?.name === 'tx_net_usage_exceeded') {
            const message = error.json.error.what
            dispatch(setMessage({ type: MessageEnum.error, text: message }))
          } else {
            if (error.code !== 'E_CANCEL') {
              dispatch(setMessage({ type: MessageEnum.error, text: error.message }))
            }
          }
          dispatch(setLoading(false))
        })

      }

    } catch (error) {
      const errorMessage = 'Unable to login. Please reload the page'
      dispatch(setMessage({ type: MessageEnum.error, text: errorMessage }))
    }
  }

export const signUpThunk =
  (referrer: string, closeAction: any): AppThunk => async (dispatch, getState) => {
    try {
      const userData = getState().user.userData

      const action = {
        account: data.game_account,
        name: 'signup',
        authorization: [getAuthData(userData)],
        data: {
          user: userData.accountName,
          referrer: referrer
        }
      }
      dispatch(setLoading(true))

      const transactionHandler = setInterval(async () => {
        const isUserExist = await CheckersApi.checkUserExists(userData.accountName)

        if (isUserExist) {
          dispatch(setLoading(false))
          closeAction();
          dispatch(changeUserStatus({ isNew: false, referralInviter: '' }))
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
                const message = 'Sign up error'
                dispatch(setMessage({ type: MessageEnum.error, text: message }))
              }
            }
          }
          dispatch(setLoading(false))
          clearInterval(transactionHandler)
        })
    } catch (error) {
      const errorMessage = 'Unable to sign up. Please reload the page'
      dispatch(setMessage({ type: MessageEnum.error, text: errorMessage }))
    }
  }