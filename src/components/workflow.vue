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
	        	:contract="contract"
	        ></orederbook>

	      </aside>

		<section class="main-section charts">
			
			<div class="window charts-tabs">
				<vue-tabs>
					<v-tab title="PRICE CHART">
						<chart :pair="pair"></chart>
					</v-tab>
					<v-tab title="DEPTH (SOON)">
						<depth></depth>
					</v-tab>
				</vue-tabs>
			</div>
	        <history
	        	ref="history"
	        	:pair="pair"
	        	:from="from">
	        </history>
		</section>
	      <aside class="aside-right">
			<forms 
				ref="forms"
				:pair="pair"
				:from="from" >
			</forms>
	        <chat></chat>
	      </aside>
	    </main>
	</div>
</template>

<script>
	import provider from '../provider.js'
	import exchange from '../exchange.js'
	import settings from '../settings.json'

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
				tabName: '',
			}
		},
		computed: {
			lastDeal(){ 
				return this.$refs.history.historyData[0];
			}, 
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
			var vm = this;
			try {
				this.contract = exchange.initContract(web3, settings.exchangeAbi, settings.exchangeAddress);
			} catch(e) {
				// statements
				console.log(e);
			}

			setInterval(function () {
				try {
					web3.eth.getAccounts().then(res => vm.from = res[0]);
				} catch(e) {
					// statements
					console.log(e);
				} 
			}, 5000)

		},
	}
</script>

<style>
	.window{
		padding: 14px 5px 5px 5px;
		background-color: #242323;
		color: #fff;
		border: 1px solid  #141414;
		box-sizing: border-box;
		overflow: scroll;
	}
	.charts{
		width: 100%;
		display: flex;
		flex-direction: column;
	}
	.charts-tabs{
		flex: 0 1 60%;
		display: flex;
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
	.aside-left{
		width: 378px;
	}
	@media screen and (max-width: 768px){
		.workflow,
		.header{
			flex-wrap: wrap;
		}
		.header{
			padding-top: 10px;
		}
		.header__balances,
		.header__langswitcher{
			display: none;
		}
		.workflow{
			padding-top: 20px;
		}
		.orederbook{
			width: 100% !important;
		}
		.forms{
			display: none;
		}
		.charts-tabs{
			height: 500px;
		}
		.main-section{
			order: 1;
		}
		.aside-left{
			order: 2;
			width: 50%;
		}
		.aside-right{
			order: 3;
			width: 50%;
		}
	}
	@media screen and (max-width: 425px){
		.aside-left,
		.aside-right{
			width: 100%;
		}
		.chat{
			width: 100%;
			flex: 0 0 400px;
		}
		.header__cotainer{
			flex-wrap: wrap;
			flex-direction: column;
		}
		.header__pairs{
			margin: 0;
		}
	}
</style>