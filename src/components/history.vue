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
						<div v-for="item in histiryDataArr" class="row history__row">
							<div class="col amount">{{item.amount}}</div>
							<div class="col price">{{item.price}}</div>
							<div class="col time">{{item.time}}</div>
						</div>
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
						<div v-for="item in histiryDataArr" class="row history__row">
							<div class="col amount">{{item.amount}}</div>
							<div class="col price">{{item.price}}</div>
							<div class="col time">{{item.time}}</div>
						</div>
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
				histiryData: [],
				personalHistiryData: [],
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
		computed: {
			histiryDataArr: function () {
				var arr = []
				for (var i = 40; i >= 0; i--) {

					arr[i] = {
						amount: Math.random().toFixed(5),
						price: Math.random().toFixed(5),
						time: new Date().toLocaleTimeString(),
					}

				}
				return arr
			}
		},
		methods: {
			getTradeHistory(){
				const vm = this;
				this.$http.get(`https://exapi1.herokuapp.com/v0.1/historyTrade?tget=${vm.tokenGetAddress}&tgive=${this.tokenGiveAddress}&page=0`)
				.then(res => {
					vm.histiryData = res.body._items
				}, err => {
					console.log(err)
				});
			},
			getPersonalTradeHistory(){
				const vm = this;
				this.$http.get(`https://exapi1.herokuapp.com/v0.1/personalHistoryTrade?tget=${vm.tokenGetAddress}&tgive=${this.tokenGiveAddress}&wallet=${vm.from}&page=0`)
				.then(res => {
					vm.personalHistiryData = res.body._items
				}, err => {
					console.log(err)
				});
			}
		},
		created(){
			setInterval(this.getTradeHistory(), 10000);
		}
	}
</script>

<style lang="scss">
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
		margin: 4px 0px;
		font-size: 14px;
		width: 100%;

		&:last-child{
			padding-bottom: 17px;
		}
	}
</style>