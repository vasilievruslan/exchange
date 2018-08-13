import Vue from 'vue'
import VueTabs from 'vue-nav-tabs'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'

import App from './App.vue'

import AmCharts from 'amcharts3'
import AmSerial from 'amcharts3/amcharts/serial'

import settings from './settings.json'
import exchange from './exchange.js'
import Web3 from 'web3'
import provider from './provider.js'

import workflow from './components/workflow.vue'

import VueSocketio from 'vue-socket.io';



// var web3 = new Web3(Web3.currentProvider);
// console.log(web3)

Vue.use(VueSocketio, 'https://excalibursocketdev.herokuapp.com/');

Vue.use(VueResource)
Vue.use(VueTabs)
Vue.use(VueRouter)

Vue.config.productionTip = false

var router = new VueRouter({
  routes: [
  	{path: '/:id', name: 'pair', component: workflow},
  	{path: '', redirect: settings.pairs[0].path}
  ]
})
var app = new Vue({
	data: {
		// accounts: VueWeb3.eth.accounts
	},
	// sockets:{
	//     connect(){
	//       console.log('socket connected')
	//     },
	//     ordersCollection(ordersCollection) {
	// 	   console.log('ordersCollection:', ordersCollection);
	// 	},
	// 	tradeHistoryCollection(tradeHistoryCollection) {
	// 		console.log('tradeHistoryCollection:', tradeHistoryCollection);
	// 	},
	// },
	render: h => h(App),
	router: router,	
	created() {

		var web3 = provider.connectWeb3();
	},

}).$mount('#app')

