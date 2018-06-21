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
		flex: 0 0 540px;
		display: flex;
		flex-direction: column;
	}
	.tabs{
		flex: 0 0 6%;
	}
	.history__table{
		background-color: #2c2c2c;
		flex: 1 0 100%;
		max-height: 94%;
	}
	.history__header{
		color: #aeaeae;
		.col{
			text-transform: uppercase;
			padding: 10px 0px 15px; 	
		}
	}
	.history__container{
		height: 445px;
		overflow: scroll;
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