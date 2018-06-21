
<template>
  <div id="app">

    <headerMain
      curPair="ETH/USD"
      :pairsList="pairsList"
      :balances="bal"
    ></headerMain>

    <main class="workflow">
      <aside class="aside-left">
       
        <orederbook
        ></orederbook>

        <chat></chat>
      </aside>
      <div class="charts">
        <chart></chart>
        <depth></depth>
      </div>
      <aside class="aside-right">
        <history></history>

        <forms 
          :from="from" 
          :check="test">
            
        </forms>

      </aside>
    </main>
  </div>
</template>

<script>
  import AmCharts from 'amcharts3'
  import AmSerial from 'amcharts3/amcharts/serial'

  import {VueTabs, VTab} from 'vue-nav-tabs'
  // import 'vue-nav-tabs/themes/vue-tabs.css'

  import 'normalize.css';
  import headerMain from './components/header.vue'
  import orederbook from './components/orederbook.vue'
  import history from './components/history.vue'
  import chat from './components/chat.vue'
  import chart from './components/chart.vue'
  import depth from './components/depth.vue'
  import forms from './components/forms.vue'

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
        pairsList: ['usd/btc', 'eos/eth', 'btc/eos'],

        // orderbook/

        listBuy: [],
        listSell: [],


      }
    },
    components: {
      headerMain,
      orederbook,
      chat,
      history,
      forms,
      chart,
      depth,
      VueTabs,
      VTab,
    },
    methods: {
      
    },
    created(){

      var vueSelf = this;
      // setInterval(function () {
      //   vueSelf.getBuyOreders('0x0000000000000000000000000000000000000000', '0xc34376569aa1afbe982c4ecc6ea0d78f8077b3d0')
      //   vueSelf.getSellOreders('0xc34376569aa1afbe982c4ecc6ea0d78f8077b3d0', '0x0000000000000000000000000000000000000000')
      // }, 3000)

      this.contract = exchange.initContract(web3, settings.exchangeAbi, settings.contractAddress);

      (async function()  {
        await web3.eth.getAccounts().then(res => vueSelf.from = res[0]);
        await exchange.balanceOf(vueSelf.contract, '0x0000000000000000000000000000000000000000', vueSelf.from).then(res => vueSelf.bal[1].amount = res / 10**18)
      })()

      setInterval(function () {
        exchange.balanceOf(vueSelf.contract, '0x0000000000000000000000000000000000000000', vueSelf.from).then(res => vueSelf.bal[1].amount = res / 10**18)
      }, 3000)


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
    height: 100%;
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
