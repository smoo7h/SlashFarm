import BigNumber from 'bignumber.js'

export { default as formatAddress } from './formatAddress'

export const bnToDec = (bn: BigNumber, decimals = 6): number => {
  return bn.dividedBy(new BigNumber(10).pow(decimals)).toNumber()
}
