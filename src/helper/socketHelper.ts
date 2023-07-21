import axios from 'axios';

const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("socket connect");
    socket.on("getCryptoData", async(cryptoNames) => {
      await getApiAndEmit(socket, cryptoNames)
    })
  });
};

const getApiAndEmit = async(socket,cryptoNames) => {
  try {
    const res = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoNames}&vs_currencies=USD`
    );
    socket.emit("UpdatedCurrencyPrice", res && res.data);
  } catch (error) {
    if(error.config.status == 429){
      const res = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoNames}&vs_currencies=USD`
      );
      socket.emit("UpdatedCurrencyPrice", res && res.data);
    }
  }
};

export default initSocket;
