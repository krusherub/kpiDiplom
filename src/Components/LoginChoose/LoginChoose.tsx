import './LoginChoose.css'
import React, { useEffect } from 'react'
import { WalletEnum } from '../types'
import { useDispatch } from 'react-redux'
import { loginThunk } from '../../redux/user/loginThunk'
import waxButtonImg from '../../img/login/login-wcw.png'
import anchorButtonImg from '../../img/login/login-anchor.png'
import modalBgImg from '../../img/common/modal-bg.png'
import closeBtnImg from '../../img/common/close-btn.png'
import configData from '../../data.json'
import { useWindowSize } from '../hooks/useWindowSize'

type LoginChoosePropsType = {
  active: boolean,
  setActive: (isActive: boolean) => void,
  changeSelectedChain: any,
  selectedChain: any
}

const LoginChoose = ({ selectedChain, changeSelectedChain, active, setActive } : LoginChoosePropsType) => {

  const dispatch = useDispatch()

  const [width, height] = useWindowSize()

  useEffect(() => {
    return () => {
      changeSelectedChain({}) // This worked for me
    }
  }, [])
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
          <span className='modal-title-text'>{height < 400 ? "Wallet" : "Select wallet" }</span>

          <span id='choose-text'>Please choose</span>
          <img
            style={{...(configData.rpcEndpoint.includes('test') && { opacity: '0.5', pointerEvents: 'none' })}}
            className='choose-button'
            id='wax-button'
            src={waxButtonImg}
            alt=''
            onClick={() => dispatch(loginThunk(WalletEnum.wax, selectedChain))}
          />
          <img className='choose-button' id='anchor-button' src={anchorButtonImg} alt=''
               onClick={() => dispatch(loginThunk(WalletEnum.anchor, selectedChain))} />
        </div>
      </div>
    </div>
  )
}

export default LoginChoose