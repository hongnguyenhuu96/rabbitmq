var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (err, conn) {
    conn.createChannel(function (err, ch) {
        var q = 'task_queue';

        ch.assertQueue(q, { durable: true });
        // durable is true to make rabit reload the queue if rabit was crash or restart (make the queue durable)
        // variables of an existing queue can not be changed (hello -> define new queue named task_queue)
        ch.prefetch(1);
        // This tells RabbitMQ not to give more than one message to a worker at a time.
        // Or, in other words, don't dispatch a new message to a worker 
        // until it has processed and acknowledged the previous one
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
        ch.consume(q, function (msg) {
            var secs = msg.content.toString().split('.').length - 1;

            console.log(" [x] Received %s", msg.content.toString());
            setTimeout(function () {
                console.log(" [x] Done");
                ch.ack(msg);
            }, secs * 1000);
        }, { noAck: false });
        // send acknowledgement to rabbit to said that I am done and you can send me new task and also
        // guarantee in case the worker is processing the task and die -> no ack send back to rabbit -> rabbit send noackmessage to another worker
    });
});