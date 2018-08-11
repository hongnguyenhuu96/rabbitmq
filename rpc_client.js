#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

var args = process.argv.slice(2);

// rabbit document example

// client want to find out the value of fibonacci number at numth position
// if (args.length === 0) {
//     console.log("Usage: rpc_client.js num");
//     process.exit(1);
// }

// amqp.connect('amqp://localhost', function (err, conn) {
//     conn.createChannel(function (err, ch) {

//         // create a queue to receive message with random name and type is exclusive (1 queue <-> 1 connection, close conection -> delete queue)
//         ch.assertQueue('', { exclusive: true }, function (err, q) {
//             var corr = generateUuid(); // random a correlationId 
//             var num = parseInt(args[0]);

//             console.log(' [x] Requesting fib(%d)', num);

//             ch.consume(q.queue, function (msg) {
//                 if (msg.properties.correlationId === corr) {
//                     console.log(' [.] Got %s', msg.content.toString());
//                     setTimeout(function () { conn.close(); process.exit(0) }, 500);
//                 }
//             }, { noAck: true });

//             ch.sendToQueue('rpc_queue',
//                 Buffer.from(num.toString()),
//                 { correlationId: corr, replyTo: q.queue });
//         });
//     });
// });
// node rpc_client.js 30

// my example

if (args.length === 0) {
    console.log("Usage: rpc_client.js num1 num2 num3");
    process.exit(1);
}

amqp.connect('amqp://localhost', function (err, conn) {
    conn.createChannel(function (err, ch) {

        // create a queue to receive message with random name and type is exclusive (1 queue <-> 1 connection, close conection -> delete queue)
        ch.assertQueue('', { exclusive: true }, function (err, q) {
            let corr = []; // random a correlationId 
            for (let i = 0; i < args.length; i++) {
                corr.push(generateUuid())
            }

            ch.consume(q.queue, function (msg) {
                let i = corr.indexOf(msg.properties.correlationId)
                if (i != -1) {
                    console.log(' [.] Fibo %s is %s', args[i], msg.content.toString());
                    setTimeout(function () { conn.close(); process.exit(0) }, 3000);
                }
            }, { noAck: true });

            args.forEach((num, i) => {
                console.log(' [x] Requesting fib(%s)', num);
                ch.sendToQueue('rpc_queue',
                    Buffer.from(num.toString()),
                    { correlationId: corr[i], replyTo: q.queue });
            })
        });
    });
});

function generateUuid() {
    return Math.random().toString() +
        Math.random().toString() +
        Math.random().toString();
}

// input
// node rpc_server.js terminal1
// node rpc_server.js terminal2
// node rpc_client.js 40 20 5 30 terminal3


// output
// terminal2: server do the caculation // do 3
// [x] Awaiting RPC requests
// [.] fib(20)
// [.] fib(5)
// [.] fib(30)


// terminal1: server do the caculation // do 1
// [x] Awaiting RPC requests
// [.] fib(40)

//terminal3: client want to caculate fibonacci number
// [x]Requesting fib(40)
// [x] Requesting fib(20)
// [x] Requesting fib(5)
// [x] Requesting fib(30)
// [.] Fibo 20 is 6765
// [.] Fibo 5 is 5
// [.] Fibo 30 is 832040
// [.] Fibo 40 is 102334155 (call first but appear last)