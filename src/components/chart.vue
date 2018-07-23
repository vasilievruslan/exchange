<template>
	<div class="chart">
		<div class="chart__container">
			<div ref="chart" id="chartdiv"></div>
		</div>
	</div>
</template>

<script>
	// import AmCharts from 'amcharts3'
	// import AmSerial from 'amcharts3/amcharts/serial'

	export default{
		name: 'chart',
		data(){
			return{
				chartData: [],
			}
		},
		props: {
			pair: Object,
		},
		watch: {
			pair() {
				this.getChartData();
				console.log('new chart!')
			}
		},
		methods: {
			getChartData(){
				var vm = this
				vm.$http.get(`https://exapi1.herokuapp.com/v0.1/priceChart?page=0`).then(res => {
					var data = res.data._items
					data.forEach(function(element){
						element.volume = 1
						element.value = 1
						var newDate = new Date(element.date)
						element.date = newDate;
					})
					vm.chartData = data;

					var chart = AmCharts.makeChart("chartdiv", {
						"hideCredits": true,
						"type": "stock",
						"theme": "black",
						"useUTC": true,
						"startDate": data[0].date,
						"dataSets": [
							{
								"fieldMappings": [{
									"fromField": "open",
									"toField": "open"
								}, {
									"fromField": "close",
									"toField": "close"
								}, {
									"fromField": "max",
									"toField": "high"
								}, {
									"fromField": "min",
									"toField": "low"
								}, {
									"fromField": "volume",
									"toField": "volume"
								}, {
									"fromField": "value",
									"toField": "value"
								}],
								"color": "#fff",
								"dataProvider": vm.chartData,
								"title": vm.pair.name.toUpperCase(),
								"categoryField": "date"
							}, {
								"fieldMappings": [{
									"fromField": "value",
									"toField": "value"
								}]
							}
						],


						"panels": [
							{
								"title": "Value",
								"showCategoryAxis": false,
								"percentHeight": 70,
								"valueAxes": [{
									"labelsEnabled": false,
									"id": "v1",
									"dashLength": 5
								}
							],

							"categoryAxis": {
								"parseDates": true,
								"dashLength": 5,
								"minPeriod": "mm",
								"parseDates": true
							},

							"stockGraphs": [
								{
									"type": "candlestick",
									"id": "g1",
									"openField": "open",
									"closeField": "close",
									"highField": "high",
									"lowField": "low",
									"valueField": "close",
									"lineColor": "#0be881",
									"fillColors": "#0be881",
									"negativeLineColor": "#ff5e57",
									"negativeFillColors": "#ff5e57",
									"fillAlphas": 1,
									"useDataSetColors": false,
									"comparable": true,
									"compareField": "value",
									"showBalloon": true,
									"balloonText": "Open:<b>[[open]]</b><br>Low:<b>[[low]]</b><br>High:<b>[[high]]</b><br>Close:<b>[[close]]</b><br>",
									"proCandlesticks": true
								}
							],

							"stockLegend": {
								"valueTextRegular": undefined,
								"periodValueTextComparing": "[[percents.value.close]]%"
								}
							}, 
							{
								"title": "Volume",
								"percentHeight": 30,
								"marginTop": 1,
								"showCategoryAxis": true,
								"valueAxes": [{
									"labelsEnabled": false,
									"dashLength": 5
								}],

								"categoryAxis": {
									"dashLength": 5
								},

								"stockGraphs": [{
									"valueField": "volume",
									"type": "column",
									"showBalloon": false,
									"fillAlphas": 1
								}],

								"stockLegend": {
									"markerType": "none",
									"markerSize": 0,
									"labelText": "",
									"periodValueTextRegular": "[[value.close]]"
								}
							}
						],

						"chartScrollbarSettings": {
							"graph": "g1",
							"graphType": "line",
							"usePeriod": "HH"
						},

						"categoryAxesSettings": {
							"minPeriod": "mm"
						},

						"chartCursorSettings": {
							"valueLineBalloonEnabled": true,
							"valueLineEnabled": true
						},

						"periodSelector": {
							"inputFieldsEnabled": false,
							"dateFormat": "HH:NN DD-MM-YYYY",
							"position": "bottom",
							"periods": [{
								"period": "mm",
								"count": 15,
								"label": "15 min"
							}, {
								"period": "mm",
								"count": 60,
								"label": "1 hour"
							}, {
								"period": "hh",
								"count": 24,
								"label": "1 day"
							}, {
								"period": "MAX",
								"label": "MAX",
								"selected": true
							}]
						}
					});

				})
				
			}
		},
		created(){	

			let vm = this;
			// generateChartData();

			// setInterval(function () {
			// 	var elem = document.querySelectorAll('.chart a')
			// 	elem.forEach(el => el.style.display = 'none')
			// }, 4000)


			setInterval(vm.getChartData(), 5000)
			vm.getChartData();
		}
	}
</script>
<style lang="scss">
	.chart{
		flex: 1 100%;
		display: flex;
		flex-direction: column;
		a{
			display: none !important;
		}
	}
	.window__title{
		padding: 0px 14px;
		flex: 1 33px;
	}
	.chart__container{
		background-color: #2c2c2c;
		padding: 5px;
		box-sizing: border-box;
		flex: 0 100%;
		display: flex;
		flex-direction: column;
	}
	#chartdiv {
		width: 100%;
		height: 200px;
		box-sizing: border-box;
		flex: 1 100%;
	}
</style>