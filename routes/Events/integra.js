var socketImport = require('../../app');
var amqp = require('amqplib/callback_api');
var io = socketImport.io;

var integra = io.of('/integra');

function senToQueue(data){
    amqp.connect('amqp://test:test@issez-s155:5672/', function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
            throw error1;
            }
            var exchange = 'logs';
            var msg = process.argv.slice(2).join(' ') || data;

            channel.assertExchange(exchange, 'fanout', {
            durable: false
            });
            channel.publish(exchange, '', Buffer.from(msg));
            console.log(" [x] Sent %s", msg);
        });

        // setTimeout(function() {
        //     connection.close();
        //     process.exit(0);
        // }, 500);

    });
}


    integra.on('connection', function(client) {
        console.log('someone connected');
        integra.emit('status', 'New User joined');

        client.emit('status','||...Connection Established to the server...||');
        client.on('send',(data)=>{
            client.emit('receive',data);
            senToQueue(data); //--------------------------------->>send to queue
        });

        amqp.connect('amqp://test:test@issez-s155:5672/', function(error0, connection) {
            if (error0) {
                throw error0;
            }
            connection.createChannel(function(error1, channel) {
                if (error1) {
                throw error1;
                }
                var exchange = 'logs';

                channel.assertExchange(exchange, 'fanout', {
                durable: false
                });

                channel.assertQueue('', {
                exclusive: true
                }, function(error2, q) {
                if (error2) {
                    throw error2;
                }
                console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
                channel.bindQueue(q.queue, exchange, '');
                console.log(`QueueName: ${q.queue}`);

                channel.consume(q.queue, function(msg) {
                    if(msg.content) {
                        console.log(" [x] %s", msg.content.toString()); //--------------------------------->>receive from queue
                        client.emit('receive',`Data retrieved from broker: ${msg.content.toString()}`); //--------------->> froward to consumer
                    }
                }, {
                    noAck: true
                });
                });
            });
        });

    });




module.exports.integraSocket = integra;