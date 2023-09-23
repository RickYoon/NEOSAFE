import { Fragment, useState, useEffect } from 'react'
import { createWeb3Wallet, namespaceBuild, signClient } from '../../../utils/WalletConnectUtil.js'
import { useSelector } from 'react-redux';

const AddConnection = ({ proposalState, onClick }) => {

  const [wcuri, setWcuri] = useState('');
  const [proposalInfo, setProposalInfo] = useState({
    id : 0,
    param : {
      optionalNamespaces : {
        eip155 : {
          chains: [],
          events: [],
          methods: [],
          rpcMap:{}
        }
      },
      proposer : {
        metadata : {
          description: "",
          icons : [],
          name: "",
          url: ""
        }
      }
    }
  })

  const userAccount = useSelector(state => state.account) // main wallet address

  const handleInputChange = (event) => {
    setWcuri(event.target.value);
  };

  async function onConnect(wcuri) {
    try {
      const aa = await namespaceBuild(wcuri)
      console.log("aa", aa)

    } catch (err) {
      alert(err)
    } finally {
      setWcuri('')
    //   setLoading(false)
    }
  }


  useEffect(() => {
    let updateProposal = localStorage.getItem('context')
    let jsonProposal = JSON.parse(updateProposal)
    console.log("proposalInfo",proposalInfo)
    setProposalInfo(jsonProposal)
  
  }, [proposalState])
  
  async function onApprove() {
      try {

        // console.log("proposalInfo",proposalInfo)
        await signClient.approve({
          id : proposalInfo.id,
          relayProtocol : "irn",
          namespaces : {neo3 : { 
            accounts : [`neo3:testnet:${userAccount}`],
            chains : ['neo3:testnet'],
            events : [],
            methods : ['invokeFunction', 'testInvoke', 'signMessage', 'verifyMessage']
          }
        }}
        )

        await onClick()


      } catch (e) {
        console.log("e",e )
      }      

  }

  async function onSessions() {
    try {
      const aa = await signClient.session.getAll()
      const bb = await signClient.pairing.getAll()
    } catch (e) {
    }      

}

async function openHandler () {
  window.open('https://lend-main.flamingo-n3-testnet.pages.dev/', '_blank')
}

  return (
    <div>
      <div className="rounded-xl shadow-lg bg-white lg:border-t-10 lg:w-[450px]" style={{marginTop:"25px"}}>
        <div className="py-8 px-8">
          <div className="max-w-sm mx-auto lg:max-w-none">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Add Conection
            </h1>
          </div>
      
        <Fragment>

          <div style={{paddingTop:"20px"}}>
            <div className="border border-10 p-5">
              <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Wallet-Connect Link</label>
              <input
                type="text"
                name="wc"
                id="wc"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="e.g. wc:123jkl12k..."
                value={wcuri}
                onChange={handleInputChange}
              />
              <button onClick={() => onConnect(wcuri)} class="mt-5 w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Connection Review</button>
            </div>
          </div>

          {proposalState && proposalInfo.id > 0 ? 
            <>
              <div style={{paddingTop:"20px"}}>
                <div className="border border-10 p-5">
                  <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Protocol Info</label>
                  <hr/>
                  
                  <div className="pt-5 flex flex-row items-center">
                    <img class="w-10 h-10 rounded-full" src={proposalInfo.params.proposer.metadata.icons[0]} alt="Rounded avatar" />
                    <div className="pl-5 flex flex-col">
                      <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{proposalInfo.params.proposer.metadata.description}</label>
                      <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{proposalInfo.params.proposer.metadata.name}</label>
                      <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{proposalInfo.params.proposer.metadata.url}</label>
                    </div>
                  </div>

                  <button
                    class="mt-5 w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    auto
                    flat
                    color="success"
                    onClick={onApprove}
                  >
                    Approve
                  </button>

                </div>
              </div>
            </>
            :
            <>
            <div style={{paddingTop:"20px"}}>
            <div className="border border-10 p-5">
              <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">* How to connect ?</label>
              <hr/>

              <div className="pt-5 flex flex-row items-center">
                <div className="pl-5 flex flex-col">
                  <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">1. go to dapp (ex. Flamingo Finance, bNEO...)</label>
                  <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">2. select Neon Wallet</label>
                  <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">3. Copy Link</label>
                  <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">4. Paste Link and Click Connect review</label>
                </div>
              </div>
              


            </div>
          </div>
          </>
          }

        </Fragment>
        
        <div></div>

        <div className="">
            <label class="block text-sl font-medium text-gray-900 dark:text-white pl-3 ">Dapps</label>
            <div className="w-full" onClick={openHandler}>
                <div className="lg:flex flex-wrap items-center justify-start">            
                    <div className="m-2 lg:w-[25rem] hover:bg-blue-50 hover:border-primary-700 cursor-pointer border p-5 rounded-xl shadow-lg bg-white transition duration-300 ease-in-out" style={{height:"250px"}}>    
                        <div className="flex items-center border-b border-gray-200 pb-6">
                            <img src="https://flamingo.finance/img/tokens/circle/FLM.svg" alt className="w-12 h-12 rounded-full" />
                            <div className="flex items-start justify-between w-full">
                                <div className="pl-3 w-full">
                                    <p className="text-xl font-medium leading-5 text-gray-800">Flamingo Finance</p>
                                    <p className="text-sm leading-normal pt-2 text-gray-500">flamingo.finance</p>
                                </div>
                            </div>
                        </div>
                        <div className="px-2">
                            <p className="text-xm leading-5 py-4 text-gray-600">The Flamingo DeFi platform helps you convert tokens, provide liquidity, and earn yield through staking.</p>
                            <div className="flex">
                                <div className="py-2 px-4 text-xs leading-3 text-indigo-700 rounded-full bg-indigo-100">#DEX</div>
                                <div className="py-2 px-4 ml-3 text-xs leading-3 text-indigo-700 rounded-full bg-indigo-100">#CDP</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>

        
        </div>
      </div>
    </div>
  );
};


export default AddConnection;
