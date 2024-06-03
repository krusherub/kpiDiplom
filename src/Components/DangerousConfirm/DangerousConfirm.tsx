import React, { FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { MessageEnum } from '../../redux/types'
import { setMessage } from '../../redux/user/userSlice'
import './DangerousConfirm.css'
import modalBgImg from '../../img/common/modal-bg.png'
import closeBtnImg from '../../img/common/close-btn.png'
import backgroundImg from '../../img/upgrade/dangerous-bg.png'
import infoImg from '../../img/common/info-icon.png'
import yesBtn from '../../img/upgrade/yes-btn.png'
import noBtn from '../../img/upgrade/no-btn.png'
import { dangerousUpgradeThunk } from '../../redux/user/mineThunk'
import { InventoryItemType, TemplateType } from '../types'

type DangerousConfirmPropsType = {
  selected_item: InventoryItemType,
  active: boolean
  setActive: (isActive: boolean) => void
  setActiveUpgrade: (isActive: boolean) => void,
  selected_template: TemplateType | undefined
}

const DangerousConfirm: FC<DangerousConfirmPropsType> = ({ active, setActive, selected_item, selected_template, setActiveUpgrade}) => {
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
          <span className='modal-title-text'>Confirmation</span>
          <img onClick={() => setActive(false)} className='modal-close-btn' src={closeBtnImg} alt='' />
          <img className='dangerous-background' src={backgroundImg} alt='' />
          <span id='dangerous-header-text'>
            Do you want to proceed?
          </span>
          <span id='dangerous-success-text'>
            Change on success
          </span>
          <span id='dangerous-success-value'>
            {selected_template?.chance_to_success_upgrade_risk} %
          </span>

          <img id='dangerous-info-img' src={infoImg} alt='' />
          <span id='dangerous-info-text'>
            On failure, the building will be burned.
          </span>

          <img id='dangerous-yes-btn' src={yesBtn} alt=''  onClick={() => dispatch(dangerousUpgradeThunk(selected_item, setActive, setActiveUpgrade))}/>
          <img id='dangerous-no-btn' src={noBtn} alt='' onClick={() => setActive(false)}/>
        </div>
      </div>
    </div>
  )
}

export default DangerousConfirm