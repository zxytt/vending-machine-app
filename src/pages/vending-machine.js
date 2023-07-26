import Head from 'next/head'
import Web3 from 'web3'
import { useState, useEffect } from 'react'
import vendingMachineContract from '../../blockchain/vending'

export default function VendingMachine() {
  const [web3, setWeb3] = useState('')
  const [error, setError] = useState('')
  const [account, setAccount] = useState('')
  const [vmContract ,setVmContract] = useState('')
  const [inventory, setInventory] = useState(0)

  useEffect(() => {
    if(vmContract) getInventoryHandler()
    // if(vmContract && account) getMyDonutCountHandler()
  }, [vmContract, account])

  // 连接钱包
  const connectWalletHandler = async () => {
    if(window.ethereum) {
      try {
        const account = await window.ethereum.request({ method: "eth_requestAccounts" })
        setAccount(account)
        const web3 = new Web3(window.ethereum)
        setWeb3(web3) 
        const vm = vendingMachineContract(web3)
        console.log('vm', vm);
        setVmContract(vm)
      } catch (error) {
        setError(error)
      }
    } else {
      console.log("Please install Metamask")
    }
  }

  // 获取库存
  const getInventoryHandler = async () => {
    const inventory = await vmContract.methods.getVendingMachineBalanace().call()
    console.log('inventory', inventory);
  }

  // 获取账户库存
  // const getMyDonutCountHandler = async () => {
  //   const count = await vmContract.methods.donutBalances(account).call()
  //   console.log('count', count);
  // }

  return (
    <div>
      <Head>
        <title>VendingMachine App</title>
        <meta name="description" content="A blockchain vending app"></meta>
      </Head>
      <nav>
        <div className={`w-1/2 flex items-center justify-between  mx-auto my-0`}>
          <div>
            <h1>Vending Machine</h1>
          </div>
          <div className={`text-right`}>
            <span>{ account }</span>
            <button onClick={ connectWalletHandler } className={`bg-sky-500 rounded-md p-2`}>Connect Wallet</button>
          </div>
        </div>
      </nav>
      <section>
        <div>Vending Machine Inventory: {inventory}</div>
        <div>My Balances: {}</div>
        <div>{ error }</div>
      </section>
    </div>
  )
}