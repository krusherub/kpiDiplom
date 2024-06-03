import React, { FC, useEffect, useState } from 'react'
import './Main.css'
import { useDispatch, useSelector } from 'react-redux'
import Exchange from '../Exchange/Exchange'
import Inventory from '../Inventory/Inventory'
import PackShop from '../PackShop/PackShop'
import { RootState } from '../../redux/store'
import { updateGameBalanceThunk, updateUserBalanceThunk } from '../../redux/user/balanceThunk'
import Mine from '../Mine/Mine'
import cityImg from '../../img/main/city-btn.png'
import inventoryImg from '../../img/main/inventory-btn.png'
import craftImg from '../../img/main/craft-btn.png'
import exchangeImg from '../../img/main/exchange-btn.png'
import bankImg from '../../img/main/bank-btn.png'
import bottomMenuBgPng from '../../img/main/bottom-menu-bg.png'
import profileBgPng from '../../img/main/profile-bg.png'
import logOutBtnPng from '../../img/main/logout-btn.png'
import moneyTokenPng from '../../img/main/money-token.png'
import goldTokenPng from '../../img/main/gold-token.png'
import profitBgPng from '../../img/main/profit-block.png'
import statisticBgPng from '../../img/main/statistic-block.png'
import Statistics from '../Statistics/Statistics'
import sample from '../../img/common/test.mp4';
import addRefBtnPng from '../../img/add-ref.png';
import { statisticThunk } from '../../redux/user/statisticThunk'
import Bank from '../Bank/Bank'

type MainPropsType = {}

