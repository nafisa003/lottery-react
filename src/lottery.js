import { contract_abi, contract_address } from "./private";
import web3 from "./web3";

const address=contract_address;

const abi= contract_abi;

export default new web3.eth.Contract(abi,address); //copy of contract that exists //on blockchain
 