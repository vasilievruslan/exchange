<template>
	<div class="window orederbook">
		<div v-if="buyFrom == true" class="orederbook__form">
			<div class="orederbook__form-title">
				<div>{{formData.orderType.toUpperCase()}}</div>
				<div @click="closeForm" class="close-btn">
					<svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 10 10">
						<g transform="matrix(1,0,0,1,-351,-64)">
							<path d="M352,72.07107l3.18198,-3.18198l-3.18198,-3.18198l0.7071,-0.70711l3.18198,3.18198l3.18198,-3.18198l0.7071,0.70711l-3.18198,3.18198l3.18198,3.18198l-0.70711,0.7071l-3.18197,-3.18198l-3.18198,3.18198z" fill-opacity="0" fill="#ffffff" stroke-linejoin="miter" stroke-linecap="butt" stroke-opacity="1" stroke="#ffffff" stroke-miterlimit="50" stroke-width="1" id="Path-0"/>
						</g>
					</svg>
				</div>
			</div>
			<form class="orederbook__form-container">
				<div>ORDER</div>
				<div class="orderbook-item flex-item">
					<div class="orderbook-col">
						<div class="od-title">TOTAL</div>
						<div class="od-amount">{{formData.amountGet / 10**18}} {{pair.symbols[1].toUpperCase()}}</div>
						<div class="od-title">PRICE</div>
						<div class="od-amount">{{formData.price}}</div>
						<div class="od-title">AMOUNT</div>
						<div class="od-amount">{{formData.amountGive / 10**18}} {{pair.symbols[0].toUpperCase()}}</div>
					</div>
					<div class="orderbook-col">
						<div class="od-title">EXPIRES</div>
						<div class="od-amount">{{formData.expires}}</div>
						<div class="od-title">ADDRESS</div>
						<div class="od-amount">{{formData.address}}</div>
					</div>
				</div>
				<div class="orderbook-item">
					<div>AMOUNT to {{formData.orderType}}</div>
					<div class="input-container"><input v-model="formData.amountToBuy" type="number"><span>{{ pair.symbols[0].toUpperCase()}}</span></div>
				</div>
				<div class="orderbook-item">
					<button class="buy-btn" @click="trade" :class="formData.orderType">{{formData.orderType.toUpperCase()}}</button>
				</div>
			</form>
		</div>
		<vue-tabs v-if="buyFrom !== true">
			<v-tab title="ORDERBOOK">
				<div class="orederbook-wrap">
					<div class="orederbook__table orederbook__titles row">
						<div class="col orederbook__titles-item">AMOUNT</div>
						<div class="col orederbook__titles-item">PRICE</div>
						<div class="col orederbook__titles-item">FIAT</div>
					</div>
					<div class="orederbook__container">
						<div class="orederbook__table buy">
							<div v-for="(item, index) in listBuy" @click="doBuyOrder(index)" v-bind:data-hash="item.hash" class="buy row">
								<div class="col value"><span class="value-bar"></span></div>
								<div class="col AMOUNT">{{item.amountGet / 10**18}}</div>
								<div class="col PRICE">{{(item.amountGive / 10**18) / (item.amountGet / 10**18)}}</div>
								<div class="col FIAT">$</div>
							</div>
						</div>
						<div class="orederbook__spread">
							<div class="spread">spread</div>
							<div class="spread-val">0.00123</div>
						</div>
						<div class="orederbook__table sell">
							<div v-for="(item, index) in listSell" @click="doSellOrder(index)" v-bind:data-hash="item.hash" class="sell row">
								<div class="col value"><span class="value-bar"></span></div>
								<div class="col AMOUNT">{{item.amountGive / 10**18}}</div>
								<div class="col PRICE">{{item.amountGet / item.amountGive}}</div>
								<div class="col FIAT">$</div>
							</div>
						</div>
					</div>
				</div>
			</v-tab>
			<v-tab title="PERSONAL OB">
				<div class="orederbook-wrap">
					<div class="orederbook__table orederbook__titles row">
						<div class="col">AMOUNT</div>
						<div class="col">PRICE</div>
						<div class="col">FIAT</div>
					</div>
					<div class="orederbook__container">
						<div class="orederbook__table">
							<div v-for="(item, index) in personalOrders" v-bind:data-hash="item.hash" class="buy row">
								<div class="col value"><span class="value-bar"></span></div>
								<div class="col AMOUNT">{{item.amountGet / 10**18}}</div>
								<div class="col PRICE">{{(item.amountGive/10**18) / (item.amountGet / 10**18)}}</div>
								<div class="col FIAT">$</div>
							</div>
						</div>
					</div>
				</div>
			</v-tab>
		</vue-tabs>
	</div>
