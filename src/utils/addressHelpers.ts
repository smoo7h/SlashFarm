import addresses from 'config/constants/contracts'

const chainId = process.env.REACT_APP_CHAIN_ID

export const getCakeAddress = () => {
  return addresses.cake[97]
}
export const getCakeAddresstrx = () => {
  return addresses.cake[97]
}
export const getMasterChefAddress = () => {
  return addresses.masterChef[chainId]
}
export const getMasterChefAddresstrx = () => {
  return addresses.masterChef[97]
}
export const getMulticallAddress = () => {
  return addresses.mulltiCall[chainId]
}
export const getMulticallAddresstrx = () => {
  return addresses.mulltiCall[97]
}
export const getWbnbAddress = () => {
  return addresses.wbnb[chainId]
}
export const getLotteryAddress = () => {
  return addresses.lottery[chainId]
}
export const getLotteryTicketAddress = () => {
  return addresses.lotteryNFT[chainId]
}
