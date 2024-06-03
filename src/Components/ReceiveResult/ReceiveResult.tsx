import React, { FC } from 'react'

import './ReceiveResult.css'
import modalBgImg from '../../img/common/modal-bg.png'
import closeBtnImg from '../../img/common/close-btn.png'
import bgImg from '../../img/receive-result/bg.png'
import okayBtnImg from '../../img/receive-result/okay-btn.png'
import burnImg from '../../img/receive-result/burn.png'
import exampleImg from '../../img/receive-result/example.png'
import { useDispatch, useSelector } from 'react-redux'
import { updateReceiveResult } from '../../redux/user/userSlice'
import { RootState } from '../../redux/store'
import { getBuildingNameByRank, getInventoryImgByRank, getRankByTemplateId } from '../helpers'

const ReceiveResult: FC = () => {
  const receiveResult = useSelector((state: RootState) => state.user.receiveResult)

  const dispatch = useDispatch()

  return (
    <div
      className={receiveResult ? 'modal-wrapper active' : 'modal-wrapper'}
      onClick={() => {
        dispatch(updateReceiveResult(null))
      }}
    >
      <div
        className={receiveResult ? 'modal-container active' : 'modal-container'}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='custom-modal-content'>
          <img className='modal-background' src={modalBgImg} alt='' />
          <img onClick={() => dispatch(updateReceiveResult(null))} className='modal-close-btn' src={closeBtnImg} alt='' />
          <span className='modal-title-text'>{receiveResult?.failure ? 'Regrets' : 'Congrats'}</span>
          <img id="result-bg-img" src={bgImg} alt='' />
          <img onClick={() => dispatch(updateReceiveResult(null))} id="result-okay-btn" className='mine-buttons' src={okayBtnImg} alt='' />
          <img id="result-receive-item" src={getInventoryImgByRank(getRankByTemplateId(receiveResult?.template_id))} alt='' />
          <span id="result-receive-text" style={receiveResult?.failure ? {color: '#f73333'} : {}}>You`ve {receiveResult?.failure ? 'lost' : 'received'} </span>
          <span id="result-receive-name">{getBuildingNameByRank(getRankByTemplateId(receiveResult?.template_id as any))}</span>
          {receiveResult?.failure && <img id="burn-img" src={burnImg} alt='' />}

        </div>
      </div>
    </div>
  )
}

export default ReceiveResult