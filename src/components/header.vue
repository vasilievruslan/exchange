<template>
	<header class="header">
		<div class="header__cotainer --left">
			<div class="header__logo"><img src="../assets/excaliburLogo.svg" alt="excalibur_alpha" class="header__logo-img"></div>
			<div class="header__pairs">
				<div v-on:click="dropdown = !dropdown" class="cur-pair">{{ pair.name }} <span><svg id="SVGDoc" width="14" height="7" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:avocode="https://avocode.com/" viewBox="0 0 14 7"><defs><path d="M283,20l-7,7l-7,-7v0" id="Path-0"/><clipPath id="ClipPath1016"><use xlink:href="#Path-0" fill="#ffffff"/></clipPath></defs><g transform="matrix(1,0,0,1,-269,-20)"><g><title>arrow</title><use xlink:href="#Path-0" fill-opacity="0" fill="#ffffff" stroke-linejoin="miter" stroke-linecap="butt" stroke-opacity="1" stroke="#aeaeae" stroke-miterlimit="50" stroke-width="2" clip-path="url(&quot;#ClipPath1016&quot;)"/></g></g></svg></span></div>

				<transition	name="slide">
					<ul v-if="dropdown" class="pairs">
						<li v-on:click="dropdown = !dropdown" v-for="item in pairs" class="pair__item"><router-link :to="{ name: 'pair', params: { id: item.path }}">{{ item.name }}</router-link></li>
					</ul>
				</transition>
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
			<ul :class="menu" class="header__navi">
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
					<toolkit class="ledger-toolkit">
						LEDGER <br>
						Available soon.
					</toolkit>
				</div>
				<div class="apps__item metamask__logo">
					<i class="ico" :class="metamask" alt=""></i>


					<toolkit class="metamask-toolkit">
						<div v-if="metamask == 'metamask'" class="metamask-continer">
							<div class="metamask-copy">
								<input id="address" :value="from" type="text">
								<button @click="copy" class="copy"><img src="../assets/copy-ico.svg" alt=""></button>
							</div>
							<div class="indicators">
								<div class="condition --green">ACTIVE</div>
								<transition name="fade">
									<div v-if="copied">COPIED</div>
								</transition>
								<div class="network --purple">{{network.toUpperCase()}}</div>
							</div>
						</div>
						<div v-else class="metamask-continer">
							<div class="title">METAMASK IS NOT AVAILABLE</div>
							<div class="extantion-container">
								<div class="">Please unlock your wallet or install chrome extension.</div>
								<a target="_blank" href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en">INSTALL</a>
							</div>
						</div>
					</toolkit>
				</div>
			</div>
		</div>
		<div class="menu" @click="showMenu">
			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve" width="30px" height="30px">
				<g>
					<path id="path1" d="M491.318,235.318H20.682C9.26,235.318,0,244.577,0,256s9.26,20.682,20.682,20.682h470.636	c11.423,0,20.682-9.259,20.682-20.682C512,244.578,502.741,235.318,491.318,235.318z" fill="#FFFFFF"/>
					<path id="path2" d="M491.318,78.439H20.682C9.26,78.439,0,87.699,0,99.121c0,11.422,9.26,20.682,20.682,20.682h470.636	c11.423,0,20.682-9.26,20.682-20.682C512,87.699,502.741,78.439,491.318,78.439z" fill="#FFFFFF"/>
					<path id="path3" d="M491.318,392.197H20.682C9.26,392.197,0,401.456,0,412.879s9.26,20.682,20.682,20.682h470.636	c11.423,0,20.682-9.259,20.682-20.682S502.741,392.197,491.318,392.197z" fill="#FFFFFF"/>
				</g>
			</svg>
		</div>
		
	</header>
</template>

