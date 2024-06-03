import axios from 'axios'
import { ExplorerApi } from 'atomicassets'
import { InventoryItemType } from '../Components/types'
import data from '../data.json'
import { chainsData } from '../Components/LoginChoose/helpers'
import { getRankByTemplateId } from '../Components/helpers'

const api = new ExplorerApi(
  data.apiEndPointUrl,
  'atomicassets',
  { fetch } as any
)

export const InventoryApi = {
  getToolsTable: async (accountName: string) => {
    const index = Math.floor(Math.random() * chainsData.length)
    return await axios.post(chainsData[index].nodeUrl + data.apiGetTableRowsUrl, {
      json: true,
      code: data.game_account,
      table: data.inventoryToolsTable,
      scope: accountName,
      index_position: '1',
      encode_type: '',
      lower_bound: '',
      upper_bound: '',
      limit: 1000,
      reverse: false,
      show_payer: false
    })
  },
  getStakedList: async (accountName: string) => {
    const stakedList: Array<InventoryItemType> = []
    const index = Math.floor(Math.random() * chainsData.length)

    const response = await axios.post(chainsData[index].nodeUrl + data.apiGetTableRowsUrl, {
      json: true,
      code: data.game_account,
      table: 'buildings',
      scope: accountName,
      index_position: '1',
      key_type: '',
      encode_type: '',
      lower_bound: '',
      upper_bound: '',
      limit: 1000,
      reverse: false,
      show_payer: false
    })

    response.data.rows.map(
      (row: { asset_id: string, last_claimed: number, under_upgrade: boolean, availbe_claim_update: number, template_id: string }) => {
        if(getRankByTemplateId(row?.template_id) != 0) //update
          stakedList.push({
            id: row.asset_id,
            selected: false,
            under_upgrade: row.under_upgrade,
            available_claim_update: new Date(row.availbe_claim_update * 1000),
            last_claimed: new Date(row.last_claimed * 1000),
            template_id: row?.template_id as string,
            mineable: true,
            rank: getRankByTemplateId(row?.template_id)
          })
      }
    )

    // const stakedList: Array<InventoryItemType> = []
    // let index = Math.floor(Math.random() * chainsData.length)
    // const response = await axios.post(chainsData[index].nodeUrl + data.apiGetTableRowsUrl, {
    //   json: true,
    //   code: data.game_account,
    //   table: data.inventoryToolsTable,
    //   scope: data.game_account,
    //   index_position: '2',
    //   key_type: 'name',
    //   encode_type: '',
    //   lower_bound: accountName,
    //   upper_bound: accountName,
    //   limit: 100,
    //   reverse: false,
    //   show_payer: false
    // })
    // await Promise.all(
    //   response.data.rows.map(
    //     (row: { asset_id: string; durability: number; next_mine: number }) => {
    //       return new Promise(async (resolve: any) => {
    //         return api.getAsset(row.asset_id).then((asset) => {
    //           stakedList.push({
    //             id: asset.asset_id,
    //             selected: false,
    //             durability: row.durability,
    //             nextMine: new Date(row.next_mine * 1000),
    //             template_id: asset.template?.template_id as string,
    //             mineable: true
    //           })
    //           resolve()
    //         })
    //       })
    //     }
    //   )
    // )
    //
    //
    // stakedList.sort((a, b) => {
    //   return a.template_id === b.template_id ? 0 :
    //     a.template_id > b.template_id ? 1 : -1
    // })
    return stakedList
  },
  getUnStakedList: async (owner: string) => {
    const index = Math.floor(Math.random() * chainsData.length)
    // const assets = await api.getAssets({
    //   owner: owner,
    //   collection_name: data.collection_name,
    //   schema_name: 'tools'
    // })
    //
    //
    // let unstakedList = assets.map((asset) => {
    //   return {
    //     id: asset.asset_id,
    //     imgLink: data.baseImgLink + asset.data.img,
    //     selected: false,
    //     template_id: asset.template?.template_id as string,
    //     type: 'tools'
    //   }
    // })
    //
    //
    // unstakedList.sort((a, b) => {
    //   return a.template_id === b.template_id ? 0 :
    //     a.template_id > b.template_id ? 1 : -1
    // })

    const rpcResponse = await axios.post(chainsData[index].nodeUrl + data.apiGetTableRowsUrl, {
      'code': 'atomicassets',
      'table': 'assets',
      'scope': owner,
      'json': true,
      'index_position': '1',
      'key_type': '',
      'encode_type': '',
      'lower_bound': '',
      'upper_bound': '',
      'limit': 10000,
      'reverse': false,
      'show_payer': false
    });

    let rpcResponse2 = { data: { rows: [], next_key: '' } }
    if (rpcResponse.data['next_key']) {
      rpcResponse2 = await axios.post(chainsData[index].nodeUrl + data.apiGetTableRowsUrl, {
        'code': 'atomicassets',
        'table': 'assets',
        'scope': owner,
        'json': true,
        'index_position': '1',
        'key_type': '',
        'encode_type': '',
        'lower_bound': rpcResponse.data['next_key'],
        'upper_bound': '',
        'limit': 10000,
        'reverse': false,
        'show_payer': false
      })
    }
    let rpcResponse3 = { data: { rows: [], next_key: '' } }
    if (rpcResponse2.data['next_key']) {
      rpcResponse3 = await axios.post(chainsData[index].nodeUrl + data.apiGetTableRowsUrl, {
        'code': 'atomicassets',
        'table': 'assets',
        'scope': owner,
        'json': true,
        'index_position': '1',
        'key_type': '',
        'encode_type': '',
        'lower_bound': rpcResponse2.data['next_key'],
        'upper_bound': '',
        'limit': 10000,
        'reverse': false,
        'show_payer': false
      })
    }
    let rpcResponse4 = { data: { rows: [] } }
    if (rpcResponse3.data['next_key']) {
      rpcResponse4 = await axios.post(chainsData[index].nodeUrl + data.apiGetTableRowsUrl, {
        'code': 'atomicassets',
        'table': 'assets',
        'scope': owner,
        'json': true,
        'index_position': '1',
        'key_type': '',
        'encode_type': '',
        'lower_bound': rpcResponse2.data['next_key'],
        'upper_bound': '',
        'limit': 10000,
        'reverse': false,
        'show_payer': false
      })
    }
    const mainArray = [...rpcResponse.data.rows, ...rpcResponse2.data.rows, ...rpcResponse3.data.rows, ...rpcResponse4.data.rows]

    const rpcData = mainArray.filter((item: any) => item['collection_name'] === data.collection_name)

    const assets = rpcData.filter((item: any) => item['schema_name'] === 'building')

    let unstakedList = assets.map((asset: any) => {
      return {
        id: asset.asset_id,
        imgLink: '',
        selected: false,
        template_id: asset.template_id as string,
        type: 'tools',
        rank: getRankByTemplateId(asset?.template_id)
      }
    }).filter((asset: any) => asset.rank !== 0); //update

    unstakedList.sort((a: any, b: any) => {
      return a.rank === b.rank ? 0 :
        a.rank > b.rank ? 1 : -1
    }).reverse()

    return unstakedList as Array<{ id: string, imgLink: string, selected: boolean, template_id: string }>
  }
}
