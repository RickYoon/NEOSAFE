import React from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"

import TopNav from "component/topNav"

import Landing from "pages/Landing"
import WalletManager from 'pages/Wallet'
import WalletConnectPage from "pages/Connect"
import Overview from "pages/Overview"


function App() {

  return (
    <>
      <Router>
        <Routes>
            <Route path="/" element={<TopNav />} />
            <Route path="/wallet" element={<TopNav />} />
            <Route path="/connect" element={<TopNav />} />
            <Route path="/Overview" element={<TopNav />} />
        </Routes>
        <Routes>
          <Route exact path="/" element={<Landing />} />
          <Route path="/wallet" element={<WalletManager />} />
          <Route path="/connect" element={<WalletConnectPage />} />
          <Route path="/Overview" element={<Overview />} />   
        </Routes>
      </Router>
    </>
  );
}

export default App;
