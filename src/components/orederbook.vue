<template>
	<div class="window orederbook">
		<!-- <div class="tabs">
			<div class="tabs__item active">ORDERBOOK</div>
			<div class="tabs__item">PERSONAL OB</div>
		</div> -->
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
								<div class="col PRICE">{{item.amountGive / 10**18.0 / item.amountGet}}</div>
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
								<div class="col PRICE">{{item.amountGive / 10**18.0 / item.amountGet}}</div>
								<div class="col FIAT">$</div>
							</div>
						</div>
					</div>
				</div>
			</v-tab>
			<v-tab title="PERSONAL OB">
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
		data: function () {
			return {
				listBuy: [],
				listSell: [],
			}
		},
		props: {
			pair: Array,
		},
		computed: {
			sellOrders: function () {
				let orders = []
				for (var i = 20; i >= 0; i--) {
					orders[i] = {
						value: Math.random().toFixed(4),
						amount: Math.random().toFixed(4),
						price: Math.random().toFixed(4),
						fiat: Math.random().toFixed(4),
						hash: Math.random().toString(),
					}
				}
				return orders;
			}
		},
		methods: {
			getBuyOreders(tokenGetAddress, tokenGiveAddress) {
				this.$http.get('https://exapi1.herokuapp.com/v0.1/orders?tget='+ tokenGetAddress +'&tgive='+ tokenGiveAddress +'&page=0').then(response => {
					this.listBuy = response.body._items
				}, response => {
					console.log(response)
				});
			},
			getSellOreders(tokenGetAddress, tokenGiveAddress) {
				this.$http.get('https://exapi1.herokuapp.com/v0.1/orders?tget='+ tokenGetAddress +'&tgive='+ tokenGiveAddress +'&page=0').then(response => {
					this.listSell = response.body._items
				}, response => {
					console.log(response)
				});
		    },
	    },
	    created() {
	    	var vueSelf = this;
			setInterval(function () {
				vueSelf.getBuyOreders('0x0000000000000000000000000000000000000000', '0xc34376569aa1afbe982c4ecc6ea0d78f8077b3d0')
				vueSelf.getSellOreders('0xc34376569aa1afbe982c4ecc6ea0d78f8077b3d0', '0x0000000000000000000000000000000000000000')
			}, 3000)
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
	.tabs{
		display: flex;
		justify-content: space-between;
		.tabs__item{
			text-align: center;
			width: 100%;
			padding: 7px;
			box-sizing: border-box;
			cursor: pointer;

			&.active{
				background-color: #2c2c2c;
				cursor: default;
			}
		}
	}
	.orederbook{
		width: 378px;
		font-size: 17px;
		flex: 0 0 540px;
	}
	.orederbook-wrap{
		background-color: #2c2c2c;
		font-size: 14px;
	}
	.orederbook__container{
		max-height: 440px;
		overflow-x: scroll;
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
	.orederbook__titles{
		color: #aeaeae;
		padding-top: 10px;
		margin-bottom: 20px;
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