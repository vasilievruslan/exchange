
<template>
  <div id="app">

    <!-- <headerMain
      curPair="ETH/USD"
      :pairsList="pairsList"
      :balances="bal"
      :contract="contract"
      :from="from"
    ></headerMain> -->


    <router-view></router-view>

    
  </div>
</template>

<script>

  import 'normalize.css';
  import headerMain from './components/header.vue'

  import provider from './provider.js'
  import exchange from './exchange.js'
  import settings from './settings.json'

  const web3 = provider.connectWeb3();



  export default {
    name: 'app',
    data: function () {
      return {
        from: '',
        contract: '',
        test: 'test',

        // header
        bal: [{
            amount: 'waiting', 
            symbol: 'eos'
          },
          {
            amount: 'waiting', 
            symbol: 'eth'
          }],

        pairsList: [
          {
            name:'usd/btc',
            path:'usd_btc'
          },
          {
            name:'eos/eth',
            path:'eos_eth'
          },
          {
            name:'btc/eos',
            path:'btc_eos'
          },
        ],

      }
    },
    components: {
      headerMain,
    },
    methods: {
      
    },
    created(){
      var vueSelf = this;

      this.contract = exchange.initContract(web3, settings.exchangeAbi, settings.contractAddress);
      
      web3.eth.getAccounts().then(res => vueSelf.from = res[0]);

    }
  }

</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Roboto+Mono:400,700');
  body{
    background-color: #141414;
  }
  #app {
    font-family: 'Roboto Mono', monospace;
    font-weight: 700;
    height: 100vh;

  }
  .charts{
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  .workflow{
    display: flex;
    justify-content: space-between;
    height: 100vh;
    padding-top: 50px;
    box-sizing: border-box;
  }
  .aside-left,
  .aside-right{
    height: 100%;
    display: flex;
    flex-direction: column;
  }
</style>
