import React, { FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { MessageEnum } from '../../redux/types'
import { setMessage } from '../../redux/user/userSlice'
import './Registration.css'
import modalBgImg from '../../img/common/modal-bg.png'
import closeBtnImg from '../../img/common/close-btn.png'
import backgroundImg from '../../img/registration/reg-bg.png'
import signUpImg from '../../img/registration/signup-btn.png'
import infoImg from '../../img/common/info-icon.png'
import { signUpThunk } from '../../redux/user/loginThunk'

type RegistrationPropsType = {
  active: boolean
  // setActive: (isActive: boolean) => void
  inviter: string | null
}

const Registration: FC<RegistrationPropsType> = ({ active , inviter}) => {
  const dispatch = useDispatch()

  const handleClose = () => dispatch(setMessage({ type: MessageEnum.noType, text: null }))
  return (
    <div
      className={active ? 'modal-wrapper active' : 'modal-wrapper'}
      onClick={handleClose}
    >
      <div
        className={active ? 'modal-container active' : 'modal-container'}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='custom-modal-content'>
          <img className='modal-background' src={modalBgImg} alt='' />
          <span className='modal-title-text'>Registration</span>

          <img className='reg-background' src={backgroundImg} alt='' />

          <span id='reg-header-text'>
            Welcome to the Modern World!
          </span>

          <span id='reg-welcome-text'>
            To access the game you need to create an account firstly. it’s one time action. Click on “Sign up” button
          </span>

          {inviter &&
           <>
             <img className='reg-info-img' src={infoImg} alt='' />
             <span id='reg-inviter-text'>
               You have been invited by <span id='inviter-name-text'>{inviter}</span>
             </span>
           </>
          }

          <img
            onClick={() => {
              dispatch(signUpThunk(inviter || '', handleClose))
            }}
            className='reg-signup-btn'
            src={signUpImg}
            alt=''
          />
        </div>
      </div>
    </div>
  )
}

export default Registration