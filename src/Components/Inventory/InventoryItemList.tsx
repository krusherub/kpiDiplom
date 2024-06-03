import './Inventory.css'
import React, { FC } from 'react'
import InventoryItem from './InventoryItem'
import { InventoryItemType } from '../types'
import InventoryItemSocket from './InventoryItemSocket'

type InventoryItemListPropsType = {
  type: string
  items: Array<InventoryItemType>
  setSelected: (id: string, type: string) => void
  selectedItems: Array<InventoryItemType>
}

const InventoryItemList: FC<InventoryItemListPropsType> = ({ type, items, setSelected, selectedItems }) => {
  let sockets = []
  let socketsNumber = items.length % 3 === 0 ? 0 : 3 - (items.length % 3)

  if (items.length + socketsNumber < 9) {
    socketsNumber = 9 - items.length
  }

  for (let i = 0; i < socketsNumber; i++) {
    sockets.push(i)
  }
  
  return (
    <div
      className={
        type === 'staked'
          ? 'inventory-container-list inventory-staked-list'
          : 'inventory-container-list inventory-unstaked-list'
      }
    >
      {
        items.map((item: any) => {
          return (
            <InventoryItem
              item={item}
              selectedItems={selectedItems}
              key={item.id}
              setSelected={setSelected}
              type={type}
            />
          )
        })
      }
      {
        sockets.map((item: any) => {
          return (
            <InventoryItemSocket key={item} left={type === 'staked'} />
          )
        })
      }
    </div>
  )
}

export default InventoryItemList
