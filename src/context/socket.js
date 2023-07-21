import React, { useEffect, useState, createContext } from "react";
import socketio from "socket.io-client";

const SocketContext = createContext();

const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const initializeSocket = async () => {
      try {
        const newSocket = socketio.connect(process.env.REACT_APP_SOCKET_URL);
        newSocket.on("connect", () => {
          console.log("Socket Connected");
        });

        setSocket(newSocket);
      } catch (err) {
        console.log(err);
      }
    };

    initializeSocket();
    return () => {
      // Disconnect the socket on unmounting the component
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext, SocketContextProvider };
