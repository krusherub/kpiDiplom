import './Inventory.css'
import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import InventoryItemList from './InventoryItemList'
import { RootState } from '../../redux/store'
import { getStakedListThunk, getUnStakedListThunk, stakeThunk, unStakeThunk } from '../../redux/user/inventoryThunk'
import { InventoryItemType } from '../types'
import stakeImg from '../../img/inventory/stake-btn.png'
import unstakeImg from '../../img/inventory/unstake-btn.png'
import inventoryItemsBackground from '../../img/inventory/scroll-bg.png'
import toolsTextImg from '../../img/inventory/tools-header.png'
import availableTextImg from '../../img/inventory/available-header.png'
import membershipTextImg from '../../img/inventory/utilities-header.png'
import { MessageEnum } from '../../redux/types'
import { setMessage } from '../../redux/user/userSlice'
import modalBgImg from '../../img/common/modal-bg.png'
import closeBtnImg from '../../img/common/close-btn.png'
import { sortBy } from 'lodash'


type InventoryPropsType = {
  active: boolean
  setActive: (isActive: boolean) => void
}

const Inventory: FC<InventoryPropsType> = ({ active, setActive }) => {
  const dispatch = useDispatch()
  const [inventoryType, setInventoryType] = useState('tools')
  const stakedList = useSelector((state: RootState) => state.user.stakedList)
  const unStakedList = useSelector((state: RootState) => state.user.unStakedList)
  const [selectedStakedItems, changeSelectedStakedItem] = useState<Array<InventoryItemType> >([])
  const [selectedUnStakedItems, changeSelectedUnStakedItem] = useState<Array<InventoryItemType>>([])

  const updateInventory = () => {
    dispatch(getUnStakedListThunk())
    dispatch(getStakedListThunk())
  }

  function contains(arr: any, elem : any) {
    return arr.indexOf(elem) != -1;
  }

  const setSelected = (id: string, type: string) => {
    if (type === 'staked') {
      const itemToSelect = stakedList.find(item => item.id === id) || null
      if (!itemToSelect) {
        return
      }
      if (contains(selectedStakedItems, itemToSelect)) {
        let newArr = selectedStakedItems.filter(el => el.id != itemToSelect?.id);
        changeSelectedStakedItem(newArr)
      }
      else {
        const newArray = [...selectedStakedItems, itemToSelect]
        changeSelectedStakedItem(newArray)
      }
    } else {
      const itemToSelect = unStakedList.find(item => item.id === id) || null
      if (!itemToSelect) {
        return
      }
      if (contains(selectedUnStakedItems, itemToSelect)) {
        let newArr = selectedUnStakedItems.filter(el => el.id != itemToSelect?.id);
        changeSelectedUnStakedItem(newArr)
      }
      else {
        const newArray = [...selectedUnStakedItems, itemToSelect]
        changeSelectedUnStakedItem(newArray)
      }
    }
  }

  useEffect(() => {
    updateInventory()
  }, [active])


  return (
    <div
      className={active ? 'modal-wrapper active' : 'modal-wrapper'}
    >
      <div
        className={active ? 'modal-container active' : 'modal-container'}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className='custom-modal-content'>
          <img className='modal-background' src={modalBgImg} alt='' />
          <img onClick={() => {
            setActive(false);
          }} className='modal-close-btn' src={closeBtnImg} alt='' />
          <span className='modal-title-text'>Inventory</span>
          <img id='inventory-items-stacked-background' src={inventoryItemsBackground} alt='' />
          <img id='inventory-items-unstacked-background' src={inventoryItemsBackground} alt='' />
          <img id='inventory-tools-icon' className={inventoryType === 'tools' ? 'selected' : ''} src={toolsTextImg}
               alt='' onClick={() => setInventoryType('tools')} />
          {/*<img id='inventory-membership-icon' className={inventoryType === 'membership' ? 'selected' : ''}
               src={membershipTextImg} alt='' onClick={() => setInventoryType('membership')} />  update*/}
          <img id='inventory-available-icon' src={availableTextImg} alt='' />

          <InventoryItemList
            setSelected={setSelected}
            type='staked'
            items={sortBy(stakedList.filter(sl => sl.mineable === (inventoryType === 'tools')), 'rank').reverse()}
            selectedItems={selectedStakedItems}
          />
          <InventoryItemList
            setSelected={setSelected}
            type='unstaked'
            items={sortBy(unStakedList.filter(item => item.type !== 'scroll' && item.type !== 'bag' && item.type !== 'territory'), 'rank').reverse()}
            selectedItems={selectedUnStakedItems}
          />
          <div className='unstake-button-container' style={window.innerHeight < 370 ? { bottom: '5%' } : {}}>
            <img
              src={unstakeImg}
              style={{ ...(!selectedStakedItems.length && { pointerEvents: 'none' }) }}
              onClick={() => {
                dispatch(unStakeThunk(selectedStakedItems))
                changeSelectedStakedItem([])
              }}
              className='inventory-button unstake-button'
            />
          </div>
          <div className='stake-button-container' style={window.innerHeight < 370 ? { bottom: '5%' } : {}}>
            <img
              src={stakeImg}
              style={{ ...(!selectedUnStakedItems.length && { pointerEvents: 'none' }) }}
              onClick={() => {
                dispatch(stakeThunk(selectedUnStakedItems))
                changeSelectedUnStakedItem([])
              }}
              className='inventory-button stake-button'
            />
          </div>
        </div>
      </div>
    </div>


  // return (
  //   <div
  //     className={active ? 'modal-wrapper active' : 'modal-wrapper'}
  //     onClick={() => setActive(false)}
  //   >
  //     <div
  //       className={
  //         active
  //           ? 'modal-inventory-container active'
  //           : 'modal-inventory-container'
  //       }
  //       onClick={(e) => e.stopPropagation()}
  //     >
  //       <div className='inventory-main-container'>
  //         <img id='inventory-background' src={exchangeBackgroundImg} alt='' />
  //         <img id='inventory-close' onClick={() => setActive(false)} src={exchangeCloseImg} alt='' />
  //         <img id='inventory-header' src={inventoryImg} alt='' />

  //         </div>
  //       </div>
  //     </div>
  //   </div>
  )
}

export default Inventory
