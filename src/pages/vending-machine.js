import Head from 'next/head'
import Web3 from 'web3'
import { useState, useEffect } from 'react'
import vendingMachineContract from '../../blockchain/vending'

export default function VendingMachine() {
  const [web3, setWeb3] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [account, setAccount] = useState('')
  const [vmContract ,setVmContract] = useState('')
  const [inventory, setInventory] = useState(0)
  const [myDonutCount, setMyDonutCount] = useState(0)
  const [buyCount, setBuyCount] = useState(0)

  useEffect(() => {
    if(vmContract) getInventoryHandler()
    if(vmContract && account) getMyDonutCountHandler()
  }, [vmContract, account])

  // 连接钱包
  const connectWalletHandler = async () => {
    if(window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        setAccount(account)
        const web3 = new Web3(window.ethereum)
        setWeb3(web3) 
        const accounts = await web3.eth.getAccounts()
        setAccount(accounts[0])
        const vm = vendingMachineContract(web3)
        setVmContract(vm)
      } catch (error) {
        setError(error)
      }
    } else {
      setError("Please install Metamask")
    }
  }

  // 获取库存
  const getInventoryHandler = async () => {
    const inventory = await vmContract.methods.getVendingMachineBalanace().call()
    console.log('inventory', Number(inventory.toString()));
    setInventory(Number(inventory.toString()))
  }

  // 获取账户库存
  const getMyDonutCountHandler = async () => {
    const count = await vmContract.methods.donutBalanaces(account).call()
    console.log('count', Number(count.toString()))
    setMyDonutCount(Number(count.toString()))
  }

  // 更新购买数量
  const changeHandler = (e) => {
    console.log(Number(e.target.value));
    setBuyCount(Number(e.target.value))
  }

  // 进行购买
  const buyHandler = async () => {
    try {
      await vmContract.methods.purchase(buyCount).send({
        from: account,
        value: web3.utils.toWei('0.0001', 'ether') * buyCount
      })
      setSuccess(`${buyCount} dounts purchased`)
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <Head>
        <title>VendingMachine App</title>
        <meta name="description" content="A blockchain vending app"></meta>
      </Head>
      <nav>
        <div className={`w-1/2 flex items-center justify-between mx-auto my-0`}>
          <div className={`text-2xl`}>Vending Machine</div>
          <div className={`text-right`}>
            <span>{ account }</span>
            <button onClick={ connectWalletHandler } className={`bg-sky-500 rounded-md p-2 text-white`}>Connect Wallet</button>
          </div>
        </div>
      </nav>
      <section>
        <div className={`w-1/2 flex flex-col mx-auto my-10`}>
          <div>Vending Machine Inventory: { inventory }</div>
          <div>My Balances: { myDonutCount }</div>
          <div>{ error }</div>
        </div>
      </section>
      <main>
        <div className={`w-1/2 flex flex-col mx-auto my-10`}>
          <div className={`text-2xl`}>Buy donuts</div>
          <input type="text" className={`w-1/5 border-2 border-black`} onChange={changeHandler}/>
          <button className={`w-1/5 bg-sky-500 rounded-md p-2 text-white my-2`} onClick={buyHandler}>Buy</button>
        </div>
      </main>
    </div>
  )
}