import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'

import { useTimer } from 'react-timer-hook'

import { GlobalStatisticType, InventoryItemType, TemplateType } from '../types'

import 'bootstrap/dist/css/bootstrap.min.css'
import './Mine.css'
import MoneyPng from '../../img/money.png'
import ClaimAllBtnPng from '../../img/mine/claim-all-btn.png'
import { BalanceEnum, BalanceType } from '../../redux/types'
import mineSecondBgPng from '../../img/mine/selected-item-pr-bg.png'
import mineItemBgImg from '../../img/mine/item-bg.png'
import upgradeItemBgImg from '../../img/mine/upgrade-bg.png'
import selectBgImg from '../../img/mine/select-bg.png'
import claimGreenBtn from '../../img/mine/claim-green.png'
import claimUpgradeGreenBtn from '../../img/mine/claim-green.png'
import claimAll from '../../img/mine/claim-all-btn.png'
import claimLockedBtn from '../../img/mine/claim-locked.png'
import upgradeBtn from '../../img/mine/upgrade-btn.png'
import infoBgImg from '../../img/mine/info-bg.png'
import textDividerImg from '../../img/mine/text-divider.png'
import modalBgImg from '../../img/common/modal-bg.png'
import closeBtnImg from '../../img/common/close-btn.png'
import { getBuildingNameByRank, getInventoryImgByRank, getRankByTemplateId } from '../helpers'
import Upgrade from '../Upgrade/Upgrade'
import { formatTime, getItemMineData } from './helpers'
import { claimThunk, upgradeClaimThunk } from '../../redux/user/mineThunk'
import configData from '../../data.json'
import Section from './Section'
import { claimAllThunk } from '../../redux/user/mineAllThunk'

type MinePropsType = {
  active: boolean
  setActive: (isActive: boolean) => void
}

export const calculateRepairCost = (template: TemplateType | undefined, selectedItem: any) => {
  if (!template || !selectedItem) {
    return
  }
  let newRepairCost: any =
    {
      money: (template.repair_cost.money / template.init_durability) * (template.init_durability - selectedItem.durability)
    }
  return newRepairCost
}

export const isUserHaveTokens = (balance: BalanceType, gameBalance: BalanceType) => {
  let counter = 0
  Object.keys(balance).forEach((key) => {
    if ((gameBalance[key as BalanceEnum] >= balance[key as BalanceEnum]) && balance[key as BalanceEnum]) {
      counter += 1
    }
  })
  return counter === 2
}

