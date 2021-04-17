const AXIOS = require('axios');
const CONFIG = require('../../config/config.json');

const Connection = (vHost = "/") => {
  return new Promise((resolve, reject) => {
    let conString = CONFIG.RabbitServer
    conString.vhost = vHost;
    const AMQPLIB = require('amqplib').connect(conString);
    AMQPLIB.then(function (conn) {
      resolve(conn.createChannel());
    }).catch(err => {
      reject(err);
    });
  });
}


exports.AddUserToVirtualHost = (VirtualHostName) => {
  return new Promise((resolve, reject) => {
    try {
      AXIOS({
        method: 'put',
        body: { "vhost": VirtualHostName, "username": CONFIG.RabbitServer.username, "configure": ".*", "write": ".*", "read": ".*" },
        url: CONFIG.RabbitURL + permissions + VirtualHostName + "/" + CONFIG.RabbitServer.username,
        auth: {
          username: CONFIG.RabbitServer.username,
          password: CONFIG.RabbitServer.password
        }
      }).then(function (response) {
        resolve(true);
      }).catch(err => {
        throw (err);
      })
    } catch (error) {
      reject(error);
    }
  });
}


exports.CreateVirtualHost = (VirtualHostName) => {
  return new Promise((resolve, reject) => {
    try {
      AXIOS({
        method: 'put',
        url: CONFIG.RabbitURL + CONFIG.vhost + VirtualHostName,
        auth: {
          username: CONFIG.RabbitServer.username,
          password: CONFIG.RabbitServer.password
        }
      }).then(function (response) {
        resolve(true);
      }).catch(err => {
        throw (err);
      })
    } catch (error) {
      reject(error);
    }
  });
}


exports.DeleteVirtualHost = (VirtualHostName) => {
  return new Promise((resolve, reject) => {
    try {
      AXIOS({
        method: 'DELETE',
        url: CONFIG.RabbitURL + VirtualHostName,
        auth: {
          username: 'test',
          password: 'test'
        }
      }).then(function (response) {
        resolve(true);
      }).catch(err => {
        throw (err);
      })
    } catch (error) {
      reject(error);
    }
  });
}

//Create a channel wrapper-queue
exports.CreateQueue = async function (input) {
  return new Promise(async (resolve, reject) => {
    try {
      if (input.queueName == "" || input.queueName == "undefined") { throw ({ message: "queueName should not be undefined" }) }
      else {
        let channel = await Connection(input.vhost);
        await channel.assertQueue(input.queueName, input.options).catch(e=>{reject(e);});
        resolve(true);
      }
    }
    catch (err) {
      reject(err);
    }
  });
};

// Send messages until someone hits CTRL-C or something goes wrong... Direct Queue Exchange
module.exports.createExchangeAndPublish = async function (input) {
  return new Promise(async (resolve, reject) => {
    try {
      if (input.msg == undefined || input.msg == "") { throw ({ headerkey: "msg should be provided." }); }
      else {
        let channel = {};
        if (input.queue.exchange.exchangeType != "default") {
          channel = await createExchange(input);
          await channel.publish(input.queue.exchange.exchangeName, input.key, Buffer.from(input.msg));
          await channel.bindQueue(input.queue.queueName, input.queue.exchange.exchangeName, input.key);
        } else {
          channel = await Connection(input.vhost);
          await channel.sendToQueue(input.queue.queueName, Buffer.from(input.msg));
        }
        resolve(true);
      }
    }
    catch (err) {
      reject(err);
    }
  });
};

// module.exports.checkQueue = async function (queueName) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       let channel = await Connection();
//       await channel.checkQueue(queueName, (err, ok) => {
//         if (err) resolve(false);
//         resolve(true);
//       });
//     } catch (error) {
//       reject(error)
//     }
//   });
// };

// module.exports.checkExchange = async function (exchangeName) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       let channel = await Connection();
//       await channel.checkExchange(exchangeName, (err, ok) => {
//         if (err) resolve(false);
//         resolve(true);
//       });
//     } catch (error) {
//       reject(error)
//     }
//   });
// };

module.exports.consumeMessages = async function (input) {
  return new Promise(async (resolve, reject) => {
    let receivemsg = []
    try {
      let channel = await Connection(input.vhost);
      let options = {
        noAck: true
      };
      await channel.consume(input.queue.queueName, function (msg) {
        if (msg.content) {
          receivemsg.push(msg.content.toString());
        }
      }, options);
      resolve(receivemsg);
    }
    catch (err) {
      reject(err);
    }
  });
};




//Delete Queue
module.exports.deleteQueue = async function (input) {
  return new Promise(async (resolve, reject) => {
    try {
      if (input.queue.queueName == "" || input.queue.queueName == "undefined") { throw ({ type: "Queuename should not be undefined" }) }
      else {
        let channel = await Connection(input.vhost);
        await channel.deleteQueue(input.queue.queueName);
        resolve(true);
      }
    }
    catch (err) {
      reject(err);
    }
  });
};

module.exports.consume = async function (input) {
  return new Promise(async (resolve, reject) => {
    let receivemsg = []
    try {
      let channel = await Connection(input.vhost);
      let options = {
        noAck: input.noAck,
        consumerTag: input.consumerTag,
        noLocal: input.noLocal,
        exclusive: input.exclusive,
        priority: input.priority,
        arguments: input.arguments
      };
      options = JSON.parse(JSON.stringify(options));
      await channel.consume(input.queueName, function (msg) {
        if (msg.content) {
          receivemsg.push(msg.content.toString());
        }
      }, options);
      resolve(receivemsg);
    }
    catch (err) {
      reject(err);
    }
  });
};

module.exports.ackAll = async function (vhost) {
  return new Promise(async (resolve, reject) => {
    try {
      let channel = await Connection(vhost);
      await channel.ackAll();
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.ack = async function (input) {
  return new Promise(async (resolve, reject) => {
    try {
      if (input.message == null || input.message == undefined) { throw ({ message: "message must be provided to ack." }); }
      else {
        let channel = await Connection(input.vhost);
        input.allUpTo = input.allUpTo ? input.allUpTo : false;
        await channel.ack(input.message, input.allUpTo);
        resolve(true);
      }
    } catch (error) {
      reject(error);
    }
  })
}

module.exports.nackAll = async function (vhost) {
  return new Promise(async (resolve, reject) => {
    try {
      let channel = await Connection(vhost);
      await channel.nackAll();
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.purgeQueue = async function (input) {
  return new Promise(async (resolve, reject) => {
    try {
      let channel = await Connection(input.vhost);
      await channel.purgeQueue(input.queue.queueName);
      resolve(true);
    }
    catch (error) {
      reject(error)
    }
  });
};

module.exports.nack = async function (input) {
  return new Promise(async (resolve, reject) => {
    try {
      if (input.message == null || input.message == undefined) { throw ({ message: "message must be provided to ack." }); }
      else {
        let channel = await Connection(input.vhost);
        input.allUpTo = input.allUpTo ? input.allUpTo : false;
        await channel.nack(message, input.allUpTo);
        resolve(true);
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.getAllMessageCount = async function (input) {
  return new Promise(async (resolve, reject) => {
    try {
      let channel = await Connection(input.vhost);
      let queue = await channel.assertQueue(input.queueName, input.options)
      resolve(queue.messageCount);

    }
    catch (error) {
      reject(error);
    }
  });
};


async function createExchange(input) {
  let channel = await Connection(input.vhost);
  await channel.assertExchange(input.queue.exchange.exchangeName, input.queue.exchange.exchangeType, input.queue.exchange.arguments);
  return channel;
}

