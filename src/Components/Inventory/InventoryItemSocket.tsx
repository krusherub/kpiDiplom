import './Inventory.css'
import React, { FC } from 'react'
import socket from '../../img/inventory/scroll-item-bg.png'

type InventoryItemSocketPropsType = {
  left: boolean
}

const InventoryItemSocket: FC<InventoryItemSocketPropsType> = ({ left }) => {
  return (
    <div
      className={'inventory-item'}
    >
  <img className='inventory-item-img' src={socket} />
  </div>
)
}

export default InventoryItemSocket
