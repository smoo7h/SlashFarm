import contracts from './contracts'
import { FarmConfig, QuoteToken } from './types'

const farms: FarmConfig[] = [
  {
    pid: 0,
    risk: 5,
    isTokenOnly: true,
    lpSymbol: 'SLSF',
    lpAddresses: {
      97: 'TMiBhEEp4qVzknHJKUWfgv1Bnut1d6DveR',
      56: '0x19e7cbecdd23a16dfa5573df54d98f7caae03019', // EGG-BUSD LP
    },
    tokenSymbol: 'SLSF',
    tokenAddresses: {
      97: 'TBPt6sq4dTdmPeBS4Lq5y2bx4wYmEzA9qb',
      56: '0xf952fc3ca7325cc27d15885d37117676d25bfda6',
    },
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
    chaintype: 'trx'
  },
  {
    pid: 1,
    risk: 5,
    lpSymbol: 'SLSF-TRX LP',
    lpAddresses: {
      97: 'TMiBhEEp4qVzknHJKUWfgv1Bnut1d6DveR',
      56: '0xd1b59d11316e87c3a0a069e80f590ba35cd8d8d3',
    },
    tokenSymbol: 'SLSF',
    tokenAddresses: {
      97: 'TBPt6sq4dTdmPeBS4Lq5y2bx4wYmEzA9qb',
      56: '0xf952fc3ca7325cc27d15885d37117676d25bfda6',
    },
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
    chaintype: 'trx'
  },
  {
    pid: 2,
    risk: 3,
    lpSymbol: 'USDT-TRX LP',
    lpAddresses: {
      97: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE',
      56: '0x1b96b92314c44b159149f7e0303511fb2fc4774f',
    },
    tokenSymbol: 'USDT',
    tokenAddresses: {
      97: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
      56: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c', // wbnb was there origionally
    },
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
    chaintype: 'trx'
  },
  {
    pid: 3,
    risk: 5,
    isTokenOnly: true,
    lpSymbol: 'TEWKEN',
    lpAddresses: {
      97: 'TWqpMi6TMrCqLuaSmb8X9XJD3kmbAfurTb',
      56: '0x19e7cbecdd23a16dfa5573df54d98f7caae03019', // EGG-BUSD LP
    },
    tokenSymbol: 'TEWKEN',
    tokenAddresses: {
      97: 'TBhxyECmAg3uCqqmEHQvGJbrgj9cn1yMZ1',
      56: '0xf952fc3ca7325cc27d15885d37117676d25bfda6',
    },
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
    chaintype: 'trx'
  }
]


export default farms
