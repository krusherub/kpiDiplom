import React from 'react'
import startBack from '../../img/common/rotate-bg.png'
import './RotateScreen.css'

type RotateScreenType = {
  isActive: boolean
}

const RotateScreen = ({ isActive }: RotateScreenType) => {

  return (
    <div className={isActive ? 'modal-wrapper active' : 'modal-wrapper'}>
      <div
        className={isActive ? 'modal-container-exchange active' : 'modal-container-exchange'}
        onClick={(e) => e.stopPropagation()}
      >
        <div id="rotate-wrapper">
          <img id='rotate-bg-img' src={startBack} alt='background' />
          <span id='rotate-text'>Please rotate your device</span>
        </div>

      </div>
    </div>
  )
}

export default RotateScreen