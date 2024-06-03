import axios from 'axios'
import { ExplorerApi } from 'atomicassets'
import { TemplateType } from '../Components/types'
import data from '../data.json'
import { getBalanceTypeFromArray } from '../Components/helpers'
import { chainsData } from '../Components/LoginChoose/helpers'

const api = new ExplorerApi(
  data.apiEndPointUrl,
  'atomicassets',
  { fetch } as any
)

export const TemplateApi = {
  getItems: async () => {
    const index = Math.floor(Math.random() * chainsData.length)
    const response = await axios.post(chainsData[index].nodeUrl + data.apiGetTableRowsUrl, {
      'code': data.game_account,
      'table': data.templateToolsTable,
      'scope': data.game_account,
      'json': true,
      'index_position': '2',
      'key_type': 'i64',
      'encode_type': '',
      'lower_bound': '',
      'upper_bound': '',
      'limit': 100,
      'reverse': false,
      'show_payer': false
    })

    return response?.data.rows;
  }
}
