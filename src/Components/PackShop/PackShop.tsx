import React, { FC, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './PackShop.css'
import { useDispatch, useSelector } from 'react-redux'
import { BalanceType } from '../../redux/types'
import modalBgImg from '../../img/common/modal-bg.png'
import closeBtnImg from '../../img/common/close-btn.png'
import packBgImg from '../../img/packshop/pack-bg.png'
import chancesBgImg from '../../img/packshop/chances-bg.png'
import dividerImg from '../../img/packshop/divider.png'
import itemBgImg from '../../img/packshop/pack-item-bg.png'
import priceImg from '../../img/packshop/pack-price-bg.png'
import buyBtnImg from '../../img/packshop/claim-btn.png'
import infoImg from '../../img/common/info-icon.png'
import packImg from '../../img/packshop/pack-img.png'
import { GlobalStatisticType } from '../types'
import { RootState } from '../../redux/store'
import { getBuildingNameByRank, getInventoryImgByRank } from '../helpers'
import { buyPackThunk } from '../../redux/user/shopThunk'
import { statisticThunk } from '../../redux/user/statisticThunk'


type CraftPropsType = {
  active: boolean,
  setActive: (isActive: boolean) => void
}

export const calculatePackPriceByIndex = (startRank: any, templatesData: any, globalStatistic: GlobalStatisticType) => {
  let price = 0
  let indexer = 0

  for(let i = startRank; i < startRank + 7; i+=3, indexer++){
    const templateConfigData = templatesData.find((item: any) => +item.rank === i);

    const income = (templateConfigData?.profitability / globalStatistic?.total_profitability)
      * Number.parseFloat(globalStatistic?.token_creation_s);
    const dayIncome = income * 60 * 60 * 24;
    let constant = 1.15
    price += templateConfigData.price_var * dayIncome * constant * (globalStatistic?.pack_chances[indexer] / 100)
  }

  return price * ((100 - globalStatistic?.pack_discount) / 100)
}

export const checkUserHaveMoney = (price: number, gameBalance: number) => {
  return gameBalance > price;
}

export const getPackInfo = (templatesData: any, globalStatistic: any) => {
  let pack_price = 0
  let rank_start = 1
  for (let i = 1; i < globalStatistic?.ranks_available - 6; i++) {
    if (pack_price > globalStatistic?.minimal_price) {
      break;
    }
    pack_price = calculatePackPriceByIndex(i, templatesData, globalStatistic)
    rank_start = i
  }
  return {pack_price, rank_start}
}

const PackShop: FC<CraftPropsType> = ({ active, setActive }) => {
  const dispatch = useDispatch()
  const globalStatistic = useSelector((state: RootState) => state.user.globalStatistic)
  const templatesData = useSelector((state: RootState) => state.user.templates)
  const gameBalance = useSelector((state: RootState) => state.user.gameBalance)

  const [packInfo, setPackInfo] = useState({} as any)

  useEffect(() => {
    setPackInfo(getPackInfo(templatesData, globalStatistic))
  }, [globalStatistic, templatesData])

  useEffect(() => {
    dispatch(statisticThunk())
  }, [active])
  // const isUserHaveTokens = (balance: BalanceType) => {
  //   let counter = 0
  //   const craftDiscount = 1 - discounts.craft - (isUserPassHolder ? 0.05 : 0)
  //
  //   Object.keys(balance).forEach((key) => {
  //     if ((gameBalance[key as BalanceEnum] >= (balance[key as BalanceEnum] * craftDiscount)) && balance[key as BalanceEnum]) {
  //       counter += 1
  //     }
  //   })
  //   return counter === 2
  // }
  return (
    <div
      className={active ? 'modal-wrapper active' : 'modal-wrapper'}
      onClick={() => setActive(false)}
    >
      <div
        className={active ? 'modal-container active' : 'modal-container'}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='custom-modal-content'>
          <img className='modal-background' src={modalBgImg} alt='' />
          <img className='modal-close-btn' src={closeBtnImg} alt='' onClick={() => setActive(false)}/>
          <span className='modal-title-text'>Pack shop</span>
          <img id='pack-item-bg' src={packBgImg} alt='' />
          <img id='chances-bg' src={chancesBgImg} alt='' />
          <img id='token-price-bg' src={priceImg} alt='' />
          <img id='pack-img' src={packImg} alt='' />
          <img
            style={{...(!checkUserHaveMoney(+packInfo?.pack_price, +gameBalance.money) && { opacity: '0.5', pointerEvents: 'none' })}}
            id='pack-buy-btn'
            src={buyBtnImg}
            onClick={() => {dispatch(buyPackThunk(`${Number(packInfo?.pack_price).toFixed(4)} MWM`))}}
            alt=''
          />
          <span id='buy-pack-text'>
            Buy pack
          </span>
          <span id='pack-price-text'>
            {(packInfo?.pack_price?.toFixed(3))}
          </span>
          <span id='pack-first-item-name'>
            {getBuildingNameByRank(packInfo?.rank_start)}
          </span>
          <img id='pack-first-item-bg' src={getInventoryImgByRank(packInfo?.rank_start)} alt='' />
          <span id='pack-second-item-name'>
            {getBuildingNameByRank(packInfo?.rank_start + 3)}
          </span>
          <img id='pack-second-item-bg' src={getInventoryImgByRank(packInfo?.rank_start+3)} alt='' />
          <span id='pack-third-item-name' style={packInfo?.rank_start === 2 ? {top: '24%'} : {}}>
            {getBuildingNameByRank(packInfo?.rank_start + 6)}
          </span>
          <img id='pack-third-item-bg' src={getInventoryImgByRank(packInfo?.rank_start+6)} alt='' />

          <span id='pack-first-item-class'>
            Class: {packInfo?.rank_start}
          </span>
          <span id='pack-second-item-class'>
            Class: {packInfo?.rank_start + 3}
          </span>
          <span id='pack-third-item-class'>
            Class: {packInfo?.rank_start + 6}
          </span>

          <img id='pack-text-divider' src={dividerImg} alt='' />

          <span id='pack-first-item-chance'>
            Chance: {globalStatistic?.pack_chances[0]}%
          </span>
          <span id='pack-second-item-chance'>
            Chance: {globalStatistic?.pack_chances[1]}%
          </span>
          <span id='pack-third-item-chance'>
            Chance: {globalStatistic?.pack_chances[2]}%
          </span>

          <span id='pack-info-text'>
            Pack price dynamically changes
          </span>
          <img id='pack-info-img' src={infoImg} alt='' />
        </div>
      </div>
    </div>
  )
}

export default PackShop

