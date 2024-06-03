export const getTokenQuantities = (tokens: { money: number }) => {
  const quantities = []

  if (tokens.money > 0) {
    quantities.push(tokens.money.toFixed(4).toString() + ' MWM')
  }

  return quantities
}
