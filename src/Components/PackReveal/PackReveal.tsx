import React, { FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { MessageEnum } from '../../redux/types'
import { setMessage } from '../../redux/user/userSlice'
import './PackReveal.css'
import modalBgImg from '../../img/common/modal-bg.png'
import closeBtnImg from '../../img/common/close-btn.png'
import backgroundImg from '../../img/packreveal/packreveal-bg.png'
import okayBtnImg from '../../img/packreveal/okay-btn.png'
import testImg from '../../img/packreveal/test-img.png'

type PackRevealPropsType = {
  active: boolean
  setActive: (isActive: boolean) => void
  itemName: string
}

const PackReveal: FC<PackRevealPropsType> = ({ active , setActive, itemName}) => {
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
          <img className='modal-close-btn' src={closeBtnImg} alt='' />
          <span className='modal-title-text'>Reveal</span>

          <img className='pack-reveal-bg' src={backgroundImg} alt='' />
          <img className='pack-reveal-img' src={testImg} alt='' />
          <span id='packreveal-text'>
               You`ve received  <br/>{itemName}
          </span>
          <img className='pack-reveal-okay-btn' src={okayBtnImg} alt='' />
        </div>
      </div>
    </div>
  )
}

export default PackReveal