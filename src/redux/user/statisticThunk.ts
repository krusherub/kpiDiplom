import { AppThunk } from '../store'
import { updateGlobalStatistic, updateLeaderboardStatistic } from './userSlice'
import { StatisticApi } from '../../api/statistic.api'


export const statisticThunk = (): AppThunk => async (dispatch, getState) => {
  try {
    const leaderboardResp = await StatisticApi.getLeaderboard()
    const statisticResp = await StatisticApi.getGlobalStatistic()

    const totalProfitability = statisticResp.data.rows[0].total_profitability
    const leaderboard = leaderboardResp.data.rows.map((item: any) =>  ({ name: item.account, profitability: item.profitability, totalPercent: item.profitability * 100 / totalProfitability }))
    dispatch(updateLeaderboardStatistic(leaderboard))
    dispatch(updateGlobalStatistic(statisticResp.data.rows[0]))
  } catch (error) {
    const errorMessage = 'Statistic error'
    console.log(errorMessage)
  }
}
