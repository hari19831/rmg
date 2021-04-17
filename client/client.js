const io = require("socket.io-client");

const socket = io("ws://issez-s155:7979/integra", {
                                                    reconnectionDelayMax: 10000
               });

initiateSocketEvents(socket);


function initiateSocketEvents(socket){
    
    socket.on("connect", () => {
      console.log(socket.connected); // true
      socket.emit('send','1234 sync connection check');
    });

    socket.on("receive", (data) => {
      console.log(data); // true
    });

    socket.on("disconnect", () => {
      console.log(`...socket disconnected...`); 
    }); 
}


