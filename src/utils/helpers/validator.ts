export const validateResource = async (resource: number[], cost: number[] | string[]) => {
  let isValidated = true;
  for (let i = 0; i < 5; i++) {
    let resouceAmount = parseFloat(resource[i].toString());
    if (resouceAmount < Number(cost[i])) {
      isValidated = false;
      break;
    }
  }

  return isValidated;
};

export const validateDependency = (house: any, itemId: number, oneDayTime: number) => {
  const items = [
    ...house.yieldUpgrades,
    ...house.productionUpgrades,
    ...house.premiumUpgrades
  ]

  const buyItem = items.filter(item => item.id === itemId)[0]
  if (buyItem?.dependency.length > 0) {
    let isValidated = false
    buyItem.dependency.map((dependency: any) => {
      const dependencyItem = items.filter(item => item.id === dependency)[0]
      if (dependencyItem?.activeTime) {
        if (dependencyItem.buy[10] > 0) {
          const activeTime = Date.parse(dependencyItem.activeTime)
          const dueTime = (activeTime / 1000 + oneDayTime * dependencyItem.buy[10]) * 1000

          if ((dueTime) > Date.now())
            isValidated = true
          else
            isValidated = false
        } else {
          isValidated = true;
        }
      }
    })

    return isValidated
  }

  return true;
}

export const getDependencyItem = (house: any, itemId: number, oneDayTime: number) => {
  const dependencyItems: any[] = []
  const items = [
    ...house.yieldUpgrades,
    ...house.productionUpgrades,
    ...house.premiumUpgrades
  ]

  const buyItem = items.filter(item => item.id === itemId)[0]
  if (buyItem?.dependency.length > 0) {
    buyItem.dependency.map((dependency: any) => {
      const dependencyItem = items.filter(item => item.id === dependency)[0]
      if (dependencyItem?.activeTime) {
        if (dependencyItem.buy[10] > 0) {
          const activeTime = Date.parse(dependencyItem.activeTime)
          const dueTime = (activeTime / 1000 + oneDayTime * dependencyItem.buy[10]) * 1000

          if ((dueTime) > Date.now())
            dependencyItems.push({
              id: dependencyItem.id,
              name: dependencyItem.name,
              isActivated: true
            })
          else
            dependencyItems.push({
              id: dependencyItem.id,
              name: dependencyItem.name,
              isActivated: false
            })
        } else {
          dependencyItems.push({
            id: dependencyItem.id,
            name: dependencyItem.name,
            isActivated: true
          })
        }
      } else {
        dependencyItems.push({
          id: dependencyItem.id,
          name: dependencyItem.name,
          isActivated: false
        })
      }
    })

    return dependencyItems
  }

  return dependencyItems;
}

export const getDependencyItemInstances = (items: any[], itemId: number) => {
  const buyItem = items.filter(item => item.id === itemId)[0]
  const dependencyItems: any[] = []
  if (buyItem?.dependency.length > 0) {
    buyItem.dependency.map((dependency: any) => {
      const dependencyItem = items.filter(item => item.id === dependency)[0]
      dependencyItems.push({
        id: dependencyItem.id,
        name: dependencyItem.name
      })
    })

    return dependencyItems
  }

  return dependencyItems;
}

export const validateItemDate = (item: any, oneDayTime: number) => {
  if (item?.activeTime) {
    if (item?.buy[10] > 0) {
      const activeTime = Date.parse(item.activeTime)
      const dueTime = (activeTime / 1000 + oneDayTime * item.buy[10]) * 1000

      if ((dueTime) > Date.now())
        return true
      else
        return false
    } else {
      return true
    }
  }

  return false
}

export const validateItemOneDay = (item: any, oneDayTime: number) => {
  if (item?.activeTime) {
    const activeTime = Date.parse(item.activeTime)
    const dueTime = (Number(activeTime / 1000) + Number(oneDayTime)) * 1000

    if ((dueTime) > Date.now())
      return true
    else
      return false
  }

  return false
}

export const validateItemDateWithDeadTime = (item: any) => {
  if (item?.activeTime) {
    if (item.buy[10] > 0) {
      const deadTime = Date.parse(item.deadTime)

      if ((deadTime) > Date.now())
        return 1
      else
        return 0
    } else {
      return 1
    }
  }

  return -1
}

