export type BalanceType = {
  [key in BalanceEnum]: number
}

export type ToolConfig = {
  repair_cost: BalanceType,
  rewards: BalanceType,
  template_name: string,
  type: string
}

export enum BalanceEnum {
  money = 'money',
  gold = 'gold'
}

export enum ExchangeTypeEnum {
  deposit = 'deposit',
  withdraw = 'withdraw'
}

export enum MessageEnum {
  error = 'error',
  warning = 'warn',
  info = 'info',
  success = 'success',
  noType = 'no-type'
}
