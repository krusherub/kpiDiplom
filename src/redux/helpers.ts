import data from '../data.json'

export const getAxiosRequestData = (tableName: string) => {
  return {
    'code': data.game_account,
    'table': tableName,
    'scope': data.game_account,
    'json': true,
    'index_position': '1',
    'key_type': '',
    'encode_type': '',
    'lower_bound': '',
    'upper_bound': '',
    'limit': 100,
    'reverse': false,
    'show_payer': false
  }
}
