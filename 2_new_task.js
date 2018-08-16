#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost:5672', function (err, conn) {
    conn.createChannel(function (err, ch) {
        var q = 'task_queue';
        var msg = process.argv.slice(2).join(' ') || "Hello World!";

        ch.assertQueue(q, { durable: true });
        // durable is true to make rabit reload the queue if rabit was crash or restart (make the queue durable)
        // variables of an existing queue can not be changed (hello -> define new queue named task_queue)

        ch.sendToQueue(q, Buffer.from(msg), { persistent: true });
        // persistent is true -> save message to disk
        // Marking messages as persistent doesn't fully guarantee that a message won't be lost. 
        console.log(" [x] Sent '%s'", msg);
    });
    setTimeout(function () { conn.close(); process.exit(0) }, 500);
});


// node  2_new_task.js First message..
// node  2_new_task.js Second message..
// node  2_new_task.js Third message...
// node 2_new_task.js Fourth message....
// node  2_new_task.js Fifth message.....