</template>

<script>

	import provider from '../provider.js'
	import exchange from '../exchange.js'
	import settings from '../settings.json'
	import ethjs from 'ethereumjs-util'

	const web3 = provider.connectWeb3();

	export default{
		name: 'orederbook',
		data() {
			return {
				listBuy: [],
				listSell: [],
				tokenGetAddress: this.pair.tokens[0],
				tokenGiveAddress: this.pair.tokens[1],
				personalOrders: null,
				buyFrom: false,
				formData: {
					amountGet: null,
					price: null,
					amountGive: null,
					expires: null,
					address: null,
					amountToBuy: null,
					orderType: null,
					tokenGet: null,
					tokenGive: null,
					nonce: null,
					sig: null,
				}
			}
		},
		props: {
			pair: Object,
			from: String,
			contract: Object,
		},
		watch: {
			pair(){
				this.tokenGetAddress = this.pair.tokens[0];
				this.tokenGiveAddress = this.pair.tokens[1];
			}
		},
		methods: {
			doBuyOrder(i){
					this.formData.amountGet = this.listBuy[i].amountGive;
					this.formData.price = this.listBuy[i].amountGive / this.listBuy[i].amountGet;
					this.formData.amountGive = this.listBuy[i].amountGet;
					this.formData.expires = this.listBuy[i].expires;
					this.formData.address = this.listBuy[i].maker;
					this.formData.amountToBuy = this.listBuy[i].amountGet;
					this.formData.orderType = 'sell';
					this.formData.tokenGet = this.pair.tokens[1];
					this.formData.tokenGive = this.pair.tokens[0];
					this.formData.nonce = this.listBuy[i].nonce;
					this.buyFrom = true;	
					this.formData.sig = this.listBuy[i].sig
			},
			doSellOrder(i){
					this.formData.price = this.listSell[i].amountGet / this.listSell[i].amountGive;
					this.formData.expires = this.listSell[i].expires;
					this.formData.address = this.listSell[i].maker;
					this.formData.orderType = 'buy';
					this.formData.tokenGet = this.pair.tokens[1];
					this.formData.amountToBuy = this.listSell[i].amountGive / 10**18;
					this.formData.tokenGive = this.pair.tokens[0];
					this.formData.amountGet = this.listSell[i].amountGet;
					this.formData.amountGive = this.listSell[i].amountGive;
					this.buyFrom = true;
					this.formData.nonce = this.listSell[i].nonce;
					this.formData.sig = this.listSell[i].sig
			},
			trade(e){
				e.preventDefault()
				const vm = this;
				(async function () {
					var rsv = exchange.rsv(web3, vm.formData.sig);
					var data = {
						contract: vm.contract,
						from: vm.from,
						tokenGet: vm.formData.tokenGet,
						amountGet: vm.formData.amountGet,
						tokenGive: vm.formData.tokenGive,
						amountGive: vm.formData.amountGive,
						expires: vm.formData.expires,
						nonce: vm.formData.nonce,
						user: vm.formData.address,
						v: rsv.v,
						r: rsv.r,
						s: rsv.s,
						amount: vm.formData.amountToBuy,
					}
					console.log(data)
					await exchange.trade(
						data.contract, 
						data.from,
						data.tokenGet, 
						data.amountGet, 
						data.tokenGive, 
						data.amountGive, 
						data.expires, 
						data.nonce, 
						data.user, 
						data.v, 
						data.r, 
						data.s, 
						data.amount).then(res=> console.log(res), err=> console.log(err))
				})()
				vm.buyFrom = false;
			},
			closeForm(){
				this.buyFrom = false;
			},
			getOreders() {
				const vm = this;

				this.$http.get(`https://exapi1.herokuapp.com/v0.1/orders?tget=${vm.tokenGetAddress}&tgive=${vm.tokenGiveAddress}&page=0`).then(response => {
					vm.listBuy = response.body._items
				}, response => {
					console.log(response)
				});

				this.$http.get(`https://exapi1.herokuapp.com/v0.1/orders?tget=${vm.tokenGiveAddress}&tgive=${vm.tokenGetAddress}&page=0`).then(response => {
					vm.listSell = response.body._items
				}, response => {
					console.log(response)
				});
			},
			getPersonalOreders(){
				const vm = this;
				this.$http.get(`https://exapi1.herokuapp.com/v0.1/personalOrders?tget=${vm.tokenGetAddress}&tgive=${this.tokenGiveAddress}&maker=${vm.from}&page=0`)
				.then(res => {
					vm.personalOrders = res.body._items
				}, err => {
					console.log(err)
				});
			}
	    },
	    created() {
	    	var vm = this;
	    	vm.getOreders()
			setInterval(function () {
				vm.getOreders();
				vm.getPersonalOreders();
			}, 10000)
	    },
	}
