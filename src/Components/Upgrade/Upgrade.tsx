import React, { FC, useState } from 'react'

import './Upgrade.css'
import modalBgImg from '../../img/common/modal-bg.png'
import closeBtnImg from '../../img/common/close-btn.png'
import upgradeBgImg from '../../img/upgrade/bg.png'
import dangerousBtnImg from '../../img/upgrade/dangerous-btn.png'
import upgradeBtnImg from '../../img/upgrade/upgrade-btn.png'
import exampleImg from '../../img/upgrade/example.png'
import profitabilityBgImg from '../../img/upgrade/profitability-bg.png'
import { GlobalStatisticType, InventoryItemType } from '../types'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { getBuildingNameByRank, getInventoryImgByRank, getRankByTemplateId } from '../helpers'
import { upgradeThunk } from '../../redux/user/mineThunk'
import { checkUserHaveMoney } from '../PackShop/PackShop'
import DangerousConfirm from '../DangerousConfirm/DangerousConfirm'

type MinePropsType = {
  active: boolean
  selectedItem: InventoryItemType
  setActive: (isActive: boolean) => void
}

export const getUpgradePrice = (templateConfigData: any, selectedItem: InventoryItemType, globalStatistic: GlobalStatisticType) => {
  if (!selectedItem?.template_id || !globalStatistic?.total_profitability) {
    return '';
  }

  const income = (templateConfigData.profitability / globalStatistic.total_profitability)
    * Number.parseFloat(globalStatistic.token_creation_s);

  const miningPerDay = income * 60 * 24 * 60;

  const costToCover = miningPerDay * Number(templateConfigData.price_var);

  let totalPrice = 0

  if (templateConfigData.rank % 3 === 0) {
    totalPrice = costToCover / 1.6 * ((100 - globalStatistic.upgrade_discount) / 100)
  } else {
    totalPrice = costToCover / 2 * ((100 - globalStatistic.upgrade_discount) / 100)
  }

  totalPrice = (totalPrice - (totalPrice * 0.1 * getRankByTemplateId(selectedItem?.template_id) / globalStatistic?.ranks_available))

  return totalPrice.toFixed(2)
}

function getTimeFromMinutes(minutes: number) {
  const time = minutes;
  const hours = Math.trunc(time/(60 * 60));
  const countedMinutes = time % (60 * 60) / 60;
  return String(hours).padStart(2, '0') + ':' + String(countedMinutes).padStart(2, '0');
}

const Upgrade: FC<MinePropsType> = ({ active, setActive, selectedItem }) => {
  const templates = useSelector((state: RootState) => state.user.templates)
  const selectedTemplate = templates.find(item => +item?.template_id === +selectedItem?.template_id)
  const globalStatistic = useSelector((state: RootState) => state.user.globalStatistic)
  const gameBalance = useSelector((state: RootState) => state.user.gameBalance)
  const dispatch = useDispatch()
  const upgradePrice = getUpgradePrice(selectedTemplate, selectedItem, globalStatistic as GlobalStatisticType)
  const [isDangerousOpen, setDangerousIsOpen] = useState(false);

  return (
    <div
      className={active ? 'modal-wrapper active' : 'modal-wrapper'}
      onClick={() => {
        setActive(false)
      }}
    >
      <DangerousConfirm active={isDangerousOpen} setActive={setDangerousIsOpen} selected_item={selectedItem} selected_template={selectedTemplate} setActiveUpgrade={setActive}/>
      <div
        className={active ? 'modal-container active' : 'modal-container'}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='custom-modal-content'>
          <img className='modal-background' src={modalBgImg} alt='' />
          <img onClick={() => setActive(false)} className='modal-close-btn' src={closeBtnImg} alt='' />
          <span className='modal-title-text'>Upgrade</span>

          <img
            id="upgrade-left-bg"
            src={upgradeBgImg}
            alt=''
          />

          <span id="upgrade-to-text">Upgrade to {getBuildingNameByRank(getRankByTemplateId((selectedTemplate as any)?.upgrade_template_id))}</span>
          <span id="upgrade-price-count">{upgradePrice} MWM</span>
          <span id="upgrade-time-count">{getTimeFromMinutes(selectedTemplate?.upgrade_time || 0)}:00</span>
          <span id="upgrade-percent">{selectedTemplate?.chance_to_success_upgrade_risk} %</span>

          <img
            onClick={() => {
              dispatch(upgradeThunk(selectedItem.id, `${Number(upgradePrice).toFixed(4)} MWM`, setActive))
            }}
            style={{...(!checkUserHaveMoney(+upgradePrice, +gameBalance.money) && { opacity: '0.5', pointerEvents: 'none' })}}
            className='mine-buttons'
            id="upgrade-btn-img"
            src={upgradeBtnImg}
            alt=''
          />
          <img
            // style={{ opacity: '0.5', pointerEvents: 'none' }}
            className='mine-buttons'
            id="dangerous-btn-img"
            src={dangerousBtnImg}
            onClick={() => {setDangerousIsOpen(true)}}
            alt=''
          />

          <img id="upgrade-img-block" src={getInventoryImgByRank(getRankByTemplateId(selectedTemplate?.upgrade_template_id))} alt='' />

          <img id="upgrade-profitability-bg" src={profitabilityBgImg} alt='' />
          <span id="upgrade-img-name">{getBuildingNameByRank(getRankByTemplateId((selectedTemplate as any)?.upgrade_template_id))}</span>
          <span id="upgrade-profitability-text">Profitability</span>
          <span id="upgrade-profitability-count">{templates.find(item => item.template_id === (selectedTemplate as any)?.upgrade_template_id)?.profitability}</span>

        </div>
      </div>
    </div>
  )
}

export default Upgrade