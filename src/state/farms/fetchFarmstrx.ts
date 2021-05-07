import BigNumber from 'bignumber.js'
import erc20 from 'config/abi/erc20.json'
import trc20 from 'config/abi/trc20.json'
import trc20JustSwap from 'config/abi/trc20JustSwap.json'
import masterchefABI from 'config/abi/mastercheftrx.json'
import multicall from 'utils/multicall'
import multicalltrx from 'utils/multicalltrx'

import { getMasterChefAddress, getMasterChefAddresstrx } from 'utils/addressHelpers'
import farmsConfig from 'config/constants/farms'
import { QuoteToken } from '../../config/constants/types'

const CHAIN_ID = 97

function trxFarmFilter(element) { 
  return (element.pid === 0); 
} 

function bscFarmFilter(element) { 
  return (!element.chaintype); 
} 


const fetchFarmstrx = async () => {
  const data = await Promise.all(
    farmsConfig.map(async (farmConfig) => {
  
      const lpAddress = farmConfig.lpAddresses[97];

      const tokenAddress = farmConfig.tokenAddresses[97];

      const quoteTokenAddress = farmConfig.quoteTokenAdresses[97];
   
      const calls = [
        // Balance of token in the LP contract
        {
          // address: farmConfig.tokenAddresses[CHAIN_ID],
          address: tokenAddress,
          name: 'balanceOf(address)',
          params: [lpAddress],
        },
        // Balance of quote token on LP contract
        {
          // address: farmConfig.quoteTokenAdresses[CHAIN_ID],
          address: quoteTokenAddress,
          name: 'balanceOf(address)',
          params: [lpAddress],
        },
        // Balance of LP tokens in the master chef contract
        {
          // address: farmConfig.isTokenOnly ? farmConfig.tokenAddresses[CHAIN_ID] : lpAdress,
          address: farmConfig.isTokenOnly ? tokenAddress : lpAddress,
          name: 'balanceOf(address)',
          // params: [getMasterChefAddress()],
          params: [getMasterChefAddresstrx()],
          
        },
        // Total supply of LP tokens
        {
          address: lpAddress,
          name: 'totalSupply()',
          // name: 'totalSupply()',
          
        },
        // Token decimals
        {
          // address: farmConfig.tokenAddresses[CHAIN_ID],
          address: tokenAddress,
          name: 'decimals()',
        },
        // Quote token decimals
        {
          // address: farmConfig.quoteTokenAdresses[CHAIN_ID],
          address: quoteTokenAddress,
          name: 'decimals()',
        },
      ]

      const [
        tokenBalanceLP,
        quoteTokenBlanceLP,
        lpTokenBalanceMC,
        lpTotalSupply,
        tokenDecimals,
        quoteTokenDecimals
      ] = await multicalltrx(trc20JustSwap, calls)

   

      let tokenAmount;
      let lpTotalInQuoteToken;
      let tokenPriceVsQuote;

      if(farmConfig.isTokenOnly){
        tokenAmount = new BigNumber(lpTokenBalanceMC).div(new BigNumber(10).pow(tokenDecimals));
        if(farmConfig.tokenSymbol === QuoteToken.BUSD && farmConfig.quoteTokenSymbol === QuoteToken.BUSD){
          tokenPriceVsQuote = new BigNumber(1);
        }else{
          tokenPriceVsQuote = new BigNumber(quoteTokenBlanceLP).div(new BigNumber(tokenBalanceLP));
        }
        lpTotalInQuoteToken = tokenAmount.times(tokenPriceVsQuote);
      }else{
        // Ratio in % a LP tokens that are in staking, vs the total number in circulation
        const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply))

        // Total value in staking in quote token value
        lpTotalInQuoteToken = new BigNumber(quoteTokenBlanceLP)
          .div(new BigNumber(10).pow(6))
          .times(new BigNumber(2))
          .times(lpTokenRatio)

        // Amount of token in the LP that are considered staking (i.e amount of token * lp ratio)
        tokenAmount = new BigNumber(tokenBalanceLP).div(new BigNumber(10).pow(tokenDecimals)).times(lpTokenRatio)
        const quoteTokenAmount = new BigNumber(quoteTokenBlanceLP)
          .div(new BigNumber(10).pow(quoteTokenDecimals))
          .times(lpTokenRatio)

        if(tokenAmount.comparedTo(0) > 0){
          tokenPriceVsQuote = quoteTokenAmount.div(tokenAmount);
        }else{
          tokenPriceVsQuote = new BigNumber(quoteTokenBlanceLP).div(new BigNumber(tokenBalanceLP));
        }
      }

      const [info, totalAllocPoint, eggPerBlock] = await multicalltrx(masterchefABI, [
        {
          address: getMasterChefAddresstrx(),
          name: 'poolInfo(uint256)',
          params: [farmConfig.pid],
        },
        {
          address: getMasterChefAddresstrx(),
          name: 'totalAllocPoint()',
        },
        {
          address: getMasterChefAddresstrx(),
          name: 'eggPerBlock()',
        },
      ])

      const allocPoint = new BigNumber(info.allocPoint._hex)
      const poolWeight = allocPoint.div(new BigNumber(totalAllocPoint))

      return {
        ...farmConfig,
        tokenAmount: tokenAmount.toJSON(),
        // quoteTokenAmount: quoteTokenAmount,
        lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
        tokenPriceVsQuote: tokenPriceVsQuote.toJSON(),
        poolWeight: poolWeight.toNumber(),
        multiplier: `${allocPoint.div(100).toString()}X`,
        depositFeeBP: info.depositFeeBP,
        eggPerBlock: new BigNumber(eggPerBlock).toNumber(),
      }
    }),
  )
  return data
}

export default fetchFarmstrx
