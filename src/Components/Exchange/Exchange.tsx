import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '../../redux/store'
import { BalanceEnum, BalanceType, ExchangeTypeEnum } from '../../redux/types'
import { moneyDepositWithdrawThunk } from '../../redux/user/exchangeThunk'
import './Exchange.css'
import MoneyPng from '../../img/money.png'
import depositIconImg from '../../img/exchange/deposit-header.png'
import withdrawIconImg from '../../img/exchange/withdraw-header.png'
import availableTextImg from '../../img/exchange/available.png'
import submitBtnImg from '../../img/exchange/submit-btn.png'
import sectionBgImg from '../../img/exchange/secion-bg.png'
import tokenBgImg from '../../img/exchange/token-bg.png'
import feeBgImg from '../../img/exchange/fee.png'
import modalBgImg from '../../img/common/modal-bg.png'
import closeBtnImg from '../../img/common/close-btn.png'

type ExchangePropsType = {
  active: boolean
  setActive: (isActive: boolean) => void
}

const Exchange: FC<ExchangePropsType> = ({ active, setActive }) => {
  const [tokens, setTokens] = useState({
    money: 0,
  })
  const [exchangeType, setExchangeType] = useState('deposit')
  const dispatch = useDispatch()

  const userBalance = useSelector((state: RootState) => state.user.userBalance)
  const gameBalance = useSelector((state: RootState) => state.user.gameBalance)
  const globalStatistic = useSelector((state: RootState) => state.user.globalStatistic)

  useEffect(() => {
    if (!active) {
      setExchangeType('deposit')
    }
  }, [active])

  const changeExchangeType = (type: string) => {
    if (exchangeType !== type) {
      setExchangeType(type)
      setTokens({
        money: 0,
      })
    }
  }

  const isExchangeType = (type: string) => exchangeType === type

  const tokenHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.currentTarget.value)
    const { name } = e.currentTarget

    const balance: BalanceType =
      exchangeType === 'deposit' ? userBalance : gameBalance

    const updatedValue = value > balance[name as BalanceEnum] ? balance[name as BalanceEnum] : value

    setTokens({ ...tokens, [name]: updatedValue < 0 ? 0 : updatedValue })
  }

  const submitExchange = () => {
    isExchangeType('deposit') ? deposit() : withdraw()
    setTokens({
      money: 0,
    })
  }

  const exchangeFormToken = (
    exchangeTypeForBalance: ExchangeTypeEnum,
    balanceType: BalanceEnum
  ) => {
    const balanceToUse = isExchangeType(exchangeTypeForBalance)
      ? userBalance[balanceType]
      : gameBalance[balanceType].toString()

    return balanceToUse
  }

  const deposit = () => {
    // TODO: change gold
    dispatch(moneyDepositWithdrawThunk(tokens as any, ExchangeTypeEnum.deposit))
  }

  const withdraw = () => {
    // TODO: change gold
    dispatch(moneyDepositWithdrawThunk(tokens as any, ExchangeTypeEnum.withdraw))
  }

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
          <img onClick={() => setActive(false)} className='modal-close-btn' src={closeBtnImg} alt='' />
          <span className='modal-title-text'>Exchange</span>

          <img id='exchange-deposit-icon' src={depositIconImg} alt=''
               onClick={() => changeExchangeType('deposit')}
               className={
                 isExchangeType('deposit')
                   ? 'selected'
                   : ''
               } />
          <img id='exchange-withdraw-icon' src={withdrawIconImg} alt=''
               onClick={() => changeExchangeType('withdraw')}
               className={
                 isExchangeType('withdraw')
                   ? 'selected'
                   : ''
               } />
          <img id='section-bg' src={sectionBgImg} alt='' />
          <img id='available-text' src={availableTextImg} alt='' />


          {/*<img id='energy-background-icon' src={tokenBgImg} alt='' />*/}

          {/*<div id='sulfur-block'>*/}
          {/*  <a target='_blank' href=''*/}
          {/*     rel='noreferrer'>*/}
          {/*    <img id='energy-image' className='exchange-token-img' src={EnergyPng} alt='' />*/}
          {/*    <span id='energy-name' className='exchange-token-name'>*/}
          {/*        Energy*/}
          {/*      </span>*/}
          {/*  </a>*/}

          {/*  <span id='energy-token-count' className='exchange-token-count'>*/}
          {/*      {exchangeFormToken(ExchangeTypeEnum.deposit, BalanceEnum.sulf)}*/}
          {/*    </span>*/}
          {/*  <input*/}
          {/*    id='energy-token-input'*/}
          {/*    className='exchange-token-input'*/}
          {/*    type='number'*/}
          {/*    name={BalanceEnum.sulf}*/}
          {/*    value={tokens.sulf}*/}
          {/*    onChange={tokenHandleChange}*/}
          {/*  />*/}
          {/*</div>*/}

          <img id='money-background-icon' src={tokenBgImg} alt='' />
          <div>
            <a target='_blank' href=''
               rel='noreferrer'>
              <img id='money-image' className='exchange-token-img' src={MoneyPng} alt='' />
              <span id='money-name' className='exchange-token-name'>
              Money
            </span>
            </a>

            <span id='money-token-count' className='exchange-token-count'>
              {exchangeFormToken(ExchangeTypeEnum.deposit, BalanceEnum.money)}
            </span>
            <input
              id='money-token-input'
              className='exchange-token-input'
              type='number'
              name={BalanceEnum.money}
              value={tokens.money}
              onChange={tokenHandleChange}
            />
          </div>

          {/*<img id='food-background-icon' src={tokenBgImg} alt='' />*/}
          {/*<div>*/}
          {/*  <a target='_blank' href=''*/}
          {/*     rel='noreferrer'>*/}
          {/*    <img id='food-image' className='exchange-token-img' src={FoodPng} alt='' />*/}
          {/*    <span id='food-name' className='exchange-token-name'>*/}
          {/*        Food*/}
          {/*      </span>*/}
          {/*  </a>*/}

          {/*  <span id='food-token-count' className='exchange-token-count'>*/}
          {/*      {exchangeFormToken(ExchangeTypeEnum.deposit, BalanceEnum.diamond)}*/}
          {/*    </span>*/}
          {/*  <input*/}
          {/*    id='food-token-input'*/}
          {/*    className='exchange-token-input'*/}
          {/*    type='number'*/}
          {/*    name={BalanceEnum.diamond}*/}
          {/*    value={tokens.diamond}*/}
          {/*    onChange={tokenHandleChange}*/}
          {/*  />*/}
          {/*</div>*/}

          {exchangeType === 'withdraw' && (
            <>
              <img id='exchange-fee-bg' src={feeBgImg} alt='' />
              <span id='exchange-withdraw-fee'>
                Fee: {globalStatistic?.withdraw_fee}%
              </span>
            </>
          )}
          <img
            id='exchange-submit'
            src={submitBtnImg}
            alt=''
            onClick={() => submitExchange()}
          />
        </div>
      </div>
    </div>
  )
}

export default Exchange
