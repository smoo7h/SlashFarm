import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { provider } from 'web3-core'
import cakeABI from 'config/abi/cake.json'
import { getContract } from 'utils/web3'
import { getTokenBalance } from 'utils/trc20'
import { getCakeAddress } from 'utils/addressHelpers'
import useRefresh from './useRefresh'

const useTokenBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const { fastRefresh } = useRefresh()
  const [ trxAccount, settrxAccount ] =  useState((window as any).tronWeb)

  useEffect(() => {
    const fetchBalance = async () => {
      const res = await getTokenBalance(ethereum, tokenAddress, trxAccount.defaultAddress.base58)
      setBalance(new BigNumber(res))
    }

    if (trxAccount && trxAccount.defaultAddress.base58 !== 'TYrNrk11FhuZWZEzPZTf6YqaKA6joeApaa') {
      fetchBalance()
    }
  }, [account, ethereum, tokenAddress, fastRefresh, trxAccount])

  return balance
}

export const useTotalSupply = () => {
  const { slowRefresh } = useRefresh()
  const [totalSupply, setTotalSupply] = useState<BigNumber>()

  useEffect(() => {
    async function fetchTotalSupply() {

      // gett the contract
      const cakeContract =  await (window as any).tronWeb.contract().at(getCakeAddress());
      const supply = await cakeContract.methods.totalSupply().call()
      setTotalSupply(new BigNumber(supply))
    }

    fetchTotalSupply()
  }, [slowRefresh])

  return totalSupply
}

export const useBurnedBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalance = async () => {
     
      const cakeContract =  await (window as any).tronWeb.contract().at(getCakeAddress());
      // this is the blackhole address
      const bal = await cakeContract.methods.balanceOf('TLsV52sRDL79HXGGm9yzwKibb6BeruhUzy').call()

      setBalance(new BigNumber(bal))
    }

    fetchBalance()
  }, [tokenAddress, slowRefresh])

  return balance
}

export default useTokenBalance
