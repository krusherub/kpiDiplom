import React, { useEffect, useState } from 'react'
import VerticalDivider from '../../img/bank/vertical-devider.png';
import InfoBg from '../../img/bank/info-bg.png';
import tokensSectionBg from '../../img/bank/tokens-section.png';
import GoldPng from '../../img/bank/gold.png';
import ClaimBtnPng from '../../img/bank/claim-btn.png';
import InfoSectionBg from '../../img/bank/info-section.png';
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { retry } from '@reduxjs/toolkit/query'
import { ClaimGoldThunk } from '../../redux/user/bankThunk'
import { useTimer } from 'react-timer-hook'
import { formatTime } from '../Mine/helpers'


const BankStatistic = () => {
  const bankConfig = useSelector((state: RootState) => state.user.bankConfig)
  const userBankStatistic = useSelector((state: RootState) => state.user.userBankStatistic)
  const dispatch = useDispatch()

  const {
    seconds,
    minutes,
    hours,
    days,
    restart
  } = useTimer({
    expiryTimestamp: new Date(Date.now())
  })

  const getGoldToClaim = () => {
    const time = userBankStatistic?.last_claimed > bankConfig?.bank_opens_time
      ? new Date(userBankStatistic?.last_claimed * 1000)
      : new Date(bankConfig?.bank_opens_time * 1000)

    if (Date.now() <= bankConfig?.bank_opens_time * 1000)
    {
      return 0
    }

    return (Date.now() - +time) * Number.parseFloat(bankConfig?.gold_creation_s) * (Number.parseInt(userBankStatistic?.total_interest ?? 0) / Number.parseInt(bankConfig?.total_interest)) / 1000
  }

  const getMyMintRatePerDay = () => {
    return Number(60 * 60 * 24 * Number.parseFloat(bankConfig?.gold_creation_s) * (Number.parseInt(userBankStatistic?.total_interest ?? 0) / Number.parseInt(bankConfig?.total_interest)))
  }

  useEffect(() => {
    if (Date.now() <= bankConfig?.bank_opens_time * 1000) {
      restart(new Date(bankConfig?.bank_opens_time * 1000))
    }
    else {
      restart(new Date((userBankStatistic?.available_to_claim) * 1000))
    }
  }, [userBankStatistic, bankConfig])

  return (
    <React.Fragment>
      <span id='bank-details' className='statistic-title-text'>
        Bank details
      </span>
      <img
        src={VerticalDivider}
        className='bank-statistics-divider'
        id='bank-statistic-divider-1'
        alt=''
      />
      <span id='my-bank' className='statistic-title-text'>
        My bank
      </span>
      <img
        src={VerticalDivider}
        className='bank-statistics-divider'
        id='bank-statistic-divider-2'
        alt=''
      />
      <span id='my-gold' className='statistic-title-text'>
        My gold
      </span>

      <div id='bank-details'>
        <img id='bank-details-1' className='statistics-info-bg' src={InfoBg} alt='' />
        <span id='bank-details-text-title-1' className='statistics-info-text-title'>Total Staked</span>
        <span id='bank-details-text-desc-1' className='statistics-info-text-desc'>{Number((bankConfig?.money_total_staked)?.split(' ')[0]).toFixed(0)} MWM</span>

        <img id='bank-details-2' className='statistics-info-bg' src={InfoBg} alt='' />
        <span id='bank-details-text-title-2' className='statistics-info-text-title'>Total points</span>
        <span id='bank-details-text-desc-2' className='statistics-info-text-desc'>{Number(bankConfig?.total_interest / 10000).toFixed(2) }</span>

        <img id='bank-details-3' className='statistics-info-bg' src={InfoBg} alt='' />
        <span id='bank-details-text-title-3' className='statistics-info-text-title'>Mint rate</span>
        <span id='bank-details-text-desc-3' className='statistics-info-text-desc'>600 GOLD P/D</span>

        <img id='bank-details-4' className='statistics-info-bg' src={InfoBg} alt='' />
        <span id='bank-details-text-title-4' className='statistics-info-text-title'>Total minted</span>
        <span id='bank-details-text-desc-4' className='statistics-info-text-desc'>{Number(parseFloat(bankConfig?.gold_total_created)).toFixed(2)} GOLD</span>

      </div>

      <div id='my-bank'>
        <img id='my-bank-1' className='statistics-info-bg' src={InfoBg} alt='' />
        <span id='my-bank-text-title-1' className='statistics-info-text-title'>MWM staked</span>
        <span id='my-bank-text-desc-1' className='statistics-info-text-desc'>{Number.parseFloat(userBankStatistic?.money_total_staked ?? 0)} MWM</span>

        <img id='my-bank-2' className='statistics-info-bg' src={InfoBg} alt='' />
        <span id='my-bank-text-title-2' className='statistics-info-text-title'>Total points</span>
        <span id='my-bank-text-desc-2' className='statistics-info-text-desc'>{Number((userBankStatistic?.total_interest ?? 0) / 10000).toFixed(2)}</span>

        <img id='my-bank-3' className='statistics-info-bg' src={InfoBg} alt='' />
        <span id='my-bank-text-title-3' className='statistics-info-text-title'>Gold Claimed</span>
        <span id='my-bank-text-desc-3' className='statistics-info-text-desc'>{Number.parseFloat(userBankStatistic?.total_gold_claimed ?? 0)} GOLD</span>

        <img id='my-bank-4' className='statistics-info-bg' src={InfoBg} alt='' />
        <span id='my-bank-text-title-4' className='statistics-info-text-title'>Mint rate</span>
        <span id='my-bank-text-desc-4' className='statistics-info-text-desc'>{isNaN(getMyMintRatePerDay()) ? 0 : getMyMintRatePerDay().toFixed(4) } P/D</span>

      </div>

      <div id='my-gold'>
        <span id='my-gold-title'>Unclaimed gold</span>
        <img id='my-gold-tokens-sections' src={tokensSectionBg} alt='' />
        <img id='my-gold-png' src={GoldPng} alt='' />
        <span id='my-gold-count'>{getGoldToClaim().toFixed(4)}</span>
        { (userBankStatistic?.total_interest ?? 0) == 0
          ? <div>
              <img id='my-gold-info-section-bg' src={InfoSectionBg} alt='' />
              <span id='my-gold-info-text'>No deposits. Stake tokens to earn gold</span>
            </div>
          : ((userBankStatistic?.available_to_claim) * 1000 < Date.now()) && ((bankConfig?.bank_opens_time * 1000) < Date.now())
            ? <img id='my-gold-claim-btn' src={ClaimBtnPng} alt='' onClick={() => dispatch(ClaimGoldThunk())} />
            :
            <div>
              <img id='my-gold-info-section-bg' src={InfoSectionBg} alt='' />
              <span id='my-gold-info-text'>Claim available in {formatTime(days)}:{formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}</span>
            </div>
        }
      </div>
    </React.Fragment>
  )
}

export default BankStatistic