import React, { FC, useState } from 'react'
import LoginChoose from '../LoginChoose/LoginChoose'
import './Login.css'
import loginMwName from '../../img/login/mw-name.png';
import welcomeTextImg from '../../img/login/login-welcome-text.png';
import loginButtonImg from '../../img/login/login-btn.png';
import loginInputBg from '../../img/login/login-input-bg.png';
import { loginChainsData } from '../LoginChoose/helpers'

type LoginPropsType = {
  show: boolean
}

const Login: FC<LoginPropsType> = ({ show }) => {
  const [showLoginChoose, setShowLoginChoose] = useState(false)
  const chains = loginChainsData
  const [selectedChain, changeSelectedChain] = useState<{ chainId: string, nodeUrl: string } | {}>(chains[0])

  if (!show) {
    return null
  }

  return (
    <>
      <div className='login-container'>
        <div className='login-button-container'>
          <div className='start-container'>
            <img className='login-mw-name' src={loginMwName} alt='' />
            {/*<img className='main-logo-img' src={loginFormPng} alt='background' />*/}
            <img className='welcome-text' src={welcomeTextImg} alt='Welcome' />
            <img className='login-button' src={loginButtonImg} alt='login'
                 onClick={() => setShowLoginChoose(!showLoginChoose)} />
            {/*<img className='login-input-bg' src={loginInputBg} alt='Welcome' />*/}

            <div className='select-container'>
              <select className='login-select-input' defaultValue={chains[0].nodeUrl}
                      onChange={(e) => {
                        changeSelectedChain(chains.find(item => item.nodeUrl === e.target.value) as any)
                      }} aria-label='Default select example'>
                {chains.map((chain) => (
                  <option style={{ color: '#000000' }} key={chain.nodeUrl}
                          value={chain.nodeUrl}>{chain.nodeUrl}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      <LoginChoose
        selectedChain={selectedChain}
        changeSelectedChain={changeSelectedChain}
        active={showLoginChoose}
        setActive={setShowLoginChoose}
      />

    </>
  )
}

export default Login
