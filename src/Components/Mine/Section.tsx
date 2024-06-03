import React, { FC } from 'react'
import { InventoryItemType } from '../types'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { getInventoryImgByRank, getRankByTemplateId } from '../helpers'
import { sortBy } from 'lodash'

type SectionPropsType = {
  setSelected: (item: any) => void,
  selectedItem: any
}

const Section: FC<SectionPropsType> = ({ setSelected, selectedItem}) => {
  const stakedList = useSelector((state: RootState) => state.user.stakedList)

  return (
    <section className='vertical-carousel-container'>
      {sortBy(stakedList, 'rank').reverse().map((item: InventoryItemType) => {
        if (!item.mineable) {
          return null
        }
        const key = Math.floor(Math.random() * 10000000)
        return (
          <img
            key={key}
            src={getInventoryImgByRank(getRankByTemplateId(item.template_id))}
            onClick={() => setSelected(item.id)}
            className={
              item.id === selectedItem?.id
                ? 'carousel__img--item active'
                : 'carousel__img--item'
            }
            alt=''
          />
        )
      })}
    </section>
  )
}

export default Section