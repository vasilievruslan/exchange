<template>
	<div class="window orederbook">
		<vue-tabs>
			<v-tab title="ORDERBOOK">
				<div class="orederbook-wrap">
					<div class="orederbook__table orederbook__titles row">
						<div class="col orederbook__titles-item">AMOUNT</div>
						<div class="col orederbook__titles-item">PRICE</div>
						<div class="col orederbook__titles-item">FIAT</div>
					</div>
					<div class="orederbook__container">
						<div class="orederbook__table buy">
							<div v-for="item in listBuy" v-bind:data-hash="item.hash" class="buy row">
								<div class="col value"><span class="value-bar"></span></div>
								<div class="col AMOUNT">{{item.amountGet}}</div>
								<div class="col PRICE">{{item.amountGive / item.amountGet}}</div>
								<div class="col FIAT">$</div>
							</div>
						</div>
						<div class="orederbook__spread">
							<div class="spread">spread</div>
							<div class="spread-val">0.00123</div>
						</div>
						<div class="orederbook__table sell">
							<div v-for="item in listSell" v-bind:data-hash="item.hash" class="sell row">
								<div class="col value"><span class="value-bar"></span></div>
								<div class="col AMOUNT">{{item.amountGet}}</div>
								<div class="col PRICE">{{item.amountGive / item.amountGet}}</div>
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
						<div class="orederbook__table buy">
							<div v-for="item in personalOrders" v-bind:data-hash="item.hash" class="buy row">
								<div class="col value"><span class="value-bar"></span></div>
								<div class="col AMOUNT">{{item.amountGet}}</div>
								<div class="col PRICE">{{item.amountGive / item.amountGet}}</div>
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
			}
		},
		props: {
			pair: Object,
			from: String,
		},
		watch: {
			pair(){
				this.tokenGetAddress = this.pair.tokens[0];
				this.tokenGiveAddress = this.pair.tokens[1];
			}
		},
		methods: {
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
	.window{
		margin: 1px;
		padding: 14px 5px 5px 5px;
		background-color: #242323;
		color: #fff;
		border: 1px solid  #141414;
		box-sizing: border-box;
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

		.buy{
			font-weight: 400;
			&.row{
				margin: 5px;
			}
		}
		.sell{
			padding-bottom: 5px;
			font-weight: 400;
		}
	}
</style>