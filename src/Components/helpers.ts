import { InventoryItemType, TemplateType, UserDataType } from './types'
import { BalanceType } from '../redux/types'
import { calculateRepairCost, isUserHaveTokens } from './Mine/Mine'
import MoneyPng from '../img/money.png'
import Rank1 from '../img/common/rank_1.png'
import Rank2 from '../img/common/rank_2.png'
import Rank3 from '../img/common/rank_3.png'
import Rank4 from '../img/common/rank_4.png'
import Rank5 from '../img/common/rank_5.png'
import Rank6 from '../img/common/rank_6.png'
import Rank7 from '../img/common/rank_7.png'
import Rank8 from '../img/common/rank_8.png'
import Rank9 from '../img/common/rank_9.png'
import Rank10 from '../img/common/rank_10.png'
import Rank11 from '../img/common/rank_11.png'
import Rank12 from '../img/common/rank_12.png'
import Rank13 from '../img/common/rank_13.png'
import Rank14 from '../img/common/rank_14.png'
import Rank15 from '../img/common/rank_15.png'
import data from '../data.json'

export const getBalanceTypeFromArray = (tokensNumber: Array<string>): BalanceType => {
  let balance = {
    money: 0,
    gold: 0
  }

  tokensNumber.forEach(tn => {
    const tokenType = tn.substring(tn.length - 3, tn.length)
    const tokenQuantity = parseFloat(tn.substring(0, tn.length - 4))
    switch (tokenType) {
      case 'MWM':
        balance.money = tokenQuantity
        break
      default:
        break
    }
  })
  return balance
}


export const helperSetSelected = (list: Array<InventoryItemType>, id: string): Array<InventoryItemType> => {
  return list.map((item: InventoryItemType) => {
    if (item.id === id) {
      return { ...item, selected: !item.selected }
    }
    if (item.selected) {
      return { ...item, selected: false }
    }
    return item
  })
}

export const formatTime = (time: number) => {
  return String(time).padStart(2, '0')
}

export const getBalanceString = (balance: BalanceType | undefined): string => {
  let resultString = ''
  if (balance?.money != 0) {
    resultString = resultString.concat(balance?.money.toString() + 'MWM ')
  }

  return resultString
}

export const getStringFromUpperCase = (message: string) => (message?.slice(0, 1).toUpperCase() as string + message?.slice(1))

export const getInventoryImgByRank = (rank: any) => {
  if (!rank) return ''
  switch (rank) {
    case 1:
      return Rank1
    case 2:
      return Rank2
    case 3:
      return Rank3
    case 4:
      return Rank4
    case 5:
      return Rank5
    case 6:
      return Rank6
    case 7:
      return Rank7
    case 8:
      return Rank8
    case 9:
      return Rank9
    case 10:
      return Rank10
    case 11:
      return Rank11
    case 12:
      return Rank12
    case 13:
      return Rank13
    case 14:
      return Rank14
    case 15:
      return Rank15
  }
}

export const getRankByTemplateId = (template_id: any) : number => {
  if (!template_id) return 0
  switch (String(template_id)) {
    case data.rank_1:
      return 1
    case data.rank_2:
      return 2
    case data.rank_3:
      return 3
    case data.rank_4:
      return 4
    case data.rank_5:
      return 5
    case data.rank_6:
      return 6
    case data.rank_7:
      return 7
    case data.rank_8:
      return 8
    case data.rank_9:
      return 9
    case data.rank_10:
      return 10
    case data.rank_11:
      return 11
    case data.rank_12:
      return 12
    case data.rank_13:
      return 13
    case data.rank_14:
      return 14
    case data.rank_15:
      return 15
  }
  return 0
}

export const getBuildingNameByRank = (rank: any) => {
  if (!rank) return ''
  switch (rank) {
    case 1:
      return 'Small house'
    case 2:
      return 'House'
    case 3:
      return 'Villa'
    case 4:
      return 'Cornfield'
    case 5:
      return 'Country farm'
    case 6:
      return 'Restaurant'
    case 7:
      return 'Windmill'
    case 8:
      return 'Power Micro-station'
    case 9:
      return 'Power station'
    case 10:
      return 'Bank department'
    case 11:
      return 'Bank office'
    case 12:
      return 'City hall'
    case 13:
      return 'Police office'
    case 14:
      return 'Police department'
    case 15:
      return 'Police station'
  }
}


export const getAuthData = (userData: UserDataType) => {
  if (userData.loginType === 'wax') {
    return {
      actor: userData.waxSession.userAccount,
      permission: 'active'
    }
  } else {
    return userData.anchorSession.auth
  }
}

// export const getAvailableListToMine = (stakedList: any) => {
//   return stakedList.filter((item: any) => {
//     const itemTime = +item?.nextMine
//     const currentTime = Date.now()
//     return (currentTime - itemTime) > 0 && item.mineable && item.durability
//   }).map((item: any) => item.id)
// }

export const getTokenImage = () => {
  return MoneyPng
}
