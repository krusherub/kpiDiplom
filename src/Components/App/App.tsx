import React, { useEffect } from 'react'

import Login from '../Login/Login'
import Main from '../Main/Main'
import Loader from '../Loader/Loader'

import './App.css'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { getTemplatesThunk } from '../../redux/user/templateThunk'
import { useLocation, useNavigate } from 'react-router-dom'
import { useWindowSize } from '../hooks/useWindowSize'
import ReceiveResult from '../ReceiveResult/ReceiveResult'
import Registration from '../Registration/Registration'
// import PackReveal from '../PackReveal/PackReveal'
import RotateScreen from '../RotateScreen/RotateScreen'
import Toaster from '../Toaster/Toaster'
import Bank from '../Bank/Bank'

const App = () => {
  const dispatch = useDispatch()
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn)
  const isLoading = useSelector((state: RootState) => state.user.isLoading)
  const isNewUser = useSelector((state: RootState) => state.user.isNewUser)

  const location = useLocation()
  const navigate = useNavigate()
  const [width, height] = useWindowSize()

  useEffect(() => {
    if (location.pathname !== '/') navigate('/', { replace: true })
  }, [location])

  useEffect(() => {
    dispatch(getTemplatesThunk())
  }, [])

  return (
    <>
      <Registration active={isNewUser.isNew} inviter={isNewUser.referralInviter}/>
      <Loader isLoading={isLoading} />
      <ReceiveResult />
      <Login
        show={!isLoggedIn}
      />
      {/*<Bank active={true} setActive={() => {}}/>*/}

      {isLoggedIn && <Main />}
      <Toaster />
      {/*<RevealScreen />*/}
      <RotateScreen isActive={width < height} />
    </>
  )
}

export default App
