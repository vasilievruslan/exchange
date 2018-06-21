<template>
	<div class="window forms">
		<vue-tabs>
			<v-tab title="BUY">
				<div class="forms__content">
					<form class="forms__box form__buy">
						<div class="form__buy__amount">
							<p class="input__title">AMOUNT</p>
							<p class="input__contaner --amount"><input v-model="buyAmount" placeholder="amount" type="number"><span class="symbol-toolkit">omg</span></p>
						</div>
						<div class="form__buy__price">
							<p class="input__title">PRICE</p>
							<p class="input__contaner --price"><input v-model="buyPrice" placeholder="price" type="number"><span class="symbol-toolkit">eth</span></p>
						</div>
						<p>TOTAL = <span>{{buyTotal}}</span> ETH</p>
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
							<p class="input__contaner --amount"><input v-model="sellAmount" placeholder="amount" type="number"><span class="symbol-toolkit">omg</span></p>
						</div>
						<div class="form__buy__price">
							<p class="input__title">PRICE</p>
							<p class="input__contaner --price"><input v-model="sellPrice" placeholder="" type="number"><span class="symbol-toolkit">eth</span></p>
						</div>
						<p>TOTAL = <span>{{sellTotal}}</span> ETH</p>
						<p>CHOOSE EXPIRES: 
							<span v-for="item in expires">
								<input class="radio-btn" type="radio" :id="item.title" :value="item.blockAmount" v-model="picked">
								<label :class="{active: picked == item.blockAmount}" class="expries " :for="item.title">{{item.title}}</label>
							</span>
						<p class="button-container"><button class="button sell">PLACE BUY ORDER</button></p>
					</form>
				</div>	
			</v-tab>

			<v-tab title="MANAGE">
				<div class="forms__content">
					<form class="forms__box form__manage">
						<div class="form__sell__deposit">
							<p class="input__title">DEPOSIT ->
							 	<span v-for="item in pair">
									<input 
										class="radio-btn" 
										type="radio" 
										:id="item.symbol" 
										:value="item.address" 
										v-model="depositToken">
									<label 
										:class="{active: depositToken == item.address}" 
										class="expries " 
										:for="item.symbol">{{item.symbol}}
									</label>
								</span>
							[choose currency]</p>
							<p class="input__contaner --amount"><input v-model="depositAmount" placeholder="amount" type="number"><button v-on:click="deposit" class="btn btn_deposit">SENT</button></p>
						</div>
					</form>
					<form class="forms__box form__manage">
						<div class="form__sell__withdraw">
							<p class="input__title">WITHDRAW ->

								<span v-for="item in pair">
									<input 
										class="radio-btn" 
										type="radio" 
										:id="item.address" 
										:value="item.address" 
										v-model="withdrawToken">
									<label 
										:class="{active: withdrawToken == item.address}" 
										class="expries" 
										:for="item.address">
										{{item.symbol}}
									</label>
								</span>
							 [choose currency]</p>
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

	const web3 = provider.connectWeb3();

	export default {
		name: 'forms',
		data(){
			return {
				pair: [{
					symbol: 'OMG',
					address: '0xc34376569aa1afbe982c4ecc6ea0d78f8077b3d0'
				},{
					symbol: 'ETH',
					address: '0x0000000000000000000000000000000000000000'
				}],

				depositToken: '',
				withdrawToken: '',
				expires: [
					{
						title: '1H',
						blockAmount: 1232132
					},
					{
						title: '1D',
						blockAmount: 6542284
					},
					{
						title: '1W',
						blockAmount: 9875456
					}
				],
				buyAmount: 0,
				buyPrice: 0.1,
				sellAmount: '',
				sellPrice: '',
				depositAmount: '',
				withdrawAmount: '',
				contract: '',
				hash: '',
				sign: '',
				picked: ''
			}
		},
		computed: {
			resource: function() {
	            return this.$resource('https://exapi1.herokuapp.com/v0.1/pushOrder')
	        },
			buyTotal(){
				return this.buyAmount * this.buyPrice; 
			},
			sellTotal(){
				return this.sellAmount * this.sellPrice; 
			},
		},
		props:{
			from: String,
			check: String,
		},
		methods: {
			deposit(e) {
				e.preventDefault();
				exchange.deposit(this.contract, this.from, this.depositAmount * 10**18).then(res => console.log(res), err => console.log(err))
				
			},
			withdraw(e) {
				e.preventDefault();
				exchange.withdraw(this.contract, this.from, this.withdrawAmount * 10**18).then(res => console.log(res), err => console.log(err))
			},
			postBuyOrder(e){
				e.preventDefault();
				const VueThis = this;
				(async function(){
					var nonce = Math.floor(Math.random() * 1000000) + 100
					await exchange.getSign(web3, VueThis.from, settings.contractAddress, '0xc34376569aa1afbe982c4ecc6ea0d78f8077b3d0', VueThis.buyAmount * 10**18, '0x0000000000000000000000000000000000000000', VueThis.buyTotal * 10**18, 10000, nonce).then(res => VueThis.sign = res) 

					await VueThis.resource.save({
						"maker": VueThis.from,
						"tokenGet": "0x0000000000000000000000000000000000000000",
						"amountGet": VueThis.buyAmount,
						"tokenGive": "0xc34376569aa1afbe982c4ecc6ea0d78f8077b3d0",
						"amountGive": VueThis.buyTotal * 10**18,
						"expires": 10000,
						"nonce": nonce,
						"sig": VueThis.sign
					}).then(res => console.log(res))
				})()

				
			},

		},
		created(){
			this.contract = exchange.initContract(web3, settings.exchangeAbi, settings.contractAddress);
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
		flex: 1 0;
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