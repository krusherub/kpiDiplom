import axios from 'axios'
import data from '../data.json'
import { chainsData } from '../Components/LoginChoose/helpers'

export const ExchangeApi = {
  updateFeePercent: () => {
    const index = Math.floor(Math.random() * chainsData.length)
    return axios
      .post(chainsData[index].nodeUrl + data.apiGetTableRowsUrl, {
        json: true,
        code: data.game_account,
        table: 'config',
        scope: data.game_account,
        index_position: '1',
        key_type: '',
        encode_type: '',
        lower_bound: '',
        upper_bound: '',
        limit: 1,
        reverse: false,
        show_payer: false
      })
  }
}