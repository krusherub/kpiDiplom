import React from 'react'
import { GlobalStatisticType, InventoryItemType } from '../types'
import { getBuildingNameByRank, getRankByTemplateId  } from '../helpers'

export const getItemMineData = (templates: any, selectedItem: InventoryItemType, globalStatistic: GlobalStatisticType) => {
  if (!selectedItem?.template_id || !globalStatistic?.total_profitability) {
    return {
      claimNow: 0,
      miningPerMin: 0,
      name: '',
      profitability: 0,
      class: 0
    }
  }

  const templateConfigData = templates.find((item: any) => +item.template_id === +selectedItem.template_id);

  const income = (templateConfigData?.profitability / globalStatistic.total_profitability)
    * Number.parseFloat(globalStatistic.token_creation_s);

  return {
    claimNow: (income * (Date.now() - +selectedItem.last_claimed) / 1000).toFixed(4),
    miningPerMin: (income * 60).toFixed(3),
    name: getBuildingNameByRank(getRankByTemplateId(+selectedItem.template_id)),
    profitability: templateConfigData?.profitability,
    class: templateConfigData?.rank
  }
}


export const formatTime = (time: number) => {
  return String(time).padStart(2, '0')
}