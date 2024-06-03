import React, { useState } from 'react'
import { BalanceEnum, BalanceType } from '../../redux/types'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import MoneyPng from '../../img/money.png'
import multiplierBg from '../../img/bank/multiplier-bg.png'
import Depositbtn from '../../img/bank/depositbtn.png'
import VerticalDivider from '../../img/bank/vertical-devider.png'
import { BankInThunk } from '../../redux/user/bankThunk'

const BankDeposit = () => {
  const gameBalance = useSelector((state: RootState) => state.user.gameBalance)

  const [tokens, setTokens] = useState({
    money: 0
  });

  const tokenHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.currentTarget.value)
    const { name } = e.currentTarget
    const balance: BalanceType = gameBalance

    const updatedValue = value > balance[name as BalanceEnum] ? balance[name as BalanceEnum] : value

    setTokens({ ...tokens, [name]: updatedValue < 0 ? 0 : updatedValue })
  }

  const [currentMultiplayer, setCurrentMultiplayer] = useState(1)
  const [currentDays, setCurrentDays] = useState('')
  const dispatch = useDispatch()
  return (
    <React.Fragment>
      <span id='bank-deposit-title'>
        Amount to deposit
      </span>
      <input
        id='bank-tokens-input'
        type='number'
        name={BalanceEnum.money}
        value={tokens.money}
        onChange={tokenHandleChange}
      />
      <img id='bank-deposit-money-png' src={MoneyPng} alt='' />

      <img id='bank-deposit-vertical-divider-1' src={VerticalDivider} alt='' />
      <img id='bank-deposit-vertical-divider-2' src={VerticalDivider} alt='' />
      <div className='bank-deposit-select-container'>
        <span id='bank-deposit-label'>Lock time</span>
        <select style={{fontSize: '1.6vw'}} className='bank-deposit-select-input' defaultValue={'0 days'}
                onChange={(e) =>  {
                  const days = Number.parseInt(e.target.value)
                  setCurrentDays(e.target.value)
                  switch(days) {
                    case 0: setCurrentMultiplayer(1); break
                    case 7: setCurrentMultiplayer(1.15) ; break
                    case 15: setCurrentMultiplayer(1.7) ; break
                    case 30: setCurrentMultiplayer(2.5) ; break
                    case 60: setCurrentMultiplayer(5.1) ; break
                    case 90: setCurrentMultiplayer(8) ; break
                    case 180: setCurrentMultiplayer(18) ; break
                  }
                }} aria-label='Default select example'>
          {['0 days', '7 days', '15 days', '30 days', '60 days', '90 days', '180 days'].map((item) => (
            <option style={{ color: '#000000' }} key={item}
                    value={item}>{item}</option>
          ))}
        </select>
      </div>

      <img id='bank-deposit-multiplier-bg' src={multiplierBg} alt='' />
      <span id='bank-deposit-multiplier-text'>Multiplier</span>
      <span id='bank-deposit-multiplier-count'>{currentMultiplayer}x</span>
      <img id='bank-deposit-btn' src={Depositbtn} onClick={() => dispatch(BankInThunk(tokens.money, currentDays))} alt='' />
    </React.Fragment>
  )
}

export default BankDeposit