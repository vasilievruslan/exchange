<template>
	<div>
		<keep-alive>
			<headerMain
				:contract="contract"
				:from="from"
				:pair="pair"
		    ></headerMain>
		</keep-alive>
		<main class="workflow">
	      <aside class="aside-left">
	       
	        <orederbook
	        	:pair="pair"
	        	:from="from"
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
	          :pair="pair"
	          :from="from" >
	        </forms>

	      </aside>
	    </main>
	</div>
</template>

<script>
	import provider from '../provider.js'
	import exchange from '../exchange.js'
	import settings from '../settings.json'

	import AmCharts from 'amcharts3'
	import AmSerial from 'amcharts3/amcharts/serial'

	import {VueTabs, VTab} from 'vue-nav-tabs'

	import headerMain from './header.vue'
	import orederbook from './orederbook.vue'
	import history from './history.vue'
	import chat from './chat.vue'
	import chart from './chart.vue'
	import depth from './depth.vue'
	import forms from './forms.vue'

	const web3 = provider.connectWeb3();

	export default {

		data(){
			return{
				pairs: settings.pairs,
				contract: null,
				from: null,
			}
		},
		computed: {
			pairID(){
				return this.$route.params.id
			},
			pair(){
				return this.pairs.find(x => x.path == this.pairID)
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
		created(){
			var vueSelf = this;
			this.contract = exchange.initContract(web3, settings.exchangeAbi, settings.contractAddress);
			web3.eth.getAccounts().then(res => vueSelf.from = res[0]);

		},
	}
</script>