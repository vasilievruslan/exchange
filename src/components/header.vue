<template>
	<header class="header">
		<div class="header__cotainer --left">
			<div class="header__logo"><img src="../assets/excaliburLogo.svg" alt="excalibur_alpha" class="header__logo-img"></div>
			<div class="header__pairs">
				<div v-on:click="dropdown = !dropdown" class="cur-pair">{{ pair.name }} <span><svg id="SVGDoc" width="14" height="7" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:avocode="https://avocode.com/" viewBox="0 0 14 7"><defs><path d="M283,20l-7,7l-7,-7v0" id="Path-0"/><clipPath id="ClipPath1016"><use xlink:href="#Path-0" fill="#ffffff"/></clipPath></defs><g transform="matrix(1,0,0,1,-269,-20)"><g><title>arrow</title><use xlink:href="#Path-0" fill-opacity="0" fill="#ffffff" stroke-linejoin="miter" stroke-linecap="butt" stroke-opacity="1" stroke="#aeaeae" stroke-miterlimit="50" stroke-width="2" clip-path="url(&quot;#ClipPath1016&quot;)"/></g></g></svg></span></div>


				<ul v-if="dropdown" class="pairs">
					<li v-on:click="dropdown = !dropdown" v-for="item in pairs" class="pair__item"><router-link :to="{ name: 'pair', params: { id: item.path }}">{{ item.name }}</router-link></li>
				</ul>
			</div>
			<div class="header__balances">
				<div class="balances__title">balances:</div>
				<div class="token-balances-list__item">
					<span class="amount">{{ amount1 }}</span>
					<span class="symbol"> {{ pair.symbols[0] }}, </span>
					<span class="amount">{{ amount2 }}</span> 
					<span class="symbol"> {{ pair.symbols[1] }}</span>
				</div>
			</div>
		</div>
		<div class="header__cotainer --right">
			<ul class="header__navi">
				<li class="header__navi-item"><a href="">github</a></li>
				<li class="header__navi-item"><a href="">etherscan</a></li>
				<li class="header__navi-item"><a href="">twitter</a></li>
				<li class="header__navi-item"><a href="">telegram</a></li>
			</ul>
			<div class="header__langswitcher">
				<div class="lang-switcher">EN <span>
					<svg id="SVGDoc" width="14" height="7" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:avocode="https://avocode.com/" viewBox="0 0 14 7">
						<defs>
							<path d="M283,20l-7,7l-7,-7v0" id="Path-0"/>
							<clipPath id="ClipPath1016"><use xlink:href="#Path-0" fill="#ffffff"/></clipPath>
						</defs>
						<g transform="matrix(1,0,0,1,-269,-20)">
							<use xlink:href="#Path-0" fill-opacity="0" fill="#ffffff" stroke-linejoin="miter" stroke-linecap="butt" stroke-opacity="1" stroke="#aeaeae" stroke-miterlimit="50" stroke-width="2" clip-path="url(&quot;#ClipPath1016&quot;)"/>
						</g>
					</svg>
				</span>
			</div>
			</div>

			<div class="apps">
				<div class="apps__item ledger__logo">
					<img src="../assets/ledger.svg" alt="">
				</div>
				<div class="apps__item metamask__logo">
					<img src="../assets/metaMask.svg" alt="">
				</div>
			</div>
		</div>
	</header>
</template>

<script>
	import provider from '../provider.js'
	import exchange from '../exchange.js'
	import settings from '../settings.json'



	const web3 = provider.connectWeb3();

	export default {
		name: 'headerMain',
		data: function(){
			return {
				dropdown: false,
				amount1: 'waiting',
				amount2: 'waiting',
			}
		},
		computed: {
			pairs() {
				return settings.pairs
			},
		},
		props: {
			contract: Object,
			from: String,
			pair: Object,
		},
		methods: {
			showBalance(){
				const vm = this;
				exchange.balanceOf(vm.contract, vm.pair.tokens[0], vm.from)
	        	.then(res => vm.amount1 = res / 10**18)
	        	exchange.balanceOf(vm.contract, vm.pair.tokens[1], vm.from)
	        	.then(res => vm.amount2 = res / 10**18)
	        	console.log('show');
			},
		},
		watch:{
			pair(){
				this.showBalance();
			},
		},

		created() {
			const vm = this;
			setInterval(function () {
				vm.showBalance();
			}, 5000)
		}
	}
</script>

<style lang="scss">
	.header{
	    position: absolute;
		width: 100vw;
		box-sizing: border-box;
		display: flex;
		-ms-align-items: center;
		align-items: center;
		background-color: #141414;
		font-size: 14px;
		color: #ffffff;
		height: 46px;
		padding: 0px 23px;
		justify-content: space-between;
	}
	.header__cotainer{
		display: flex;
		-ms-align-items: center;
		align-items: center;
	}
	.header__pairs{
		margin: 0px 36px;
		position: relative;
		font-size: 19px;
	}
	.cur-pair{
		cursor: pointer;
		text-transform: uppercase;
	}
	.pairs{
		position: absolute;
		list-style-type: none;
		padding: 20px;
		z-index: 2;
		background-color: #141414;
	}
	.pair__item{
		margin: 7px 0px;
		a{
			text-transform: uppercase;
			text-decoration: none;
			color: #fff;
		}
	}
	.lang-switcher{
		margin: 0px 50px;
	}
	.header__balances{
		display: flex;
	}
	.balances__title{
		text-transform: uppercase;
		color: #aeaeae;
	}
	.symbol{
		color: #aeaeae;
	}
	.token-balances-list__item{
		text-transform: uppercase;
		margin: 0px 0px 0px 7px;
	}
	.header__navi{
		display: flex;
		list-style-type: none;
		margin: 0;
		padding: 0;
	}
	.header__navi-item a{
		color: #fff;
		text-decoration: none;
		text-transform: uppercase;
		margin: 7px;
	}
	.apps{
		display: flex;
		-ms-align-items: center;
		align-items: center;
	}
	.apps__item{
		margin: 7px;
		&.metamask__logo{
			&.disconect{
				filter: grayscale(100%);
			}
		}
	}
</style>