</script>

<style lang="scss">
	.orderbook-col{
		max-width: 50%;
	}
	.od-title{
		margin-bottom: 8px;
	}
	.od-amount{
		word-wrap: break-word;
		color: #ffffff;
		margin-bottom: 5px;
	}
	.window{
		margin: 1px;
		padding: 14px 5px 5px 5px;
		background-color: #242323;
		color: #fff;
		border: 1px solid  #141414;
		box-sizing: border-box;
	}
	.orderbook-item{
		margin: 28px 0px;
	}
	.orederbook__form-title{
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-left: 14px;
		padding-bottom: 13px;
		flex: 1 20px;
	}
	.orederbook__form-container{
		background-color: #2c2c2c;
		padding: 14px 22px;
		padding-bottom: 3px;
		font-size: 14px;
		font-weight: 400;
		color: #aeaeae;
		flex: 0 100%;
		overflow-x: scroll;
	}
	.close-btn{
		padding: 0px 14px;
		cursor: pointer;
	}
	.buy-btn{
		font-size: 14px;
		font-weight: 700;
		text-transform: uppercase;
		color: #fff;
		background-color: #0be881;
		padding: 12px 110px;
		display: block;
		margin: 0 auto;
		border: none;
		outline: none;
		cursor: pointer;
		&.sell{
			background-color: #ff5e57;
		}
	}
	.input-container{
		position: relative;
		margin: 13px 0px;
		input{
			border-radius: 3px;
			border: 1px solid #7a7a7a;
			background-color: #474747;
			display: block;
			width: 100%;
			box-sizing: border-box;
			color: #fff;
			padding: 14px 25px;
			outline: none;
		}
		span{
			position: absolute;
			right: 25px;
			top: 50%;
			transform: translateY(-50%);
		}
	}
	.orederbook__form{
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.orederbook{
		width: 378px;
		font-size: 17px;
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	.orederbook-wrap{
		background-color: #2c2c2c;
		font-size: 14px;
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.orederbook__titles{
		color: #aeaeae;
		flex: 1 43px;
		.col{
			text-transform: uppercase;
			padding: 10px 0px 15px;
			font-size: 14px;
		}
	}
	.orederbook__container{
		flex: 0 100%;
		height: 445px;
		overflow: scroll;
		-ms-overflow-style: none;  // IE 10+
    	overflow: -moz-scrollbars-none;  // Firefox
    	&::-webkit-scrollbar { 
    		display: none;
    	}

	}
	.orederbook__spread{
		background-color: #474747;
		color: #fff;
		display: flex;
		padding: 5px 17px;
		margin: 6px 0px;
		.spread{
			text-transform: uppercase;
		}
		.spread-val{
			text-align: center;
			flex-grow: 3;
		}
	}
	.row{
		display: flex;
		justify-content: flex-end;
		position: relative;
		.col{
			width: 33%;
			text-align: center;
			&.value{
				position: absolute;
				left: 0;
				height: 15px;
			}
		}
	}
	.orederbook__table{
		.buy .value{
			background-color: #0be881;
		}
		.sell .value{
			background-color: #ff5e57;
		}
		.row{
			padding-left: 30px;
		}
		.buy, .sell{
			font-weight: 400;
			.value{
				position: absolute;
				top: 50%;
				left: 0;
				transform: translateY(-50%);
				width: 3px;
				height: 9px;
			}
			&.row{
				padding: 5px;
				cursor: pointer;
				position: relative;
				&:hover{
					background-color: #242323;
				}
			}
		}
		.sell{
			padding-bottom: 5px;
			font-weight: 400;
		}
	}
</style>