export const getItemDurationWithDeadTime = (item: any, oneDayTime: number) => {
  if (item?.activeTime) {
    if (item.buy[10] > 0) {
      const deadTime = Date.parse(item.deadTime)
      if (deadTime) {
        const duration = Math.floor((Number(deadTime) - Number(Date.now())) / 100 / oneDayTime) / 10
        return duration
      } else {
        return 0
      }
    } else {
      return 0
    }
  }

  return 0
}

export const getItemDuration = (item: any, oneDayTime: number) => {
  if (item?.activeTime) {
    if (item.buy[10] > 0) {
      const activeTime = Date.parse(item.activeTime)
      const dueTime = (activeTime / 1000 + oneDayTime * item.buy[10]) * 1000

      const duration = Math.floor((Number(dueTime) - Number(Date.now())) / 100 / oneDayTime) / 10

      return duration
    } else {
      return 0
    }
  }

  return 0
}

export const getMaxItemDate = (items: any[]) => {
  let maxDate = 0
  for (const item of items) {
    if (item?.activeTime) {
      if (Date.parse(item.activeTime) > maxDate) {
        maxDate = Date.parse(item.activeTime)
      }
    }
  }

  return maxDate;
}

export const getRemainingTime = (timeStamp: number, oneDayTime: number) => {
  return Math.ceil((timeStamp + oneDayTime * 1000 - Number(Date.now())) / 1000)
}

export const validatePremiumNftItem = (premiumNftItem: any, ableTime: number) => {
  if (premiumNftItem?.activeTime) {
    const activeTime = Date.parse(premiumNftItem.activeTime)
    const dueTime = (activeTime / 1000 + ableTime) * 1000

    if ((dueTime) > Date.now())
      return true
    else
      return false
  }

  return false
}

export const getAvilablePremiumNftIds = (hasItems: any[], premiumAbleTime: number) => {
  const ids = []

  for (const hasItem of hasItems) {
    if (!validatePremiumNftItem(hasItem, premiumAbleTime)) {
      ids.push(hasItem.nftId)
    }
  }

  return ids
}

export const getHasPremiumNftIds = (hasItems: any[], premiumAbleTime: number) => {
  const ids = []

  for (const hasItem of hasItems) {
    if (validatePremiumNftItem(hasItem, premiumAbleTime)) {
      ids.push(hasItem.nftId)
    }
  }

  return ids
}

export const getPremiumNftAbleItem = (onChianIds: number[], hasItems: any[]) => {
  if (onChianIds.length < 1) return -1;

  for (let onChainId of onChianIds) {
    if (!hasItems.map(item => item.nftId).includes(onChainId)) {
      return onChainId
    }
  }

  return -1
}

export const getPremiumNftAbleItems = (onChianIds: number[], hasItems: any[]) => {
  const ableOnChainIds: any[] = []
  if (onChianIds.length < 1) return ableOnChainIds;

  for (let onChainId of onChianIds) {
    if (!hasItems.map(item => item.nftId).includes(onChainId)) {
      ableOnChainIds.push(onChainId)
    }
  }

  return ableOnChainIds
}

export const returnPremiumNftRemainTime = (activeTime: number) => {
  const activatedTime = new Date(activeTime)
  const deadTime = new Date(activatedTime.setMonth(activatedTime.getMonth() + 3))
  const currentTime = new Date()
  if (currentTime > deadTime) {
    return 0
  } else {
    const timeDifference = Number(deadTime) - Number(currentTime)
    const months = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 30));

    // Calculate the remaining time in milliseconds after subtracting months
    const remainingTime = timeDifference - months * (1000 * 60 * 60 * 24 * 30);

    // Calculate the number of days
    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));

    // Calculate the remaining time in milliseconds after subtracting days
    const remainingTime2 = remainingTime - days * (1000 * 60 * 60 * 24);

    // Calculate the number of hours
    const hours = Math.floor(remainingTime2 / (1000 * 60 * 60));

    // Calculate the remaining time in milliseconds after subtracting hours
    const remainingTime3 = remainingTime2 - hours * (1000 * 60 * 60);

    // Calculate the number of minutes
    const minutes = Math.floor(remainingTime3 / (1000 * 60));

    if (months == 3) return '3 Months'
    return ((months ? months > 1 ? `${months} Months, ` : `${months} Month, ` : '')
      + (days ? days > 1 ? `${days} Days, ` : `${days} Day, ` : '')
      + (hours ? hours > 1 ? `${hours} Hours, ` : `${hours} Hour, ` : '')
      + (minutes > 1 ? `${minutes} Minutes` : `1 Minute`))
  }
}
