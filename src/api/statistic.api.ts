import axios from 'axios'
import { chainsData } from '../Components/LoginChoose/helpers'
import data from '../data.json'

export const StatisticApi = {
  getLeaderboard: async () => {
    const index = Math.floor(Math.random() * chainsData.length)
    return axios
      .post(chainsData[index].nodeUrl + data.apiGetTableRowsUrl, {
        json: true,
        code: data.game_account,
        table: 'users',
        scope: data.game_account,
        index_position: '2',
        key_type: 'i64',
        lower_bound: "",
        upper_bound: "",
        limit: 100,
        reverse: true,
        show_payer: false
      })
  },
  getGlobalStatistic: async () => {
    const index = Math.floor(Math.random() * chainsData.length)
    return axios
      .post(chainsData[index].nodeUrl + data.apiGetTableRowsUrl, {
        json: true,
        code: data.game_account,
        table: 'config',
        scope: data.game_account,
        index_position: '1',
        key_type: '',
        lower_bound: "",
        upper_bound: "",
        limit: 1,
        show_payer: false
      })
  }
}
