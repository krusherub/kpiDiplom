import { BalanceType } from '../redux/types'
import data from '../data.json'

export enum WalletEnum {
  wax = 'wax',
  anchor = 'anchor'
}

export type UserDataType = {
  loginType: WalletEnum,
  accountName: string,
  anchorSession: any,
  waxSession: any,
  profitability?: number,
  tokens_burned?: string
};

export type GlobalStatisticType = {
  total_profitability: number,
  total_burned: string,
  tokens_minted: string,
  token_creation_s: string,
  withdraw_fee: number,
  ranks_available: number,
  minimal_price: number,
  pack_discount: number,
  pack_chances: Array<number>,
  upgrade_discount: number,
  referal_bonus: number | string,
  playable: number,
  game_start_time: string,
}

export type InventoryItemType = {
  selected: boolean,
  id: string,
  template_id: string,
  last_claimed: Date,
  under_upgrade: boolean,
  available_claim_update: Date,
  upgrade_template_id?: string,
  type?: string,
  mineable: boolean
  rank: number
};

export type TemplateType = {
  template_id: string,
  template_name: string,
  type: string,
  imgLink: string,
  rarity: string,
  charged_time: number,
  profitability: number,
  chance_to_success_upgrade_risk: number,
  upgrade_time: number,
  durability_consume: string,
  craftCost: BalanceType,
  init_durability: number,
  repair_cost: BalanceType,
  rewards: BalanceType,
  upgrade_template_id: string
};
