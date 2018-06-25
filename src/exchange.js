/*
*
v0.0.1 Exhange smart contract methods.
SETUP
<script src="js/exchange.js"></script>
var web3 = connectWeb3(provider_); //import `provider_` from `./settings`
var from = getAccount(0)
var contract = initContract(abi, contractAddress) //import `abi` and `contractAddress` from `./settings`
*
*/

export default{

	connectWeb3: function (provider_) {
		if (typeof web3 !== 'undefined') {
	      return new Web3(Web3.currentProvider);
	    } else {
	      return new Web3(new Web3.providers.HttpProvider(provider_));
	    }
	},
	connectWebsocketWeb3: function (provider_) {
		return new Web3(new Web3.providers.WebsocketProvider(provider_));
	},
	getAccount: async function (web3_, accountIndex_) { 
		await web3_.eth.getAccounts();
		return account[accountIndex_];
	},	
	initContract: function (web3_, abi_, contractAddress_) {
		return new web3_.eth.Contract(abi_, contractAddress_);
	},
	deposit: async function (contract_, from_, amount_) {
		let str;
		await contract_.methods.deposit().send({from:from_, value:amount_},
			function(err, hash){
				if (!err){
					str = hash;
				} else {
					console.log(err);
				}
		});

		return await str;
	},
	withdraw: async function (contract_, from_, amount_) {
		let str;
		await contract_.methods.withdraw(amount_).send({from:from_},
			function(err, hash){
				if (!err){
					str = hash;
					console.log(hash);
				} else {
					console.log(err);
				}
		});
		return await str;
	},
	depositToken: async function (contract_, tokenContract_, from_, spender_, token_, amount_) {
		let str;
		await tokenContract_.methods.approve(spender_, amount_).send({from:from_},
			function(err, hash){
				if (!err){
					str = hash
					console.log("aprove: " + hash);
				} else {
					console.log(err);
				}
		});
		await contract_.methods.depositToken(token_, amount_).send({from:from_},
			function(err, hash){
				if (!err){
					console.log('deposit: ' + hash);
					str = hash;
				} else {
					console.log(err);
				}
		});
		return await str
	},
	withdrawToken: async function (contract_, from_, token_, amount_) {
		let str;
		await contract_.methods.withdrawToken(token_, amount_).send({from:from_},
			function(err, hash){
				if (!err){
					console.log(hash);
					str = hash;
				} else {
					console.log(err);
				}
		});
		return await str;
	},
	balanceOf: async function (contract_, token_, user_) {
		let str;
		await contract_.methods.balanceOf(token_, user_).call(
			function(err, res){
				if (!err){
					str = res;
					// console.log(res);
				} else {
					console.log(err);
				}
		});
		return await str;
	},
	order: async function (contract_, from_, tokenGet_, amountGet_, tokenGive_, amountGive_, expires_, nonce_) {
		let str;
		await contract_.methods.order(tokenGet_, amountGet_, tokenGive_, amountGive_, expires_, nonce_).send({from:from_},
			function(err, hash){
				if (!err){
					str = hash;
					console.log(hash);
				} else {
					console.log(err);
				}
		});
		return await str;
	},
	// offchainOrder: function (contract_, from_, contract_, tokenGet, amountGet, tokenGive, amountGive, expires, nonce) {
	// 	// var hash = rderHash(contract_, tokenGet, amountGet, tokenGive, amountGive, expires, nonce);
	// 	// var sig = sign(from_, hash);
	// },
	trade: async function (contract_, from_, tokenGet_, amountGet_, tokenGive_, amountGive_, expires_, nonce_, user_, v_, r_, s_, amount_) {
		let str;
		await contract_.methods.trade(tokenGet_, amountGet_, tokenGive_, amountGive_, expires_, nonce_, user_, v_, r_, s_, amount_).send({from:from_},
			function(err, hash){
				if (!err){
					console.log(hash);
				} else {
					console.log(err);
				}
		});
		return await str;
	},
	cancelOrder: async function (contract_, from_, tokenGet_, amountGet_, tokenGive_, amountGive_, expires_, nonce_, user_, v_, r_, s_) {
		let str;
		await contract_.methods.cancelOrder(tokenGet_, amountGet_, tokenGive_, amountGive_, expires_, nonce_, user_, v_, r_, s_).send({from:from_},
			function(err, hash){
				if (!err){
					str = hash
					console.log(hash);
				} else {
					console.log(err);
				}
		});
		return await str;
	},
	sign: async function (web3_, from_, hash_) {
		let obj;
		await web3_.eth.personal.sign(hash_, from_, 
			function(err, res) {
				obj = res;
				console.log('sign: ' + res)
			});
		return await obj;
	},
	rsv: function (sig_) {
		var sig_ = sig_.slice(2);
		var r = '0x' + sig_.slice(0,64);
		var s = '0x' + sig_.slice(64,128);
		var v = web3.utils.toDecimal('0x' + sig_.slice(128,130));
		return {r:r, s:s, v:v};
	},
	checkSig: async function (web3_, wallet_, hash_, sig_) {
		let str;
		var ecRecover = await web3_.eth.personal.ecRecover(hash_, sig_, 
			function(err, res) {
				console.log('Test: ' + res);
				str = res;
		});
		return await str;
	},
	orderHash: function (web3_, contract_, tokenGet_, amountGet_, tokenGive_, amountGive_, expires_, nonce_) {
		return web3_.utils.soliditySha3(contract_, tokenGet_, amountGet_, tokenGive_, amountGive_, expires_, nonce_);
	},
	getSign: function(web3_, from_, contract_, tokenGet_, amountGet_, tokenGive_, amountGive_, expires_, nonce_) {
		var hash = this.orderHash(web3_, contract_, tokenGet_, amountGet_, tokenGive_, amountGive_, expires_, nonce_);
		console.log('getSign: ' + this.sign(web3_, from_, hash));
		return this.sign(web3_, from_, hash);
	},
	approve: async function (contract_, from_, spender_, value_) {
		let str;
		await contract_.methods.approve(spender_, value_).send({from:from_},
			function(err, hash){
				if (!err){
					str = hash
					console.log(hash);
				} else {
					console.log(err);
				}
		});
		return await str;
	},
	transferFrom: async function (contract_, from_, _from, to_, value_) {
		let str;
		await contract_.methods.transferFrom(_from, to_, value_).send({from:from_},
			function(err, hash){
				if (!err){
					str = hash
					console.log(hash);
				} else {
					console.log(err);
				}
		});
		return await str;
	},
	orderEvent: async function (contract_) {
		let str;
		await contract_.events.Order({fromBlock: 0}, 
			function(error, event){
				if (!error) {
					str = event
					console.log(event.transactionHash);
					console.log('==============');
				} else {
					console.log(error);
				}
		});
		return await str;
	}
};