import craft5Img from '../../img/main/craft-5.png'
import craft15Img from '../../img/main/craft-15.png'
import craft25Img from '../../img/main/craft-25.png'
import mine3Img from '../../img/main/mine-3.png'
import mine7Img from '../../img/main/mine-7.png'
import burnImg from '../../img/main/burn.png'
import idleImg from '../../img/main/idle.png'

export const getMainPageDiscountsImg = (type: string, discounts: any) => {
  switch (type) {
    case 'craft': {
      switch (String(discounts.craft)) {
        case '0.05': {
          return craft5Img
        }
        case '0.1': {
          return craft5Img
        }
        case '0.15': {
          return craft15Img
        }
        case '0.20': {
          return craft15Img
        }
        case '0.25': {
          return craft25Img
        }
        case '0.30': {
          return craft25Img
        }
      }
      break
    }
    case 'mine': {
      switch (String(discounts.mineType)) {
        case '3': {
          return mine3Img
        }
        case '7': {
          return mine7Img
        }
      }
      break
    }
    case 'burnProtect': {
      return burnImg
    }
    case 'bonusSlot': {
      return idleImg
    }
  }
}