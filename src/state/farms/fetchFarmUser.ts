import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import trc20ABI from 'config/abi/trc20.json'
import masterchefABI from 'config/abi/masterchef.json'
import masterchefABItrx from 'config/abi/mastercheftrx.json'
import multicall from 'utils/multicall'
import multicalltrx from 'utils/multicalltrx'
import farmsConfig from 'config/constants/farms'
import { getMasterChefAddress, getMasterChefAddresstrx  } from 'utils/addressHelpers'

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID

function trxFarmFilter(element) { 
  return (element.chaintype === 'trx'); 
} 

function bscFarmFilter(element) { 
  return (!element.chaintype); 
} 

export const fetchFarmUserAllowances = async (account: string) => {

 
  // bsc
  const masterChefAdress = getMasterChefAddress()

  const calls = farmsConfig.filter(bscFarmFilter).map((farm) => {
    const lpContractAddress = farm.isTokenOnly ? farm.tokenAddresses[CHAIN_ID] : farm.lpAddresses[CHAIN_ID]
    return {
       address: lpContractAddress, name: 'allowance', params: [account, masterChefAdress] 
      }
  })

  const rawLpAllowances = await multicall(erc20ABI, calls)
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON()
  })

 
 //  trx
  const masterChefAdresstrx = getMasterChefAddresstrx()
  
  const callstrx = farmsConfig.filter(trxFarmFilter).map((farm) => {
    const lpContractAddress = farm.isTokenOnly ? farm.tokenAddresses[97] : farm.lpAddresses[97]
    return { address: lpContractAddress, name: 'allowance(address,address)', params: [(window as any).tronWeb.defaultAddress.base58, masterChefAdresstrx] }
  })

  const rawLpAllowancestrx = await multicalltrx(trc20ABI, callstrx)
  const parsedLpAllowancestrx = rawLpAllowancestrx.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON()
  })
  // dont  need to do this in th e end
  const concatreturnArray = parsedLpAllowances.concat(parsedLpAllowancestrx);

  return concatreturnArray
}

export const fetchFarmUserTokenBalances = async (account: string) => {
  // bsc
  const calls = farmsConfig.filter(bscFarmFilter).map((farm) => {
    const lpContractAddress = farm.isTokenOnly ? farm.tokenAddresses[CHAIN_ID] : farm.lpAddresses[CHAIN_ID]
    return {
      address: lpContractAddress,
      name: 'balanceOf',
      params: [account],
    }
  })

  const rawTokenBalances = await multicall(erc20ABI, calls)
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return new BigNumber(tokenBalance).toJSON()
  })

  // trx

  const callstrx = farmsConfig.filter(trxFarmFilter).map((farm) => {
    const lpContractAddress = farm.isTokenOnly ? farm.tokenAddresses[97] : farm.lpAddresses[97]
    return {
      address: lpContractAddress,
      name: 'balanceOf(address)',
      params: [(window as any).tronWeb.defaultAddress.base58],
    }
  })

  const rawTokenBalancestrx = await multicalltrx(trc20ABI, callstrx)
  const parsedTokenBalancestrx = rawTokenBalancestrx.map((tokenBalance) => {
    return new BigNumber(tokenBalance).toJSON()
  })

  // dont  need to do this in th e end
  const concatreturnArray = parsedTokenBalances.concat(parsedTokenBalancestrx);
  return concatreturnArray
}

export const fetchFarmUserStakedBalances = async (account: string) => {
 
  // trxFarmFilter

  const masterChefAdresstrx = getMasterChefAddresstrx()
  
  const callstrx = farmsConfig.filter(trxFarmFilter).map((farm) => {
    return {
      address: masterChefAdresstrx,
      name: 'userInfo(uint256,address)',
      params: [farm.pid , (window as any).tronWeb.defaultAddress.base58],
    }
  })

  const rawStakedBalancestrx = await multicalltrx(masterchefABItrx, callstrx)
  const parsedStakedBalancestrx = rawStakedBalancestrx.map((stakedBalance) => {
    return stakedBalance[0].toJSON()
  })
 
  return parsedStakedBalancestrx
}

export const fetchFarmUserEarnings = async (account: string) => {
  // get rid of  filter llater
  // bsc
  const masterChefAdress = getMasterChefAddress()

  const calls = farmsConfig.filter(bscFarmFilter).map((farm) => {
    return {
      address: masterChefAdress,
      name: 'pendingEgg',
      params: [farm.pid, account],
    }
  })

  const rawEarnings = await multicall(masterchefABI, calls)
  const parsedEarnings = rawEarnings.map((earnings) => {
    return new BigNumber(earnings).toJSON()
  })

  // trx

  const masterChefAdresstrx = getMasterChefAddresstrx()

  const callstrx = farmsConfig.filter(trxFarmFilter).map((farm) => {
    return {
      address: masterChefAdresstrx,
      name: 'pendingEgg(uint256,address)',
      params: [farm.pid , (window as any).tronWeb.defaultAddress.base58],
    }
  })

  const rawEarningstrx = await multicalltrx(masterchefABItrx, callstrx)
  const parsedEarningstrx = rawEarningstrx.map((earnings) => {
    return new BigNumber(earnings).toJSON()
  })


    // dont  need to do this in th e end
  const concatreturnArray = parsedEarnings.concat(parsedEarningstrx);
  return concatreturnArray
}
