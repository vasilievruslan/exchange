<template>
	<div class="window history">
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
							<div class="col amount">{{(item.amountGet / 10**18).toFixed(4)}}</div>
							<div class="col price"><span>{{(item.amountGet / item.amountGive).toFixed(4)}}</span></div>
							<div class="col time">{{`${new Date(item.date).getUTCMonth()}/${new Date(item.date).getUTCDay()} ${new Date(item.date).getUTCHours()}:${new Date(item.date).getUTCMinutes()}`}}</div>
						</a>
					</div>
				</div>
			</v-tab>
			<v-tab title="PERSONAL H">
				<div class="history__table">
					<div  class="row history__header">
						<div class="col">amount</div>
						<div class="col">price</div>
						<div class="col">time</div>
					</div>
					<div class="history__container">
						<a :href="`https://kovan.etherscan.io/tx/${item.txHash}`" v-for="item in personalHistoryData" :class="item.orderType" class="row history__row">
							<div class="col amount">{{(item.amountGet / 10**18).toFixed(4)}}</div>
							<div class="col price"><span>{{(item.amountGet / item.amountGive).toFixed(4)}}</span></div>
							<div class="col time">{{`${new Date(item.date).getUTCMonth()}/${new Date(item.date).getUTCDay()} ${new Date(item.date).getUTCHours()}:${new Date(item.date).getUTCMinutes()}`}}</div>
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
			},
		},
		methods: {
			getTradeHistory(){
				const vm = this;
				this.$http.get(`https://exapi1.herokuapp.com/v0.1/historyTrade?tget=${vm.tokenGetAddress}&tgive=${vm.tokenGiveAddress}&page=0`)
				.then(res => {
					var data = res.body._items;
					data.forEach(function(element){
						if(element.tokenGet == vm.tokenGetAddress){
							element.orderType = 'buy'
						}else{
							element.orderType = 'sell'
						}
					});
					vm.historyData = data
				}, err => {
					console.log(err)
				});
			},
			getPersonalTradeHistory(){
				const vm = this;
				this.$http.get(`https://exapi1.herokuapp.com/v0.1/personalHistoryTrade?tget=${vm.tokenGetAddress}&tgive=${vm.tokenGiveAddress}&wallet=${vm.from}&page=0`)
				.then(res => {
					var data = res.body._items;
					data.forEach(function(element){
						if(element.tokenGet == vm.tokenGetAddress){
							element.orderType = 'buy'
						}else{
							element.orderType = 'sell'
						}
					});
					vm.personalHistoryData = data
				}, err => {
					console.log(err)
				});
			}
		},
		created(){
			var vm = this;
			setInterval(function(){
				vm.getTradeHistory();
				vm.getPersonalTradeHistory();
			}, 8000);
		}
	}
</script>

<style lang="scss">

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
	.history{
		width: 378px;
		height: 540px;
		flex: 1;
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