const Mine: FC<MinePropsType> = ({ active, setActive }) => {
  const stakedList = useSelector((state: RootState) => state.user.stakedList)
  const templates = useSelector((state: RootState) => state.user.templates)
  const globalStatistic = useSelector((state: RootState) => state.user.globalStatistic)
  const [timer, updateTimer] = useState(0)
  const dispatch = useDispatch()
  const [isUpgradeOpen, updateIsOpen] = useState(false);

  const [selectedItem, changeSelectedItem] = useState<InventoryItemType | null>(
    null
  )

  const selectStakedItemAndRestartItsTimer = (selectedId?: string): void => {
    const newList = stakedList.filter(item => item.mineable)
    const selected =
      newList.find((item) => item.id === selectedId) || newList[0]

    changeSelectedItem(selected)
  }

  const {
    seconds,
    minutes,
    hours,
    restart
  } = useTimer({
    expiryTimestamp: selectedItem?.available_claim_update || new Date()
  })

  useEffect(() => {
    restart(selectedItem?.available_claim_update || new Date())
  }, [selectedItem, isUpgradeOpen, stakedList])

  useEffect(() => {
    const timeout = setInterval(() => {
      updateTimer((prev) => prev + 1)
    }, 5000)
    return () => {
      clearInterval(timeout)
    }
  }, [active])

  useEffect(() => {
    selectStakedItemAndRestartItsTimer(selectedItem?.id)
  }, [stakedList])

  const setSelected = (id: string) => {
    if (stakedList.length) {
      selectStakedItemAndRestartItsTimer(id)
    }
  }

  useEffect(() => {
    if (!stakedList.filter(listItem => listItem.mineable)?.length) {
      setActive(false)
    }
  }, [stakedList])

  const mineItemData = getItemMineData(templates, selectedItem as InventoryItemType, globalStatistic as GlobalStatisticType);

  return (
    <div
      className={active ? 'modal-wrapper active' : 'modal-wrapper'}
      onClick={() => {
        setActive(false)
      }}
    >
      <Upgrade
        selectedItem={selectedItem as InventoryItemType}
        setActive={updateIsOpen}
        active={isUpgradeOpen}
      />
      <div
        className={active ? 'modal-container active' : 'modal-container'}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='custom-modal-content'>
          <Section
            selectedItem={selectedItem}
            setSelected={setSelected}
          />

          <img className='modal-background' src={modalBgImg} alt='' />
          <img onClick={() => setActive(false)} className='modal-close-btn' src={closeBtnImg} alt='' />
          <span className='modal-title-text'>City</span>

          <img id='mine-second-block-bg-img' src={mineSecondBgPng} alt='' />
          <img id='mine-select-bg' src={selectBgImg} alt='' />
          <span id='mine-select-title-text'>
            Please select
          </span>
          {/*<img id='mine-item-photo-bg' src={photoBgImg} alt='' />*/}

          { selectedItem?.under_upgrade ?
            <>
              <img id='upgrade-item-bg' src={upgradeItemBgImg} alt='' />
              <span id='upgrade-token-name'>
                {getBuildingNameByRank(getRankByTemplateId(selectedItem?.template_id))}
              </span>
              <img id='upgrade-item-photo' src={getInventoryImgByRank(getRankByTemplateId(selectedItem?.template_id))} alt='' />
              <span id='upgrade-text'>
                On upgrade...
              </span>
              <span id='upgrade-timer'>
                {formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}
              </span>
              <img
                style={{...(selectedItem?.available_claim_update >= new Date(Date.now()) && { pointerEvents: 'none' })}}
                id='upgrade-claim'
                onClick={() => {dispatch(upgradeClaimThunk(selectedItem?.id, setActive))}}
                src={selectedItem?.available_claim_update >= new Date(Date.now()) ? claimLockedBtn: claimUpgradeGreenBtn} alt='' />
            </>
            :
            <></>
          }

          { !selectedItem?.under_upgrade ?
            <>
              <img id='mine-item-bg' src={mineItemBgImg} alt='' />
              <img id='mine-item-photo' src={getInventoryImgByRank(getRankByTemplateId(selectedItem?.template_id))} alt='' />

              <img
                onClick={() => {
                  dispatch(claimThunk(selectedItem as InventoryItemType))
                }}
                className='mine-buttons'
                id='mine-claim-btn-green'
                src={claimGreenBtn}
                alt=''
              />

              <span id='mine-token-name'>
                {getBuildingNameByRank(getRankByTemplateId(selectedItem?.template_id))}
              </span>

              <img id='mine-token-info-bg' src={infoBgImg} alt='' />
              <span id='mine-token-info-count'>
                {mineItemData.claimNow}
              </span>
              <img id='mine-token-info-token' src={MoneyPng} alt='' />

              <span className='mine-token-info-text' id='mine-token-info-building'>
                Class
              </span>
              <span className='mine-token-info-text' id='mine-token-info-building-count'>
                {mineItemData.class}
              </span>
                <img className='mine-info-divider' id='mine-info-divider-1' src={textDividerImg} alt='' />

              <span className='mine-token-info-text' id='mine-token-info-durability'>
                Profitability
              </span>
              <span className='mine-token-info-text' id='mine-token-info-durability-count'>
                {mineItemData.profitability}
              </span>
              <img className='mine-info-divider' id='mine-info-divider-2' src={textDividerImg} alt='' />

              <span className='mine-token-info-text' id='mine-token-info-income'>
                Mining per minute
              </span>
              <span className='mine-token-info-text' id='mine-token-info-income-count'>
                {mineItemData.miningPerMin}
              </span>
              <img className='mine-info-divider' id='mine-info-divider-3' src={textDividerImg} alt='' />
              <img
                style={{ opacity: '0.5', pointerEvents: 'none' }}
                onClick={() => {
                  updateIsOpen(true)
                }}
                className='mine-buttons'
                id='mine-upgrade-btn'
                src={upgradeBtn}
                alt=''
              />
            </> : <></> }
          {/*<img
            onClick={() => {
              dispatch(claimAllThunk())
            }}
            className='mine-buttons'
            id='all-claim-btn-green'
            src={claimAll}
            alt=''
          /> update*/}

        </div>
      </div>
    </div>
  )
}

export default Mine