import React from 'react'
import TableTitle1 from '../../img/bank/title-1.png'
import TableTitle2 from '../../img/bank/title-2.png'
import TableTitle3 from '../../img/bank/title-3.png'
import TableTitle4 from '../../img/bank/title-4.png'
import InfoScroll from '../../img/bank/info-scroll.png'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { useTimer } from 'react-timer-hook'
import { formatTime } from '../Mine/helpers'
import { BankOutThunk } from '../../redux/user/bankThunk'
import Countdown from 'react-countdown';

const BankTransfers = () => {
  const bankTransfers = useSelector((state: RootState) => state.user.bankTransfers)
  const dispatch = useDispatch()
  return (
    <React.Fragment>
      <img id='bank-transfers-title-1' className='bank-transfers-table-titles' src={TableTitle1} alt='' />
      <img id='bank-transfers-title-2' className='bank-transfers-table-titles' src={TableTitle2} alt='' />
      <img id='bank-transfers-title-3' className='bank-transfers-table-titles' src={TableTitle3} alt='' />
      <img id='bank-transfers-title-4' className='bank-transfers-table-titles' src={TableTitle4} alt='' />

      <div id='transfers-container'>
        {bankTransfers?.map((item) => {

          return (
            <div key={item.id} className='transfer-item'>
              <img className='transfers-item-bg' src={InfoScroll} alt='' />
              <span id='transfers-item-number' className='transfers-text'>
                {item.id}
              </span>
              <span id='transfers-item-amount' className='transfers-text'>
                {Number.parseFloat(item.money_staked)} MWM
              </span>
              <span id='transfers-item-locked-period' className='transfers-text'>
                {Number.parseInt(item.staked_for_days)} days
              </span>
              <span id='transfers-item-unlock-in' className='transfers-text'>
                {/*{formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}*/}
                <Countdown date={item.ready_to_close_time * 1000 || new Date()} />
              </span>
              { item.ready_to_close_time * 1000 <= Date.now() ?
              <span
                // style={{...(item.ready_to_close_time * 1000 > Date.now() && {pointerEvents: 'none'})}}
                id='transfers-item-close-btn'
                className='transfers-text'
                onClick={() => {
                  if (item.ready_to_close_time * 1000 < Date.now()) {
                    dispatch(BankOutThunk(item.id))
                  }
                }}
              >
                Close
              </span>
                : <></>
              }
            </div>
          )
        })}
      </div>

    </React.Fragment>
  )
}

export default BankTransfers