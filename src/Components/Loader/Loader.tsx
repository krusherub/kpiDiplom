import React, { FC } from 'react'
import './Loader.css'

type LoaderPropsType = {
  isLoading: boolean,
}

const Loader: FC<LoaderPropsType> = ({ isLoading }) => {
  return (
    <div style={{ zIndex: 100000 }} className={isLoading ? 'modal-wrapper active' : 'modal-wrapper'}>
      <img style={{ width: '15%' }} src={require('../../img/loader.gif')} alt='' />
      <div style={{ color: '#ffffff', fontSize: '2vw', position: 'absolute', top: '65%' }}>Waiting for transaction</div>
      {/*<div*/}
      {/*  className={isLoading ? 'modal-container active' : 'modal-container'}*/}
      {/*  onClick={(e) => e.stopPropagation()}*/}
      {/*>*/}
      {/*  <p className='popup-waiting-text'>Waiting for transaction</p>*/}
      {/*  <div className='cssload-loader'>*/}
      {/*    <div className='cssload-inner cssload-one' />*/}
      {/*    <div className='cssload-inner cssload-two' />*/}
      {/*    <div className='cssload-inner cssload-three' />*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  )
}

export default Loader
