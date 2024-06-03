import { AppThunk } from '../store'
import { InventoryItemType, WalletEnum } from '../../Components/types'
import { sendTransaction } from '../../api/transact.api'
import {
  setLoading,
  setMessage, setStakedList, updateReceiveResult
} from './userSlice'
import { getStakedListThunk } from './inventoryThunk'
import { MessageEnum } from '../types'
import data from '../../data.json'
import { updateGameBalanceThunk } from './balanceThunk'
import { getAuthData } from '../../Components/helpers'
import { InventoryApi } from '../../api/inventory.api'

export const claimThunk =
  (item: InventoryItemType, cb?: any): AppThunk =>
    async (dispatch, getState) => {
      try {
        const userData = getState().user.userData

        const action = {
          account: data.game_account,
          name: data.safeMineActionName,
          authorization: [getAuthData(userData)],
          data: {
            asset_owner: userData.accountName,
            asset_id: item.id
          }
        }

        dispatch(setLoading(true))

        const transactionHandler = setInterval(async () => {
          const toolsList = await InventoryApi.getToolsTable(userData.accountName)
          const mineAsset = toolsList.data.rows
            .find((row: { asset_id: string; }) => row.asset_id === item.id);

          const testDateNow = new Date(item.last_claimed);
          const timeToCheck = testDateNow.getTime();
          if (mineAsset.last_claimed * 1000  > timeToCheck) {
            dispatch(getStakedListThunk())
            dispatch(updateGameBalanceThunk())
            dispatch(setLoading(false))
            //cb(false) //update
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
                const errorMessage = 'Safe mine error'
                dispatch(setMessage({ type: MessageEnum.error, text: errorMessage }))
              }
            }
            dispatch(setLoading(false))
            clearInterval(transactionHandler);
          })
      } catch (error) {
        dispatch(setLoading(false))
        const errorMessage = 'Claim error'
        dispatch(setMessage({ type: MessageEnum.error, text: errorMessage }))
      }
    }


export const upgradeThunk =
  (assetId: string, cost: string, cb: any): AppThunk =>
    async (dispatch, getState) => {
      try {
        const userData = getState().user.userData

        const action = {
          account: data.game_account,
          name: data.upgradeActionName,
          authorization: [getAuthData(userData)],
          data: {
            asset_owner: userData.accountName,
            asset_id: assetId,
            cost: cost
          }
        }

        dispatch(setLoading(true))

        const transactionHandler = setInterval(async () => {
          const toolsList = await InventoryApi.getToolsTable(userData.accountName)
          const mineAsset = toolsList.data.rows
            .find((row: { asset_id: string; }) => row.asset_id === assetId);

          if (mineAsset?.under_upgrade) {
            dispatch(updateGameBalanceThunk())
            dispatch(setLoading(false))
            dispatch(getStakedListThunk())
            cb(false);
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
                const errorMessage = 'Upgrade error'
                dispatch(setMessage({ type: MessageEnum.error, text: errorMessage }))
              }
            }
            dispatch(setLoading(false))
            clearInterval(transactionHandler);
          })
      } catch (error) {
        dispatch(setLoading(false))
        const errorMessage = 'Upgrade error'
        dispatch(setMessage({ type: MessageEnum.error, text: errorMessage }))
      }
    }

export const upgradeClaimThunk =
  (assetId: string, cb?: any): AppThunk =>
    async (dispatch, getState) => {
      try {
        const userData = getState().user.userData

        const action = {
          account: data.game_account,
          name: 'claimupgrade',
          authorization: [getAuthData(userData)],
          data: {
            asset_owner: userData.accountName,
            asset_id: assetId
          }
        }

        dispatch(setLoading(true))

        const transactionHandler = setInterval(async () => {
          const toolsList = await InventoryApi.getToolsTable(userData.accountName)
          const mineAsset = toolsList.data.rows
            .find((row: { asset_id: string; }) => row.asset_id === assetId);

          if (!mineAsset?.under_upgrade) {
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
                const errorMessage = 'Claim upgrade error'
                dispatch(setMessage({ type: MessageEnum.error, text: errorMessage }))
              }
            }
            dispatch(setLoading(false))
            clearInterval(transactionHandler);
          })
      } catch (error) {
        dispatch(setLoading(false))
        const errorMessage = 'Claim upgrade error'
        dispatch(setMessage({ type: MessageEnum.error, text: errorMessage }))
      }
    }


export const dangerousUpgradeThunk =
  (asset: InventoryItemType, cb: any, cb2: any): AppThunk =>
    async (dispatch, getState) => {
      try {
        const userData = getState().user.userData
        const templates = getState().user.templates
        const stakedList = getState().user.stakedList

        const action = {
          account: data.game_account,
          name: 'riskupgrade',
          authorization: [getAuthData(userData)],
          data: {
            asset_owner: userData.accountName,
            asset_id: asset.id
          }
        }
        dispatch(setLoading(true))

        // const transactionHandler = setInterval(async () => {
        //   const toolsList = await InventoryApi.getToolsTable(userData.accountName)
        //   const mineAsset = toolsList.data.rows
        //     .find((row: { asset_id: string; }) => row.asset_id === assetId);
        //
        //   if (mineAsset?.under_upgrade) {
        //     dispatch(updateGameBalanceThunk())
        //     dispatch(setLoading(false))
        //     dispatch(getStakedListThunk())
        //     cb(false);
        //     clearInterval(transactionHandler)
        //   }
        // }, 5000)

        sendTransaction(userData, action).then((hash: any)=> {
          if(hash.processed.action_traces[0].inline_traces.length > 1) {
            const templateConfigData = templates.find((item: any) => +item.template_id === +asset.template_id);
            dispatch(updateReceiveResult({template_id: templateConfigData?.upgrade_template_id as string, failure: false}))
          }
          else {
            dispatch(updateReceiveResult({template_id: asset.template_id as string, failure: true}))
          }
          dispatch(setStakedList(stakedList.filter((item) => item.id != asset.id)))
          cb(false)
          cb2(false)
          dispatch(setLoading(false))
        })
          .catch((error: any) => {
            if (error?.json?.error?.name === 'tx_cpu_usage_exceeded' ||
              error?.json?.error?.name === 'tx_ram_usage_exceeded' ||
              error?.json?.error?.name === 'tx_net_usage_exceeded') {

              const message = error.json.error.what
              dispatch(setMessage({ type: MessageEnum.error, text: message }))
            } else {
              if (error.code !== 'E_CANCEL') {
                const errorMessage = 'Dangerous upgrade error'
                dispatch(setMessage({ type: MessageEnum.error, text: errorMessage }))
              }
            }
            // dispatch(setLoading(false))
            // clearInterval(transactionHandler);
          })


      } catch (error) {
        dispatch(setLoading(false))
        const errorMessage = 'Dangerous upgrade error'
        dispatch(setMessage({ type: MessageEnum.error, text: errorMessage }))
      }
    }