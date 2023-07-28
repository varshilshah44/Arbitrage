import axios from 'axios'

let data = []

const initSocket = (io) => {
	io.on('connection', (socket) => {
		console.log('socket connect')
		socket.on('getCryptoData', async (cryptoNames) => {
			await getApiAndEmit(socket, cryptoNames)
		})
	})
}

const getApiAndEmit = async (socket, cryptoNames) => {
	try {
		const res = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoNames}&vs_currencies=USD`)
		data = res && res.data
		socket.emit('UpdatedCurrencyPrice', data)
	} catch (error) {
		socket.emit('UpdatedCurrencyPrice', data)
		/* if(error.config.status == 429){
      const res = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoNames}&vs_currencies=USD`
      );
      socket.emit("UpdatedCurrencyPrice", res && res.data);
    } */
	}
}

export default initSocket
