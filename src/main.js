import Vue from 'vue'
import App from './App.vue'

import setings from './settings.json'
import VueTabs from 'vue-nav-tabs'

import AmCharts from 'amcharts3'
import AmSerial from 'amcharts3/amcharts/serial'

import exchange from './exchange.js'

import Web3 from 'web3'

import provider from './provider.js'

import VueResource from 'vue-resource'

import VueRouter from 'vue-router'

// var web3 = new Web3(Web3.currentProvider);
// console.log(web3)


Vue.use(VueResource)
Vue.use(VueTabs)
Vue.use(VueRouter)

Vue.config.productionTip = false


var app = new Vue({
	data: {
		// accounts: VueWeb3.eth.accounts
	},
	render: h => h(App),
	created() {

		var web3 = provider.connectWeb3();
	},

}).$mount('#app')