const Main: FC<MainPropsType> = () => {
  const [exchangeActive, setExchangeActive] = useState(false)
  const [inventoryActive, setInventoryActive] = useState(false)
  const [mineActive, setMineActive] = useState(false)
  const [statisticsActive, setStatisticsActive] = useState(false)
  const [craftActive, setCraftActive] = useState(false)
  const [bankActive, setBankActive] = useState(false)
  const dispatch = useDispatch()

  const [showCopiedLink, changeCopiedLinkShowed] = useState(false)
  const gameBalance = useSelector((state: RootState) => state.user.gameBalance)
  const userData = useSelector((state: RootState) => state.user.userData)
  const stakedList = useSelector((state: RootState) => state.user.stakedList)
  const unStakedList = useSelector((state: RootState) => state.user.unStakedList)

  const exchangeShow = () => {
    dispatch(updateUserBalanceThunk())
    setExchangeActive(true)
  }

  useEffect(() => {
    dispatch(updateUserBalanceThunk())
    dispatch(updateGameBalanceThunk())
    dispatch(statisticThunk())
    // dispatch(checkRiskyDangerousError())
  }, [userData?.accountName])

  let discountIndex = 0

  return (
    <div className='main-container'>
      {/*<video className='videoTag' autoPlay loop muted>*/}
      {/*  <source src={sample} type='video/mp4' />*/}
      {/*</video>*/}
      {/*<ReferralUserModal />*/}
      <div className='main-header-container'>
        <img id='main-avatar-bg' className='main-block-bg' src={profileBgPng} alt='' />

        <span id='main-account-name'>
          {userData.accountName}
        </span>
        <img onClick={() => {
          window.location.reload();
        }} id='main-logout-img' src={logOutBtnPng} alt='logout' />

        <img className='profit-block-bg' src={profitBgPng} alt='' />
        <span className='profit-block-text'>My Profitability:</span>
        <span className='profit-block-count'>{userData?.profitability}</span>

        <img
          onClick={async () => {
            const refString = window.location.origin + `?ref=${userData.accountName}`
            await navigator.clipboard.writeText(refString)
            changeCopiedLinkShowed(true)
            setTimeout(() => {
              changeCopiedLinkShowed(false)
            }, 1500)
          }}
          id='main-add-ref-btn-img'
          src={addRefBtnPng}
          alt='' />
        {showCopiedLink ? (
          <span id='main-link-copied'>
            Link copied to the clipboard
          </span>
        ) : null}

        {/*<img id='main-energy-bg' className='main-block-bg' src={energyTokenPng} alt='' />*/}
        <img id='main-money-bg' className='main-block-bg' src={moneyTokenPng} alt='' />
        <img id='main-gold-bg' className='main-block-bg' src={goldTokenPng} alt='' />


        {/*<span id='main-token-energy-count' className='main-token-count'>*/}
        {/*  {!gameBalance.sulf ? 165489.16 : 0}*/}
        {/*</span>*/}
        <span id='main-token-money-count' className='main-token-count'>
          {gameBalance.money}
        </span>
        <span id='main-token-gold-count' className='main-token-count'>
          {gameBalance?.gold ?? 0}
        </span>


        <img onClick={() => setStatisticsActive(true)} className='statistic-bg' src={statisticBgPng} alt='' />

      </div>

      <div className='main-controls-container'>
        <Exchange active={exchangeActive} setActive={setExchangeActive} />
        <Inventory active={inventoryActive} setActive={setInventoryActive} />
        <PackShop active={craftActive} setActive={setCraftActive} />
        <Mine active={mineActive} setActive={setMineActive} />
        <Statistics active={statisticsActive} setActive={setStatisticsActive}/>
        <Bank active={bankActive} setActive={setBankActive}/>
        <img id='controls-container' src={bottomMenuBgPng} alt='' />
      {/*  <img id='main-plus-token' onClick={() => {*/}
      {/*    setLandsActive(true)*/}
      {/*  }} src={addButtonPng} alt='' />*/}
      {/*  <img*/}
      {/*    className='controls-container-button'*/}
      {/*    onClick={() => setShopActive(true)}*/}
      {/*    id='controls-container-button-shop'*/}
      {/*    src={shopPng}*/}
      {/*    alt=''*/}
      {/*  />*/}
      {/*  <img*/}
      {/*    onClick={() => setShopActive(true)}*/}
      {/*    id='controls-container-button-text-shop'*/}
      {/*    src={shopTextPng}*/}
      {/*    alt=''*/}
      {/*  />*/}
        <img
          src={cityImg}
          style={{...(!stakedList.length && {pointerEvents: 'none', opacity: '0.5'})}}
          className='controls-container-button'
          id='controls-container-button-city'
          alt=''
          onClick={() => setMineActive(true)}
        />
        <img
          src={inventoryImg}
          className='controls-container-button'
          id='controls-container-button-inventory'
          alt=''
          onClick={() => setInventoryActive(true)}
        />
        <img
          src={craftImg}
          className='controls-container-button'
          id='controls-container-button-craft'
          alt=''
          onClick={() => setCraftActive(true)}
        />
        <img
          src={exchangeImg}
          className='controls-container-button'
          id='controls-container-button-exchange'
          alt=''
          onClick={() => exchangeShow()}
        />
        <img
          src={bankImg}
          className='controls-container-button'
          id='controls-container-button-bank'
          alt=''
          onClick={() => setBankActive(true)}
        />
      {/*  <img*/}
      {/*    className='controls-container-button'*/}
      {/*    alt=''*/}
      {/*    onClick={() => {*/}
      {/*      setBlendActive(true)*/}
      {/*    }}*/}
      {/*    src={blendIconPng}*/}
      {/*    id='controls-container-button-blend'*/}
      {/*  />*/}
      {/*  <img*/}
      {/*    src={blendTextPng}*/}
      {/*    id='controls-container-button-text-blend'*/}
      {/*    alt='' />*/}
      {/*  <img*/}
      {/*    alt=''*/}
      {/*    className='controls-container-button'*/}
      {/*    onClick={() => {*/}
      {/*      setExpeditionActive(true)*/}
      {/*    }}*/}
      {/*    style={{*/}
      {/*      ...(!stakedList.find(item => item.template_id === data.inventoryTrolley) && {*/}
      {/*        pointerEvents: 'none',*/}
      {/*        opacity: '0.7'*/}
      {/*      })*/}
      {/*    }}*/}
      {/*    src={expIconPng}*/}
      {/*    id='controls-container-button-expedition'*/}
      {/*  />*/}
      {/*  <img*/}
      {/*    src={expTextPng}*/}
      {/*    id='controls-container-button-text-expedition'*/}
      {/*    alt='' />*/}
      {/*  <img*/}
      {/*    style={{ pointerEvents: 'none', opacity: '0.7' }}*/}
      {/*    src={newsIconPng}*/}
      {/*    alt=''*/}
      {/*    id='controls-container-button-news'*/}
      {/*  />*/}
      {/*  <img*/}
      {/*    src={newsTextPng}*/}
      {/*    id='controls-container-button-text-news'*/}
      {/*    alt='' />*/}

      {/*  <img*/}
      {/*    className='controls-container-button'*/}
      {/*    id='controls-container-button-bonuses'*/}
      {/*    onClick={() => setBonusesActive(true)}*/}
      {/*    src={bonusesIconPng}*/}
      {/*    alt=''*/}
      {/*  />*/}
      {/*  <img*/}
      {/*    id='controls-container-button-text-bonuses'*/}
      {/*    src={bonusesTextPng}*/}
      {/*    alt=''*/}
      {/*  />*/}

      {/*  <a target='_blank' href='https://discord.gg/8wcPMU6rQN' rel='noreferrer'>*/}
      {/*    <img id='main-contact-img'*/}
      {/*         className='controls-container-button' src={contactIconPng} alt='' />*/}
      {/*    <img id='main-contact-text-img' src={contactTextPng} alt='' />*/}
      {/*  </a>*/}

      </div>
    </div>
  )
}

export default Main
