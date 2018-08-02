<template>
	<div class="window chat">
		<div class="chat__title">Chat</div>
		<div class="chat__wrap">
			<div id="content">
				<p class="message" v-for="item in content"><span v-bind:style="{color: item.color}">{{item.author}}</span>{{item.message}}</p>
			</div>
			<div class="input">
				<input :placeholder="status" ref="chatInput" @keyup.enter="sendMessage" v-model="message" type="text" id="input"/>
				<button @click.prevent="sendMessage" class="send-btn"><img src="../assets/send-btn.svg" alt=""></button>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				status: '',
				disabled: true,
				myColor: false,
				myName: false,
				content: [],
				message: '',
				autofocus: false,

			}
		},
		computed:{
			chatInput() { 
				return this.$refs.chatInput
			},
			connection() {
				return new WebSocket('ws://192.168.8.119:1337')
			},
		},
		watch:{
			disabled(){
				this.scrollToBottom();
			},
			content(){
				setTimeout(this.scrollToBottom, 100)
				this.scrollToBottom();
			},
			status(){
				this.scrollToBottom();
			}
		},
		methods: {
			addMessage(author_, message_, color_, dt_) {
				const vm = this;
		        this.content.push({
		        	color: color_, 
		        	author: author_, 
		        	message: '@' +
		             + (dt_.getHours() < 10 ? '0' + dt_.getHours() : dt_.getHours()) + ':'
		             + (dt_.getMinutes() < 10 ? '0' + dt_.getMinutes() : dt_.getMinutes())
		             + ': ' + message_
		        });
		    },
		    sendMessage(){
		    	const vm = this;
		    	var msg = vm.message;
	            if (!msg) {
	                return;
	            }

	            vm.connection.send(msg);
	            vm.message = '';
	            // disable the input field to make the user wait until server
	            // sends back response
	            vm.disabled = true;

	            // we know that the first message sent from a user their name
	            if (vm.myName === false) {
	                vm.myName = msg;
	            }
		    },
		    scrollToBottom(){
				var container = this.$el.querySelector("#content");
				container.scrollTop = container.scrollHeight;
		    }

		},
		created() {
			const vm = this;
			window.WebSocket = window.WebSocket || window.MozWebSocket;
			vm.connection.onopen = function () {
				vm.status = 'Choose name'
				vm.disabled = false
			}; 
			vm.connection.onmessage = function (message) {
				try {
					var json = JSON.parse(message.data);
				} catch (e) {
					console.log('This doesn\'t look like a valid JSON: ', message.data);
					return;
				}

				// NOTE: if you're not sure about the JSON structure
				// check the server source code above
				if (json.type === 'color') { // first response from the server with user's color
					vm.myColor = json.data;
					vm.status = vm.myName //.css('color', myColor);
					vm.disabled = false;
					// from now user can start sending messages
				} else if (json.type === 'history') { // entire message history
					// insert every single message to the chat window
					for (var i=0; i < json.data.length; i++) {
						vm.addMessage(json.data[i].author, json.data[i].text,
								   json.data[i].color, new Date(json.data[i].time));
					}
				} else if (json.type === 'message') { // it's a single message
					vm.disabled = false;
					vm.addMessage(json.data.author, json.data.text,
							   json.data.color, new Date(json.data.time));
				} else {
					console.log('Hmm..., I\'ve never seen JSON like this: ', json);
				}
			};
		}

	}
</script>

<style lang="scss">
	.chat{
		width: 378px;
		flex: 1 0 40%;
		display: flex;
		flex-direction: column;
	}
	.chat__title{
		padding: 0px 12px;
		margin-bottom: 11px;
		text-transform: uppercase;
		font-size: 17px;
		flex: 0 0;
	}
	.chat__wrap{
		width: 100%;
		height: 100%;
		overflow: scroll;
		background-color: #2c2c2c;
		font-weight: 400;
		flex: 1 0;
		display: flex;
		flex-direction: column;
		&::-webkit-scrollbar { 
			display: none;
		}
	}
	.message{
		word-wrap: break-word;
	}
	#content{
		flex: 1;
		box-sizing: border-box;
		padding: 10px;
		overflow-y: scroll;
	}
	.input{
		padding-top: 3px;
		background: #242323;
		position: relative;
	}
	#input{
		display: block;
		box-sizing: border-box;
		width: 100%;
		color: #fff;
		padding: 10px;
		border: none;
		background: #2c2c2c;
		outline: #ef5777;
		padding-right: 51px;
	}
	.send-btn{
		display: block;
		background-color: transparent;
		border: none;
		position: absolute;
		right: 10px;
		top: calc(50% + 3px);
		transform: translateY(-50%);
		z-index: 2;
		cursor: pointer;
		outline: none;
	}
</style>