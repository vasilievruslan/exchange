<template>
	<div class="window forms">
		<vue-tabs>
			<v-tab title="BUY">
				<div class="forms__content">
					<form class="forms__box form__buy">
						<div class="form__buy__amount">
							<p class="input__title">AMOUNT</p>
							<p class="input__contaner --amount"><input v-model="buyAmount" placeholder="amount_" type="number"><span class="symbol-toolkit">{{pair.symbols[0]}}</span></p>
						</div>
						<div class="form__buy__price">
							<p class="input__title">PRICE</p>
							<p class="input__contaner --price"><input onClick="this.select();" v-model="buyPrice" placeholder="price_" type="number"><span class="symbol-toolkit">{{pair.symbols[1]}}</span></p>
						</div>
						<p>TOTAL = <span>{{buyTotal}}</span> {{pair.symbols[1].toUpperCase()}}</p>
						<p>CHOOSE EXPIRES: 
							<span v-for="item in expires">
								<input class="radio-btn" type="radio" :id="item.title" :value="item.blockAmount" v-model="picked">
								<label :class="{active: picked == item.blockAmount}" class="expries " :for="item.title">{{item.title}}</label>
							</span>
						</p>
						<p class="button-container"><button @click.prevent="postOrder(token1, token2, buyAmount, buyTotal, 1)" class="button">PLACE BUY ORDER</button></p>
					</form>
				</div>
			</v-tab>

			<v-tab title="SELL">
				<div class="forms__content">	
					<form class="forms__box form__sell">
						<div class="form__buy__amount">
							<p class="input__title">AMOUNT</p>
							<p class="input__contaner --amount"><input v-model="sellAmount" placeholder="amount_" type="number"><span class="symbol-toolkit">{{pair.symbols[0]}}</span></p>
						</div>
						<div class="form__buy__price">
							<p class="input__title">PRICE</p>
							<p class="input__contaner --price"><input onClick="this.select();" v-model="sellPrice" placeholder="price_" type="number"><span class="symbol-toolkit">{{pair.symbols[1]}}</span></p>
						</div>
						<p>TOTAL = <span>{{sellTotal}}</span> {{pair.symbols[1].toUpperCase()}}</p>
						<p>CHOOSE EXPIRES: 
							<span v-for="item in expires">
								<input class="radio-btn" type="radio" :id="item.title" :value="item.blockAmount" v-model="picked">
								<label :class="{active: picked == item.blockAmount}" class="expries" :for="item.title">{{item.title}}</label>
							</span>
						<p class="button-container"><button @click.prevent="postOrder(token2, token1, sellTotal, sellAmount, 0)" class="button sell">PLACE SELL ORDER</button></p>
					</form>
				</div>	
			</v-tab>

			<v-tab title="MANAGE">
				<div class="forms__content">
					<form class="forms__box form__manage">
						<div class="form__sell__deposit">
							<p class="input__title">DEPOSIT -><span v-for="item in tokensData"><input 
								class="radio-btn"  
								type="radio"  
								:id="item.name"  
								:value="item.token"  
								v-model="depositToken"><label  
								:class="{active: depositToken == item.token}"  
								class="expries " 
								:for="item.name">{{item.name}}</label></span>[choose currency]</p>
								<p class="input__contaner --amount"><input v-model="depositAmount" placeholder="amount_" type="number"><button v-on:click="deposit" class="btn btn_deposit">SEND</button></p>
						</div>
					</form>
					<form class="forms__box form__manage">
						<div class="form__sell__withdraw">
							<p class="input__title">WITHDRAW -><span v-for="item in tokensData"><input
								class="radio-btn" 
								type="radio" 
								:id="item.token" 
								:value="item.token" 
								v-model="withdrawToken"><label 
								:class="{active: withdrawToken == item.token}" 
								class="expries" 
								:for="item.token">{{item.name}}</label></span>[choose currency]</p>
							<p class="input__contaner --amount"><input v-model="withdrawAmount" placeholder="amount_" type="number"><button v-on:click="withdraw" class="btn btn_deposit">SEND</button></p>
						</div>
					</form>
				</div>
			</v-tab>
		</vue-tabs>

		<alert ctx="error" :title="errorTitle" v-show="popup">
			<div class="reslove-container">
				<div class="reslove">
					<div>PLEASE CHECK:</div>
					<ul>
						<li>* BALANCE</li>
						<li>* ORDER AMOUNT</li>
						<li>* METAMASK CONNECTION</li>
					</ul>
				</div>

				<div class="support-btn">SUPPORT</div>
			</div>
		</alert>
	</div>
