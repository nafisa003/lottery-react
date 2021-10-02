import './App.css';
import web3 from './web3';
import lottery from './lottery';
import { useEffect, useState } from 'react';
function App() {
  
  // const acc=async()=>{
  //   const accounts=await web3.eth.getAccounts();
  //   console.log(accounts)
  // }
  // acc();

  const [manager,setManager]=useState('');
  const [players,setPlayers]=useState([]);
  const [balance,setBalance]=useState('');
  const [value,setValue]=useState('');
  const [transactionStatus,setTransactionStatus]=useState('');
  useEffect(()=>{
    (async()=>{
      const managerData=await lottery.methods.manager().call();
      setManager(managerData);
    }
    )();
  },[]);

  useEffect(()=>{
    (async()=>{
     const playersData=await lottery.methods.getPlayers().call();
     const balanceData=await web3.eth.getBalance(lottery.options.address);//returns WEI
     setPlayers(playersData);
     setBalance(balanceData);

    }
    )();
  },[players])

  const handleValueChange=(e)=>{
    setValue(e.target.value);
  };

  const handleSubmit=async (e)=>{
    e.preventDefault();
    const accounts= await web3.eth.getAccounts();

    setTransactionStatus('Waiting on transaction success...')
    await lottery.methods.enter().send({
      from:accounts[0],
      value: web3.utils.toWei(value,'ether')
    });

    setTransactionStatus('You have successfully entered into the lottery!');
  };

  const handleClick=async ()=>{
    const accounts=await web3.eth.getAccounts();

    setTransactionStatus('Waiting on transaction success...')
    await lottery.methods.pickWinner().send({
      from:accounts[0] //only manager can call this function
    });

    setTransactionStatus('A winner has been picked! Check balance!')

  }
  return (
    <div>
       <h1>Lottery Contract!</h1>
       <p>This contract is managed by <strong>{manager}</strong></p>
       <p>There are currently {players.length} people entered,
       competing to win {web3.utils.fromWei(balance,'ether')} ether! </p>
       <hr />
       <form onSubmit={handleSubmit}>
         <h3>Want to try your luck?</h3>
         <div>
           <label htmlFor="">Amount of ether to enter</label>
           <input type="text" value={value} onChange={(event)=>handleValueChange(event)} />
         </div>
         <button>Enter</button>
       </form>
       
       <hr/>
       <h4>Ready to pick a winner?</h4>
       <button onClick={handleClick}>Pick a Winner!</button>

       <hr />
       <h2>{transactionStatus}</h2>
    </div>
  );
}

export default App;
