import React, { FC, useEffect, useState } from 'react'
import './Bank.css'

import modalBgImg from '../../img/common/modal-bg.png'
import closeBtnImg from '../../img/common/close-btn.png'
import BankBgPng from '../../img/bank/bank-bg.png'
import StatisticsPng from '../../img/bank/statistics-btn.png'
import DepositPng from '../../img/bank/deposit-btn.png'
import TransfersPng from '../../img/bank/transfers-btn.png'
import BankStatistic from './BankStatistic'
import BankDeposit from './BankDeposit'
import BankTransfers from './BankTransfers'
import { statisticThunk } from '../../redux/user/statisticThunk'
import { updateGameBalanceThunk } from '../../redux/user/balanceThunk'
import { useDispatch } from 'react-redux'
import {
  updateBankConfigThunk,
  updateBankTransfersThunk,
  updateUserBankStatisticThunk
} from '../../redux/user/bankThunk'


type ExchangePropsType = {
  active: boolean
  setActive: (isActive: boolean) => void
}

const getComponentBySelectedMenu = (menu: string) => {
  switch (menu) {
    case 'statistics': {
      return <BankStatistic />
    }
    case 'deposit': {
      return <BankDeposit />
    }
    case 'transfers': {
      return <BankTransfers />
    }
    default: return null;
  }
}

const Bank: FC<ExchangePropsType> = ({ active, setActive }) => {
  const [selectedMenu, updateMenu] = useState('statistics')

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(updateBankConfigThunk())
  }, [])

  useEffect(() => {
    dispatch(updateUserBankStatisticThunk())
    dispatch(updateBankTransfersThunk())
    dispatch(updateBankConfigThunk())
  }, [active])

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
          <span className='modal-title-text'>Bank</span>

          <img
            onClick={() => updateMenu('statistics' )}
            className={`bank-control-btn ${selectedMenu === 'statistics' ? 'selected' : ''}`}
            id='statistics'
            src={StatisticsPng}
            alt=''
          />
          <img
            onClick={() => updateMenu('deposit' )}
            className={`bank-control-btn ${selectedMenu === 'deposit' ? 'selected' : ''}`}
            id='deposit'
            src={DepositPng}
            alt=''
          />
          <img
            onClick={() => updateMenu('transfers' )}
            className={`bank-control-btn ${selectedMenu === 'transfers' ? 'selected' : ''}`}
            id='transfers'
            src={TransfersPng}
            alt=''
          />
          <img className="bank-bg" src={BankBgPng} alt='' />
          <div className='bank-tab-content'>
            {getComponentBySelectedMenu(selectedMenu)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Bank