</template>

<script>
	
	import provider from '../provider.js'
	import exchange from '../exchange.js'
	import settings from '../settings.json'
	import alert from "./alert.vue"

	const web3 = provider.connectWeb3();

	export default {
		name: 'forms',
		data(){
			return {
				settings: settings,
				depositToken: this.pair.tokens[0],
				withdrawToken: this.pair.tokens[0],
				buyAmount: '',
				buyPrice: '',
				sellAmount: '',
				sellPrice: '',
				depositAmount: null,
				withdrawAmount: null,
				contract: null,
				hash: null,
				sign: null,

				token1: this.pair.tokens[0],
				token2: this.pair.tokens[1],

				spender: settings.exchangeAddress,

				picked: '',

				popup: false,

				error: '',
				errorTitle: ''
			}
		},
		components: {
			alert,
		},
		computed: {
			blockSpeed(){ return this.settings.blockSpeed},
			expires(){
				return [
					{
						title: '1H',
						blockAmount: parseFloat((3600 / this.blockSpeed).toFixed(0)),
					},
					{
						title: '1D',
						blockAmount: parseFloat((86400 / this.blockSpeed).toFixed(0)),
					},
					{
						title: '1W',
						blockAmount: parseFloat((604800 / this.blockSpeed).toFixed(0)),
					}
				]
			},
			lastDeal(){
				return this.$parent.lastDeal
			},
			tokensData(){
				return [
					{
						name: this.pair.symbols[0],
						token: this.pair.tokens[0],
					},
					{
						name: this.pair.symbols[1],
						token: this.pair.tokens[1],
					}
				]
			},
			resource() {
	            return this.$resource('https://exapi1.herokuapp.com/v0.1/pushOrder')
	        },
			buyTotal(){
				return this.buyAmount * this.buyPrice; 
			},
			sellTotal(){
				return this.sellAmount * this.sellPrice; 
			},
		},
		watch: {
			lastDeal(){
				this.getPrice();
			},
			tokensData(){
				this.depositToken = this.pair.tokens[0];
				this.withdrawToken = this.pair.tokens[0];
			},
			pair(){
				this.buyPrice = '';
				this.sellPrice = '';
				this.token1 = this.pair.tokens[0];
				this.token2 = this.pair.tokens[1];
				console.log("something changed")
				this.getPrice();
			}
		},
		props:{
			pair: Object,
			from: String,
		},
		methods: {
			closePopup(){
				this.popup = false
			},
			getPrice(){
				const vm = this;
				try {
					vm.buyPrice = vm.buyPrice == '' ? vm.lastDeal.price : vm.buyPrice;
					vm.sellPrice = vm.sellPrice == '' ? vm.lastDeal.price : vm.sellPrice;
				} catch(e) {
					console.log(e);
				}
			},
			deposit(e) {
				const vueSelf = this
				e.preventDefault();
				if (this.depositToken == '0x0000000000000000000000000000000000000000') {
					exchange.deposit(this.contract, this.from, this.depositAmount * 10**18).then(res => alert(res), err => console.log(err))
				}else{
					(async function () {
						const contract = exchange.initContract(web3, settings.tokenAbi, vueSelf.depositToken)
						console.log(contract)
						await exchange.depositToken(vueSelf.contract, contract, vueSelf.from, vueSelf.spender, vueSelf.depositToken, vueSelf.depositAmount * 10**18).then(res => console.log(res), err => console.log(err))
					})()
				}
				
			},
			withdraw(e) {
				e.preventDefault();
				if (this.withdrawToken == '0x0000000000000000000000000000000000000000') {
					exchange.withdraw(this.contract, this.from, this.withdrawAmount * 10**18).then(res => console.log(res), err => console.log(err))
				}else{
					exchange.withdrawToken(this.contract, this.from, this.withdrawToken, this.withdrawAmount * 10**18).then(res => console.log(res), err => console.log(err))
				}
			},
			postOrder(tokenGet, tokenGive, amountGet, amountGive, orderType){
				const vm = this;
				(async function(){
					var nonce = Math.floor(Math.random() * 1000000) + 100
					var expires = null;
					await web3.eth.getBlockNumber().then(res => expires = res + parseFloat(vm.picked))
					await exchange.getSign(web3, vm.from, settings.exchangeAddress, tokenGet.toLowerCase(), amountGet * 10**18, tokenGive.toLowerCase(), amountGive * 10**18, expires, nonce)
					.then(res => vm.sign = res)
					await vm.resource.save({
						"maker": vm.from.toLowerCase(),
						"tokenGet": tokenGet.toLowerCase(),
						"amountGet": parseFloat(amountGet) * 10**18,
						"tokenGive": tokenGive.toLowerCase(),
						"amountGive": parseFloat(amountGive) * 10**18,
						"expires": expires,
						"nonce": parseFloat(nonce),
						"sig": vm.sign,
						"orderType": orderType
					})
					.then(res => {
						if (res.status !== 200) {
							this.popup = true;
							this.errorTitle = "INVALID ORDER ( Error " + res.status + ")"
						}
					})
					.catch(err => {
						console.log(err)
						vm.error = err.body; 
						vm.popup = true
						vm.errorTitle = "INVALID ORDER (Error " + err.status + ")"
					})
				})()
			},

		},
		created(){
			try {
				this.contract = exchange.initContract(web3, settings.exchangeAbi, settings.exchangeAddress);
			} catch(e) {
				// statements
				console.log(e);
			}

			this.picked = this.expires[0].blockAmount;
		},

	}
