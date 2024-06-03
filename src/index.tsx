import React from 'react'
import ReactDOM from 'react-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Routes } from 'react-router-dom'
import App from './Components/App/App'
import { store } from './redux/store'
import { Provider } from 'react-redux'

import './index.css'
import { Route } from 'react-router'

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path='/*' element={<App />} />
      </Routes>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
)
