import './App.css';
import React from 'react';
import {ABI} from "./abi.js";

var ethers = require('ethers');
let contract;
let contractWithSigner

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            billboard: '',
            price: '',
            isLoading: false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

  loadBlockchain(){
    var abi = ABI;
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = provider.getSigner();
    console.log(provider);
    contract = new ethers.Contract("0x1B8aC26956657f2294aE8fB5D2c6408D606b7Bf0", abi, provider);
    contractWithSigner = contract.connect(signer);
    this.updateState();
  }
  async updateState(){
    let newWord = await contract.phrase();
    let curPrice = await contract.curprice();
    curPrice = ethers.utils.formatEther(curPrice._hex);
    console.log(newWord);
        this.setState({
            billboard: newWord,
            price: curPrice,
            isLoading: false
        })

  }
  componentDidMount(){
    this.loadBlockchain();
  }

  async handleSubmit(event){
    event.preventDefault();
    if(event.target.price.value === 0){
        this.setState({
            isError: true
        })
    } else {
    this.setState({
            isError: false,
            isLoading: true
        })
        contractWithSigner.changeBillboard(event.target.phrase.value, {
        value: ethers.utils.parseEther(event.target.price.value),
                                                      gasLimit: 100000}).catch(error => {
                                                          console.log(error);
                                                          this.setState({
                                                            isError: true
                                                          })
                                                      });
                                                     }
        await this.updateState();

  }

  render() {
      return (
        <div className="App">
          <h1>Pay me to change Billboard</h1>
          <h2>{this.state.billboard}</h2>
          <h2>Price: {this.state.price}</h2>
          {this.state.isError && <h3 id="errortext">You need to send more money than the current price!</h3>}
          {this.state.isLoading && <h3 id="loadingtext">Transaction Loading...</h3>}
          <form onSubmit={this.handleSubmit}>
          <label>Phrase</label>
          <input type="text" name="phrase"/><br/><br/>
          <label>Your Price</label>
          <input type="number" step="any" name="price"/><br/>
          <input type="submit" value="submit"/>
          </form>
          <p>Please refresh the page 10 seconds after a completed transaction :)</p>
        </div>
      );
  }
}

export default App;
