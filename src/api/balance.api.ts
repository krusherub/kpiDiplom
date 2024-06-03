import axios from 'axios'
import data from '../data.json'
import { chainsData } from '../Components/LoginChoose/helpers'

export const BalanceApi = {
  updateUserBalance: async (accountName: string) => {
    const index = Math.floor(Math.random() * chainsData.length)
    const userBalanceUrl = chainsData[index].nodeUrl + data.userBalanceUrl
    const code = data.token_address

    return axios.all([
      axios.post(userBalanceUrl, {
        code: code,
        account: accountName,
        symbol: 'MWM'
      }),
    ])
  },
  updateGameBalance: async (accountName: string) => {
    const index = Math.floor(Math.random() * chainsData.length)
    const gameBalanceUrl = chainsData[index].nodeUrl + data.apiGetTableRowsUrl

    return axios.post(gameBalanceUrl, {
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
    })
  }
}
