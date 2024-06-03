import './Inventory.css'
import React, { FC } from 'react'
import { InventoryItemType } from '../types'
import { getInventoryImgByRank, getRankByTemplateId } from '../helpers'

type InventoryItemPropsType = {
  item: InventoryItemType
  type: string
  setSelected: (id: string, type: string) => void
  selectedItems: Array<InventoryItemType>
}

const InventoryItem: FC<InventoryItemPropsType> = ({ item, setSelected, type, selectedItems }) => {

  function contains(arr: any, elem : any) {
    return arr.indexOf(elem) != -1;
  }

  return (

    <div
      key={`inventory ${item.id}`}
      className={
        contains(selectedItems, item) ? 'inventory-item selected' : 'inventory-item'
      }
      onClick={() => {
        setSelected(item.id, type)
      }}
    >
      <img className='inventory-item-img' src={getInventoryImgByRank(getRankByTemplateId(item.template_id))} />
    </div>
  )
}

export default InventoryItem
