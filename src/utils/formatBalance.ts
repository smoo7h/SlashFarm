import BigNumber from 'bignumber.js'

export const getBalanceNumber = (balance: BigNumber, decimals = 6) => {
  const displayBalance = new BigNumber(balance).dividedBy(new BigNumber(10).pow(decimals))
  return displayBalance.toNumber()
}

export const getFullDisplayBalance = (balance: BigNumber, decimals = 6) => {
  return balance.dividedBy(new BigNumber(10).pow(decimals)).toFixed()
}