</script>

<style lang="scss">
	.reslove-container{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.support-btn{
		width: 245px;
		background-color: #0be881;
		text-align: center;
		box-sizing: border-box;
		padding: 12px;
		cursor: pointer;
		color: #474747;
	}
	.reslove{
		font-size: 12px;
		ul{
			list-style-type: none;
			padding: 0
		}
	}
	.btn{
		background-color: #0be881;
		color: #474747;
		border: none;
		border-radius: 3px;
		width: 100px;
		text-align: center;
		outline: none;
		cursor: pointer;

		&:active{
			box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.5);
		}
	}
	.radio-btn{
		display: none;
	}
	.nav-tabs{
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;

	}
	.forms__box{
		max-width: 350px;
		margin: 0 auto;
	}
	.tab{
		padding: 6px;
		width: 100%;
		text-align: center;
		&.active{
			background-color: #2c2c2c;
		}
		a{
			color: #fff;
			text-decoration: none;
		}
	}
	.forms{
		flex: 1 0 60%;
		display: flex;
	}
	.tabs__item{
		text-transform: uppercase;
	}
	.forms__content{
		background-color: #2c2c2c;
		padding: 22px;
		font-size: 14px;
		overflow: scroll;
		flex: 1;
	}
	.input__title{
		color: #aeaeae;
	}
	.symbol-toolkit{
		position: absolute;
		text-transform: uppercase;
		color: #aeaeae;
		right: 25px;
		top: 50%;
		transform: translateY(-50%);
	}
	.input__contaner{
		box-sizing: border-box;
		display: flex;
		position: relative;
		input{
			display: block;
			box-sizing: border-box;
			border-radius: 3px;
			border: 1px solid #7a7a7a;
			background-color: #474747;
			padding: 12px 25px;
			width: 100%;
			color: #fff;
			outline: none;
		}
	}
	.form__manage,
	.form__buy{
		.expries{
			&.active{
				color: #0be881;
			}
		}
	}
	.form__sell{
		.expries{
			&.active{
				color: #ff5e57;
			}
		}
	}
	.expries{
		margin: 5px;
		cursor: pointer;
		text-transform: uppercase;
	}
	.button-container{
		text-align: center;
		margin-top: 30px;
	}
	.btn_deposit{
		font-weight: 700;
	}
	.button{
		background-color: #0be881;
		border: none;
		padding: 12px;
		display: inline-block;
		box-sizing: border-box;
		text-transform: uppercase;
		color: #474747;
		min-width: 246px;
		outline: none;
		cursor: pointer;
		font-weight: 700;

		&:active{
			box-shadow: inset 0 1px 3px rgba(0,0,0,0.5);
		}
		&.sell{
			background-color: #ff5e57;
			color: #fff;
		}
	}
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		/* display: none; <- Crashes Chrome on hover */
		-webkit-appearance: none;
		margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
	}
</style>