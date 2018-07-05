<template>
	<div class="window forms">
		<vue-tabs>
			<v-tab title="BUY">
				<div class="forms__content">
					<form class="forms__box form__buy">
						<div class="form__buy__amount">
							<p class="input__title">AMOUNT</p>
							<p class="input__contaner --amount"><input v-model="buyAmount" placeholder="amount" type="number"><span class="symbol-toolkit">{{pair.symbols[0]}}</span></p>
						</div>
						<div class="form__buy__price">
							<p class="input__title">PRICE</p>
							<p class="input__contaner --price"><input v-model="buyPrice" placeholder="price" type="number"><span class="symbol-toolkit">{{pair.symbols[1]}}</span></p>
						</div>
						<p>TOTAL = <span>{{buyTotal}}</span> {{pair.symbols[1].toUpperCase()}}</p>
						<p>CHOOSE EXPIRES: 
							<span v-for="item in expires">
								<input class="radio-btn" type="radio" :id="item.title" :value="item.blockAmount" v-model="picked">
								<label :class="{active: picked == item.blockAmount}" class="expries " :for="item.title">{{item.title}}</label>
							</span>
						</p>
						<p class="button-container"><button v-on:click="postBuyOrder" class="button">PLACE BUY ORDER</button></p>
					</form>
				</div>
			</v-tab>

			<v-tab title="SELL">
				<div class="forms__content">	
					<form class="forms__box form__sell">
						<div class="form__buy__amount">
							<p class="input__title">AMOUNT</p>
							<p class="input__contaner --amount"><input v-model="sellAmount" placeholder="amount" type="number"><span class="symbol-toolkit">{{pair.symbols[0]}}</span></p>
						</div>
						<div class="form__buy__price">
							<p class="input__title">PRICE</p>
							<p class="input__contaner --price"><input v-model="sellPrice" placeholder="" type="number"><span class="symbol-toolkit">{{pair.symbols[1]}}</span></p>
						</div>
						<p>TOTAL = <span>{{sellTotal}}</span> {{pair.symbols[1].toUpperCase()}}</p>
						<p>CHOOSE EXPIRES: 
							<span v-for="item in expires">
								<input class="radio-btn" type="radio" :id="item.title" :value="item.blockAmount" v-model="picked">
								<label :class="{active: picked == item.blockAmount}" class="expries " :for="item.title">{{item.title}}</label>
							</span>
						<p class="button-container"><button v-on:click="postSellOrder" class="button sell">PLACE SELL ORDER</button></p>
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
								<p class="input__contaner --amount"><input v-model="depositAmount" placeholder="amount" type="number"><button v-on:click="deposit" class="btn btn_deposit">SENT</button></p>
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
							<p class="input__contaner --amount"><input v-model="withdrawAmount" placeholder="amount" type="number"><button v-on:click="withdraw" class="btn btn_deposit">SENT</button></p>
						</div>
					</form>
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

	export default {
		name: 'forms',
		data(){
			return {
				depositToken: this.pair.tokens[0],
				withdrawToken: this.pair.tokens[0],
				expires: [
					{
						title: '1H',
						blockAmount: 8839118
					},
					{
						title: '1D',
						blockAmount: 8839119
					},
					{
						title: '1W',
						blockAmount: 8839120
					}
				],
				buyAmount: 0,
				buyPrice: 0.1,
				sellAmount: 0,
				sellPrice: 0.1,
				depositAmount: null,
				withdrawAmount: null,
				contract: null,
				tokenContarct: null,
				hash: null,
				sign: null,
				picked: 8839118,

				token1: this.pair.tokens[0],
				token2: this.pair.tokens[1],

				spender: settings.exchangeAddress,
			}
		},
		computed: {
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
			tokensData(){
				this.depositToken = this.pair.tokens[0];
				this.withdrawToken = this.pair.tokens[0];
			},
			pair(){
				this.token1 = this.pair.tokens[0];
				this.token2 = this.pair.tokens[1];
				console.log("something changed")
			}
		},
		props:{
			pair: Object,
			from: String,
		},
		methods: {
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
			postBuyOrder(e){
				e.preventDefault();
				const vm = this;
				(async function(){
					var nonce = Math.floor(Math.random() * 1000000) + 100
					await exchange.getSign(web3, vm.from, settings.exchangeAddress, vm.token1.toLowerCase(), vm.buyAmount * 10**18, vm.token2.toLowerCase(), vm.buyTotal * 10**18, parseFloat(vm.picked), nonce)
					.then(res => vm.sign = res) 

					await vm.resource.save({
						"maker": vm.from.toLowerCase(),
						"tokenGet": vm.token1.toLowerCase(),
						"amountGet": parseFloat(vm.buyAmount) * 10**18,
						"tokenGive": vm.token2.toLowerCase(),
						"amountGive": parseFloat(vm.buyTotal) * 10**18,
						"expires": parseFloat(vm.picked),
						"nonce": parseFloat(nonce),
						"sig": vm.sign
					}).then(res => console.log(res)).catch(err => console.log(err))
				})()
			},
			postSellOrder(e){
				e.preventDefault();
				const vm = this;
				(async function(){
					var nonce = Math.floor(Math.random() * 1000000) + 100
					await exchange.getSign(web3, vm.from, settings.exchangeAddress, vm.token2, vm.sellTotal * 10**18, vm.token1.toLowerCase(), vm.sellAmount * 10**18, parseFloat(vm.picked), nonce)
					.then(res => vm.sign = res)
					
					await vm.resource.save({
						"maker": vm.from.toLowerCase(),
						"tokenGet": vm.token2.toLowerCase(),
						"amountGet": parseFloat(vm.sellTotal) * 10**18,
						"tokenGive": vm.token1.toLowerCase(),
						"amountGive": parseFloat(vm.sellAmount) * 10**18,
						"expires": parseFloat(vm.picked),
						"nonce": parseFloat(nonce),
						"sig": vm.sign
					}).then(res => console.log(res)).catch(err => console.log(err))
				})()
			},

		},
		created(){
			console.log(ethjs)
			this.contract = exchange.initContract(web3, settings.exchangeAbi, settings.exchangeAddress);
		},

	}
</script>

<style lang="scss">
	.btn{
		background-color: #0be881;
		color: #474747;
		border: none;
		border-radius: 3px;
		width: 100px;
		text-align: center;
		outline: none;
		cursor: pointer;
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
		flex: 0 0 437px;
	}
	.tabs__item{
		text-transform: uppercase;
	}
	.forms__content{
		background-color: #2c2c2c;
		padding: 22px;
		font-size: 14px;
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
	.expries{
		margin: 5px;
		cursor: pointer;
		text-transform: uppercase;
		&.active{
			color: #0be881;
		}
	}
	.button-container{
		text-align: center;
		margin-top: 30px;
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