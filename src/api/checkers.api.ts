import axios from 'axios'
import { chainsData } from '../Components/LoginChoose/helpers'
import data from '../data.json'

export const CheckersApi = {
  checkBots: async () => {
    const index = Math.floor(Math.random() * chainsData.length)
    const response = await axios.post(chainsData[index].nodeUrl + data.apiGetTableRowsUrl, {
      'code': data.game_account,
      'table': 'penalty',
      'scope': data.game_account,
      'json': true,
      'index_position': '1',
      'key_type': '',
      'encode_type': '',
      'lower_bound': '',
      'upper_bound': '',
      'limit': 1000,
      'reverse': false,
      'show_payer': false
    }).catch(() => ({
      data: {
        rows: []
      }
    }))

    return response?.data?.rows || []
  },
  checkUserExists: async (accountName: string) => {
    const index = Math.floor(Math.random() * chainsData.length)
    const gameBalanceUrl = chainsData[index].nodeUrl + data.apiGetTableRowsUrl

    const response = await axios.post(gameBalanceUrl, {
      code: data.game_account,
      table: 'users',
      scope: data.game_account,
      json: true,
      index_position: '1',
      key_type: '',
      encode_type: '',
      lower_bound: accountName,
      upper_bound: accountName,
      limit: 10,
      reverse: false,
      show_payer: false
    }).catch(() => ({
      data: {
        rows: []
      }
    }))

    return response?.data?.rows?.length !== 0
  }
}