<script>
	import provider from '../provider.js'
	import exchange from '../exchange.js'
	import settings from '../settings.json'

	import anime from 'animejs'

	import toolkit from './toolkit.vue'

	const web3 = provider.connectWeb3();

	export default {
		name: 'headerMain',
		components: { toolkit, },
		data: function(){
			return {
				dropdown: false,
				amount1: '...',
				amount2: '...',
				alert: true,
				menu: '',
				network: settings.network.name,

				metamaskToolkit: false,
				ladgerToolkit: false,

				copied: false
			}
		},
		computed: {
			pairs() {
				return settings.pairs;
			},
			web3(){
				return provider.connectWeb3();
			},
			metamask(){
				return typeof this.web3 == 'undefined' && this.from == null || this.from == undefined ? 'metamask-disconect' : 'metamask'
			}

		},
		props: {
			contract: Object,
			from: String,
			pair: Object,
		},
		methods: {
			copy(){
				const vm = this;
				let input = document.querySelector('#address')
				input.select()
				try {
					var successful = document.execCommand('copy');
					var msg = successful ? 'successful' : 'unsuccessful';
					// alert('Address was copied ' + msg);
					vm.copied = true;

					setTimeout(function(){
						vm.copied = false;
					}, 3000)

				} catch (err) {
					console.log(err)
				}
				window.getSelection().removeAllRanges()
			},
			showMenu(){
				this.menu = this.menu == '' ? 'active' : ''
			},
			showBalance(){
				const vm = this;
				exchange.balanceOf(vm.contract, vm.pair.tokens[0], vm.from)
				.then(res => vm.amount1 = res / 10**18)
				exchange.balanceOf(vm.contract, vm.pair.tokens[1], vm.from)
				.then(res => vm.amount2 = res / 10**18)
			},
		},
		watch:{
			pair(){
				this.showBalance();
			},
			from(){
				this.showBalance();
			}
		},

		created() {
			const vm = this;
			setInterval(function () {
				try {
					vm.showBalance();
				} catch(e) {
					// statements
					console.log(e);
				}
				// vm.checkMetaMask();
			}, 5000)

		}
	}
</script>

<style lang="scss">
	.fade-enter-active, .fade-leave-active {
		transition: opacity .3s;
	}
	.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
		opacity: 0;
	}
	.toolkit{
		position: absolute;
		right: 0;
		bottom: 0;
		transform: translateY(100%);
		font-size: 14px;
		&.ledger-toolkit{
			text-align: center;
			padding: 33px 15px;
			line-height: 1.6;
		}
		.title{
			margin-bottom: 16px;
		}
		.extantion-container{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-bottom: 11px;
			a{
				background-color: #0be881;
				padding: 12px 20px;
				color: #474747;
				border-radius: 2px;
				text-decoration: none;
			}
		}
		.--green{
			color: #0be881;
		}
		.--purple{
			color: #690496;
		}
		.indicators{
			display: flex;
			justify-content: space-between;
		}
		.metamask-copy{
			margin-bottom: 14px;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		input{
			font-size: 11px;
			box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.5);
			background-color: #242323;
			color: #919191;
			padding: 11px 9px;
			border: none;
			box-sizing: border-box;
			display: block;
			width: 100%;
			outline: none;
		}
		button{
			border: 1px solid #141414;
			background-color: #242323;
			border-radius: none;
			display: block;
			line-height: 0;
			padding: 7px;
			cursor: pointer;
			outline: none;

			&:active{
				box-shadow: inset 0px 1px 3px rgba(0, 0, 0, 0.5);
			}

			img{
				display: block;
				width: 15px;
			}
		}
	}
	.apps__item{
		padding: 7px;
		&.metamask__logo{
			&.disconect{
				filter: grayscale(100%);
			}
		}
		cursor: pointer;
		&:hover{

			.toolkit{
				display: block;
			}
		}


		.toolkit{
			display: none;
		}
	}
	.slide-enter-active{
		animation: slide-in .5s;
	}

	.slide-leave-active {
		animation: slide-in .5s reverse;
	}

	@keyframes slide-in{
		0% {
			transform: rotateX(-90deg) translateX(-50%);
		}
		100%{
			transform: rotateX(0deg) translateX(-50%);
		}
	}


	i.ico{
		display: inline-block;
		background-size: cover;
		background-repeat: no-repeat;
		width: 28px;
		height: 25px;
		&.metamask{
			background-image: url(../assets/metaMask.svg);
		}
		&.metamask-disconect{
			background-image: url(../assets/metaMask_disconect.svg)
		}
	}

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
		position: relative;
		padding-right: 20px;

		span{
			position: absolute;
			right: 0;
			top: 50%;
			transform: translateY(-50%);
			line-height: 0;
		}
	}
	.pairs{
		position: absolute;
		list-style-type: none;
		padding: 20px;
		z-index: 2;
		background-color: #141414;
		margin: 0;
		transform: translateX(-50%);
		left: 50%;
		transform-origin: 0 0;
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
		@extend .cur-pair;
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
	.menu{
		display: none;
	}

	@media screen and (max-width: 768px) {
		.menu{
			display: block;
			cursor: pointer;
			position: relative;
			z-index: 3;
		}
		.header{
			position: relative;

		}
		.header__logo{
			margin: 10px 0px;
		}
		.header__navi{
			position: absolute;
			flex-direction: column;
			background-color: rgba(0, 0, 0, 0.8);
			padding-top: 60px;
			top: 0;
			left: 100vw;
			height: 100vh;
			z-index: 2;
			text-align: right;

			transition: all 0.4s ease-in-out;

			&.active{
				transform: translateX(-100%);
			}

			.header__navi-item{
				margin: 10px 20px;
			}
		}
		
	}
</style>