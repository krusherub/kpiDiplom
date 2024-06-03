import { AppThunk } from '../store'
import { setTemplates } from './userSlice'
import { TemplateApi } from '../../api/template.api'

export const getTemplatesThunk =
  (): AppThunk => async (dispatch) => {
    try {
      const templates = await TemplateApi.getItems()

      dispatch(setTemplates(templates))
    } catch (error) {
      const errorMessage = 'Failed to load templates. Please reload the page'
      console.log(errorMessage)
    }
  }