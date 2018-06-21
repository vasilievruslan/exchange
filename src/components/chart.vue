<template>
	<div class="window chart">
		<div class="window__title">PRICE CHART</div>
		<div class="chart__container">
			<div id="chartdiv"></div>
		</div>
	</div>
</template>

<style lang="scss">
	.chart{
		flex: 0 0 540px
	}
	.window__title{
		margin-bottom: 11px;
		padding: 0px 14px;
	}
	.chart__container{
		background-color: #2c2c2c;
		padding: 5px;
		box-sizing: border-box;
	}
	#chartdiv {
		width: 100%;
		height: 480px;
		box-sizing: border-box;
	}
</style>


<script>
	export default{
		name: 'chart',
		data(){
			return{

			}
		},
		created(){
			var chartData = [];
			generateChartData();

			function generateChartData() {
				var firstDate = new Date();
				firstDate.setHours(0, 0, 0, 0);
				firstDate.setDate(firstDate.getDate() - 2000);

				for (var i = 0; i < 2000; i++) {
					var newDate = new Date(firstDate);

					newDate.setDate(newDate.getDate() + i);

					var open = Math.round(Math.random() * (30) + 100);
					var close = open + Math.round(Math.random() * (15) - Math.random() * 10);

					var low;
					if (open < close) {
						low = open - Math.round(Math.random() * 5);
					} else {
						low = close - Math.round(Math.random() * 5);
					}

					var high;
					if (open < close) {
						high = close + Math.round(Math.random() * 5);
					} else {
						high = open + Math.round(Math.random() * 5);
					}

					var volume = Math.round(Math.random() * (1000 + i)) + 100 + i;
					var value = Math.round(Math.random() * (30) + 100);

					chartData[i] = ({
						"date": newDate,
						"open": open,
						"close": close,
						"high": high,
						"low": low,
						"volume": volume,
						"value": value
					});
				}
			}

			AmCharts.makeChart("chartdiv", {
				"type": "stock",
				"theme": "black",
				"dataSets": [{
					"fieldMappings": [{
						"fromField": "open",
						"toField": "open"
					}, {
						"fromField": "close",
						"toField": "close"
					}, {
						"fromField": "high",
						"toField": "high"
					}, {
						"fromField": "low",
						"toField": "low"
					}, {
						"fromField": "volume",
						"toField": "volume"
					}, {
						"fromField": "value",
						"toField": "value"
					}],
					"color": "#fff",
					"dataProvider": chartData,
					"title": "West Stock",
					"categoryField": "date"
				}, {
					"fieldMappings": [{
						"fromField": "value",
						"toField": "value"
					}]
				}],


				"panels": [{
						"title": "Value",
						"showCategoryAxis": false,
						"percentHeight": 70,
						"valueAxes": [{
							"labelsEnabled": false,
							"id": "v1",
							"dashLength": 5
						}],

						"categoryAxis": {
							"dashLength": 5
						},

						"stockGraphs": [{
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
						}],

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
					"usePeriod": "WW"
				},

				"chartCursorSettings": {
					"valueLineBalloonEnabled": true,
					"valueLineEnabled": true
				},

				"periodSelector": {
					"position": "bottom",
					"periods": [{
						"period": "DD",
						"count": 10,
						"label": "10 days"
					}, {
						"period": "MM",
						"selected": true,
						"count": 1,
						"label": "1 month"
					}, {
						"period": "YYYY",
						"count": 1,
						"label": "1 year"
					}, {
						"period": "YTD",
						"label": "YTD"
					}, {
						"period": "MAX",
						"label": "MAX"
					}]
				},
				// "export": {
				// 	"enabled": true
				// }
			});
		}
	}
</script>