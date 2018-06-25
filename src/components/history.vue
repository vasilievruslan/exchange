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

			</v-tab>
		</vue-tabs>
	</div>
</template>

<script>

	export default{
		name: 'histiry',
		data: function () {
			return {

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