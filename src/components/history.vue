<template>
	<div class="window history">
		<transition name="fade">
			<div v-show="preLoader" class="pre-loader">
				<img width="128px" src="/preloader.svg" alt="">
			</div>
		</transition>
		<vue-tabs>
			<v-tab title="TRADE HISTORY">
				<div class="history__table">
					<div  class="row history__header">
						<div class="col">amount</div>
						<div class="col">price</div>
						<div class="col">time</div>
					</div>
					<div class="history__container">
						<a target="_blank" :href="`https://kovan.etherscan.io/tx/${item.txHash}`" v-for="item in historyData" :class="item.orderType" class="row history__row">
							<div class="col amount">{{(item.amount / 10**18).toFixed(4)}}</div>
							<div class="col price"><span>{{(item.price).toFixed(4)}}</span></div>
							<div class="col time">{{item.formatDate}}</div>
						</a>
					</div>
				</div>
			</v-tab>
			<v-tab title="PERSONAL TH">
				<div class="history__table">
					<div  class="row history__header">
						<div class="col">amount</div>
						<div class="col">price</div>
						<div class="col">time</div>
					</div>
					<div class="history__container">
						<a :href="`https://kovan.etherscan.io/tx/${item.txHash}`" v-for="item in personalHistoryData" :class="item.orderType" class="row history__row">
							<div class="col amount">{{(item.amount / 10**18).toFixed(4)}}</div>
							<div class="col price"><span>{{item.price.toFixed(4)}}</span></div>
							<div class="col time">{{item.formatDate}}</div>
						</a>
					</div>
				</div>
			</v-tab>
		</vue-tabs>
	</div>
</template>

<script>
	export default{
		name: 'histiry',
		data: function () {
			return {
				historyData: [],
				personalHistoryData: [],
				tokenGetAddress: this.pair.tokens[0],
				tokenGiveAddress: this.pair.tokens[1],
				preLoader: true,
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
				this.getTradeHistory();
			},
		},
		methods: {
			getTradeHistory(){
				const vm = this;
				this.$http.get(`https://exapi1.herokuapp.com/v0.1/historyTrade?tget=${vm.tokenGetAddress}&tgive=${vm.tokenGiveAddress}&page=0`)
				.then(res => {
					var data = res.body._items;

					data.sort((a, b) => a.date - b.date).reverse()

					.forEach(function(element){
						element.formatDate = new Date(element.date);
						element.formatDate = `${
							element.formatDate.getUTCMonth() + 1 < 10 ? '0' + (element.formatDate.getUTCMonth() + 1) : (element.formatDate.getUTCMonth() + 1)}/${
							element.formatDate.getUTCDate() < 10 ? '0' + element.formatDate.getUTCDate() : element.formatDate.getUTCDate()} ${
							element.formatDate.getUTCHours() < 10 ? '0' + element.formatDate.getUTCHours() : element.formatDate.getUTCHours()}:${
							element.formatDate.getUTCMinutes() < 10 ? '0' + element.formatDate.getUTCMinutes() : element.formatDate.getUTCMinutes()}`;
						

						if(element.tokenGet == vm.tokenGetAddress){
							element.orderType = 'buy'
							element.price = element.amountGive / element.amountGet;
							element.amount = element.amountGet
						}else{
							element.orderType = 'sell'
							element.price = element.amountGet / element.amountGive;
							element.amount = element.amountGive
						}
					});

					try {
						var personalData = data.filter(element => element.maker.toLowerCase() == vm.from.toLowerCase() || element.taker.toLowerCase() == vm.from.toLowerCase());
						vm.personalHistoryData = personalData;
					} catch(e) {
						console.log(e);
					}

					vm.historyData = data;

					vm.preLoader = false;


				}, err => {
					console.log(err)
				});
			},
		},
		created(){
			var vm = this;
			setInterval(function(){
				vm.getTradeHistory();
			}, 8000);

		}
	}
</script>

<style lang="scss">
	@keyframes rotate{
		0%{
			transform: rotate(0deg);
		}
		100%{
			transform: rotate(360deg);
		}
	}
	.pre-loader{
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		background: rgba(0,0,0,0.5);
		width: 100vw;
		height: 100vh;
		z-index: 5;

		img{
			animation: rotate 3s cubic-bezier(0.29, 0.9, 0.39, 0.93) infinite;
		}
	}
	.history__row{
		.price{
			display: flex;
			align-items: center;
			justify-content: center;
		}
		&.buy{
			.price:after{
				margin: 0px 5px;
				content: '';
				width: 0;
				height: 0;
				border-style: solid;
				border-width: 0 7px 7px 7px;
				border-color: transparent transparent #0be881 transparent;
			}
		}
		&.sell{
			.price:after{
				margin: 0px 5px;
				content: '';
				width: 0;
				height: 0;
				border-style: solid;
				border-width: 7px 7px 0 7px;
				border-color: #ff5e57 transparent transparent transparent;
			}
		}
	}
	.col.price span {
		width: 70px;
		text-align: right;
	}
	.history{
		width: 100%;
		height: 540px;
		flex: 0 1 40%;
		display: flex;
		flex-direction: column;
	}
	.vue-tabs{
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.nav-tabs-navigation{
		flex: 0 30px;
	}
	.tab-content{
		flex: 1 100%;
		display: flex;
		flex-direction: column;
	}
	.tab-container{
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.history__table{
		background-color: #2c2c2c;
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.history__header{
		color: #aeaeae;
		flex: 1 43px;
		.col{
			text-transform: uppercase;
			padding: 10px 0px 15px;
			font-size: 14px;
		}
	}
	.history__container{
		flex: 0 100%;
		height: 200px;
		overflow: scroll;
		-ms-overflow-style: none;  // IE 10+
		overflow: -moz-scrollbars-none;  // Firefox
		&::-webkit-scrollbar { 
			display: none;
		}
	}
	.history__row{
		font-weight: 400;
		padding: 4px 0px;
		font-size: 14px;
		width: 100%;
		color: #fff;
		text-decoration: none;

		&:hover{
			background-color: #242323;
		}

		&:last-child{
			margin-bottom: 17px;
		}
	}
</style>