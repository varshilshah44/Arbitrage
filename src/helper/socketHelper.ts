// import cors from "cors";
// const express = require("express");
// const socketIo = require("socket.io");
// const axios = require("axios");

const initSocket = (io) => {
  console.log('intiSocket', io);
  
  io.on('connection', (socket) => {
    console.log('socket connect');
    
  })
};

export default initSocket;