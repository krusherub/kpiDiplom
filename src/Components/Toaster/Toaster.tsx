import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { MessageEnum } from '../../redux/types'
import { setMessage } from '../../redux/user/userSlice'
import './Toaster.css'
import modalBgImg from '../../img/error/error-bg.png'
import closeBtnImg from '../../img/common/close-btn.png'
import errorMainImg from '../../img/error/error-img.png'
import okImg from '../../img/error/ok.png'

const Toaster = () => {
  const message = useSelector((state: RootState) => state.user.message)
  const dispatch = useDispatch()
  const isModalActive = message.type !== MessageEnum.noType

  const handleClose = () => dispatch(setMessage({ type: MessageEnum.noType, text: null }))
  return (
    <div
      className={isModalActive ? 'modal-wrapper active' : 'modal-wrapper'}
      onClick={handleClose}
    >
      <div
        className={isModalActive ? 'modal-container active' : 'modal-container'}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='custom-modal-content'>
          <img className='modal-background' src={modalBgImg} alt='' />
          {/*<img className='modal-close-btn' onClick={handleClose} src={closeBtnImg} alt='' />*/}
          {/*<span className='modal-title-text'>Error</span>*/}
          <img id='error-img' src={errorMainImg} alt='' />
          <span id='error-default-message'>
            Asserting failure with message:
          </span>
          <span id='error-message'>
            {message.text}
          </span>
          <img onClick={handleClose} id='error-submit-btn' src={okImg} alt='' />
        </div>
      </div>
    </div>
  )
}

export default Toaster