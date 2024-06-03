import { chainsData } from '../Components/LoginChoose/helpers'
import data from '../data.json'
import axios from 'axios'

export const BankApi = {
  getUserBankStatistic: async (accountName: string) => {
    const index = Math.floor(Math.random() * chainsData.length)
    const bankUrl = chainsData[index].nodeUrl + data.apiGetTableRowsUrl

    return axios.post(bankUrl, {
      code: data.game_account,
      table: 'usersbank',
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
    })
  },
  getBankTransfers: async (accountName: string) => {
    const index = Math.floor(Math.random() * chainsData.length)
    const bankUrl = chainsData[index].nodeUrl + data.apiGetTableRowsUrl

    return axios.post(bankUrl, {
      code: data.game_account,
      table: 'transfers',
      scope: accountName,
      json: true,
      index_position: '1',
      key_type: '',
      encode_type: '',
      lower_bound: '',
      upper_bound: '',
      limit: 1000,
      reverse: false,
      show_payer: false
    })
  },
  getUserBankConfig: async () => {
    const index = Math.floor(Math.random() * chainsData.length)
    const bankUrl = chainsData[index].nodeUrl + data.apiGetTableRowsUrl

    return axios.post(bankUrl, {
      code: data.game_account,
      table: 'configbank',
      scope: data.game_account,
      json: true,
      index_position: '1',
      key_type: '',
      encode_type: '',
      lower_bound: '',
      upper_bound: '',
      limit: 10,
      reverse: false,
      show_payer: false
    })
  },
}