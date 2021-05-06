import React, { useEffect, Suspense, lazy } from 'react'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import TronWeb from "tronweb";
import { ResetCSS } from '@pancakeswap-libs/uikit'
import BigNumber from 'bignumber.js'
import { useFetchPublicData } from 'state/hooks'
import GlobalStyle from './style/Global'
import Menu from './components/Menu'
import PageLoader from './components/PageLoader'
import NftGlobalNotification from './views/Nft/components/NftGlobalNotification'

// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page'
const Home = lazy(() => import('./views/Home'))
const Farms = lazy(() => import('./views/Farms'))
// const Lottery = lazy(() => import('./views/Lottery'))
// const Pools = lazy(() => import('./views/Pools'))
// const Ifos = lazy(() => import('./views/Ifos'))
const NotFound = lazy(() => import('./views/NotFound'))
// const Nft = lazy(() => import('./views/Nft'))

// This config is required for number formating
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const App: React.FC = () => {
  const FOUNDATION_ADDRESS = "TYrNrk11FhuZWZEzPZTf6YqaKA6joeApaa"; // blank address
  const { account, connect } = useWallet()
  // connect to the tron network
  const waitTron = () => {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 10;
      const checkTron = () => {

        if ((window as any).tronWeb) {
          resolve(true);
          return;
        }


        attempts++;
        if (attempts >= maxAttempts) {
          // set a default address
          const TRONGRID_API = "https://api.tronstack.io";
          (window as any).tronWeb = new TronWeb(TRONGRID_API, TRONGRID_API, TRONGRID_API);

          (window as any).tronWeb.defaultAddress = {
            hex: (window as any).tronWeb.address.toHex(FOUNDATION_ADDRESS),
            base58: FOUNDATION_ADDRESS,
          };

          resolve(true);
          return;
        }


        setTimeout(checkTron, 100);
      };
      checkTron();
    });
  };


  useEffect(() => {
    // tron stuff
    if (!(window as any).tronWeb) {
      waitTron()
      connect('injected')
    }
    // binance stuff
    if (!account && window.localStorage.getItem('accountStatus')) {

      connect('injected')
    }
  }, [account, connect])

  useFetchPublicData()

  return (
    <Router>
      <ResetCSS />
      <GlobalStyle />
      <Menu>
        <Suspense fallback={<PageLoader />}>
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route path="/farms">
              <Farms />
            </Route>
            <Route path="/pools">
              <Farms tokenMode />
            </Route>
            {/* <Route path="/pools"> */}
            {/*  <Pools /> */}
            {/* </Route> */}
            {/* <Route path="/lottery"> */}
            {/*  <Lottery /> */}
            {/* </Route> */}
            {/* <Route path="/ifo"> */}
            {/*  <Ifos /> */}
            {/* </Route> */}
            {/* <Route path="/nft"> */}
            {/*  <Nft /> */}
            {/* </Route> */}
            {/* Redirect */}
            {/* <Route path="/staking"> */}
            {/*  <Redirect to="/pools" /> */}
            {/* </Route> */}
            {/* <Route path="/syrup"> */}
            {/*  <Redirect to="/pools" /> */}
            {/* </Route> */}
            {/* 404 */}
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </Menu>
      <NftGlobalNotification />
    </Router>
  )
}

export default React.memo(App)
