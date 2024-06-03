import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './Statistics.css'
import statIconImg from '../../img/statistics/statistics-header.png'
import leaderIconImg from '../../img/statistics/leaderboard-header.png'
import sectionBgImg from '../../img/statistics/statistics-bg.png'
import statisticsTextBgImg from '../../img/statistics/statistics-text-bg.png'
import verticalDividerImg from '../../img/statistics/vertical-divider.png'
import numberHeader from '../../img/leaderboard/number-header.png'
import accountHeader from '../../img/leaderboard/account-header.png'
import profitabilityHeader from '../../img/leaderboard/profitability-header.png'
import totalPercentHeader from '../../img/leaderboard/total-header.png'
import lineBgImg from '../../img/leaderboard/line-bg.png'
import global from '../../img/statistics/global.png'
import myCity from '../../img/statistics/city.png'
import modalBgImg from '../../img/common/modal-bg.png'
import closeBtnImg from '../../img/common/close-btn.png'
import { RootState } from '../../redux/store'
import { statisticThunk } from '../../redux/user/statisticThunk'
import { updateGameBalanceThunk } from '../../redux/user/balanceThunk'

type StatisticsPropsType = {
  active: boolean
  setActive: (isActive: boolean) => void
}

const getStat = (userData: any, globalStatistic: any) => {
  return (userData?.profitability / globalStatistic?.total_profitability)
  * Number.parseFloat(globalStatistic?.token_creation_s)
}

const Statistics: FC<StatisticsPropsType> = ({ active, setActive }) => {
  const [statisticType, setStatisticType] = useState('statistic')
  const userData = useSelector((state: RootState) => state.user.userData)
  const userStatus = useSelector((state: RootState) => state.user.isNewUser)
  const globalStatistic = useSelector((state: RootState) => state.user.globalStatistic)

  const dispatch = useDispatch()

  let leaderboardData = useSelector((state: RootState) => state.user.leaderboard)

  useEffect(() => {
    if (!active) {
      setStatisticType('statistic')
    }
  }, [active])

  useEffect(() => {
    dispatch(statisticThunk())
    dispatch(updateGameBalanceThunk())
  }, [])

  useEffect(() => {
    dispatch(updateGameBalanceThunk())
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
          <span className='modal-title-text'>Statistics</span>

          <img id='statistic-stat-icon' src={statIconImg} alt=''
               onClick={() => setStatisticType('statistic')}
               className={
                 statisticType === 'statistic'
                   ? 'selected'
                   : ''
               } />
          <img id='statistic-leader-icon' src={leaderIconImg} alt=''
               onClick={() => setStatisticType('leaderboard')}
               className={
                 statisticType === 'leaderboard'
                   ? 'selected'
                   : ''
               } />
          <img id='section-bg' src={sectionBgImg} alt='' />

          {statisticType === 'statistic' && (
            <>
              {/*<span className='statistic-text' id='my-city-header'>*/}
              {/*  My city*/}
              {/*</span>*/}
              <img id='mycity-img' src={myCity} alt='' />

              {/*<span className='statistic-text' id='global-header'>*/}
              {/*  Global*/}
              {/*</span>*/}
              <img id='global-img' src={global} alt='' />

              <img id='first-global-bg' src={statisticsTextBgImg} alt='' />
              <span className='statistic-text' id='first-global-text'>
                Total:
              </span>
              <span className='statistic-text' id='first-global-value'>
                {globalStatistic?.total_profitability}
              </span>

              <img id='second-global-bg' src={statisticsTextBgImg} alt='' />
              <span className='statistic-text' id='second-global-text'>
                Mint rate:
              </span>
              <span className='statistic-text' id='second-global-value'>
                {Number.parseFloat(globalStatistic?.token_creation_s as string)} MWM per sec
              </span>

              <img id='third-global-bg' src={statisticsTextBgImg} alt='' />
              <span className='statistic-text' id='third-global-text'>
                Total burned
              </span>
              <span className='statistic-text' id='third-global-value'>
                {Math.round(Number.parseInt(globalStatistic?.total_burned as string))} MWM
              </span>

              <img id='fourth-global-bg' src={statisticsTextBgImg} alt='' />
              <span className='statistic-text' id='fourth-global-text'>
                Total minted:
              </span>
              <span className='statistic-text' id='fourth-global-value'>
                {Math.round(Number.parseInt(globalStatistic?.tokens_minted as string))} MWM
              </span>

              <img id='statistic-vert-divider' src={verticalDividerImg} alt='' />

              <img id='first-mycity-bg' src={statisticsTextBgImg} alt='' />
              <span className='statistic-text' id='first-mycity-text'>
                Profitability
                {/*update*/}
              </span>
              <span className='statistic-text' id='first-mycity-value'>
                {userData.profitability}
              </span>

              <img id='second-mycity-bg' src={statisticsTextBgImg} alt='' />
              <span className='statistic-text' id='second-mycity-text'>
                Mining
                {/*update*/}
              </span>
              <span className='statistic-text' id='second-mycity-value'>
                {(getStat(userData, globalStatistic) * 60).toFixed(4)}
              </span>

              <img id='third-mycity-bg' src={statisticsTextBgImg} alt='' />
              <span className='statistic-text' id='third-mycity-text'>
                Total spend
              </span>
              <span className='statistic-text' id='third-mycity-value'>
                {parseFloat(userData?.tokens_burned?.split(' ')[0] ?? '').toFixed(2)}
              </span>
            </>
          )}

          {statisticType === 'leaderboard' && (
            <>
              <img id='leaderboard-number-header' src={numberHeader} alt='' />
              <img id='leaderboard-account-header' src={accountHeader} alt='' />
              <img id='leaderboard-profitability-header' src={profitabilityHeader} alt='' />
              <img id='leaderboard-total-header' src={totalPercentHeader} alt='' />

              <div id='leaderboard-container'>
                {leaderboardData.map((item, index) => {
                  return (
                    <div className='leaderboard-item' key={index}>
                      <img id='leaderboard-bg' src={lineBgImg} alt='' />
                      <span className='statistic-text' id='leaderboard-item-number'>
                      {index + 1}
                    </span>
                      <span className='statistic-text' id='leaderboard-item-account'>
                      {item.name}
                    </span>
                      <span className='statistic-text' id='leaderboard-item-profitability'>
                      {item.profitability}
                    </span>
                      <span className='statistic-text' id='leaderboard-item-total'>
                      {item.totalPercent.toFixed(2)}
                    </span>
                    </div>)
                })}
              </div>
            </>)}
        </div>
      </div>
    </div>
  )
}

export default Statistics
