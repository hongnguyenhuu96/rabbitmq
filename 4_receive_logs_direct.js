let amqp = require('amqplib/callback_api')

// node 4_receive_logs_direct.js info warning error
// args = ['info', 'warning', 'info']
let args = process.argv.slice(2)

// if the log lever (severity is not set -> nothing to output)
if (args.length == 0) {
    console.log("Usage: receive_logs_direct.js [info] [warning] [error]");
    process.exit(1);
}

amqp.connect('amqp://localhost', (err, conn) => {
    conn.createChannel((err, ch) => {
        // set the name of exchange to direct_logs, type of exchange is direct (see the exlaination in emit file)
        let ex = 'direct_logs'
        ch.assertExchange(ex, 'direct', { durable: false })

        // auto generate queue with random name, 1 queue <-> 1 connection
        ch.assertQueue('', { exclusive: true }, (err, q) => {
            console.log(' [*] Waiting for logs. To exit press CTRL + C')

            // bind the queue to the exchange and set the binding key of queue to severity
            args.forEach(severity => ch.bindQueue(q.queue, ex, severity))

            // ch.bindQueue('random name', 'direct_logs', 'info')
            // ch.bindQueue('random name', 'direct_logs', 'waring')
            // ch.bindQueue('random name', 'direct_logs', 'error')
            // -> queue q will recieve any message that has the binding key in ['info', 'warning', 'info'] from the exchange

            // bring the message from the channel to the queue and output
            ch.consume(q.queue, (msg) => {
                console.log(' [x] %s: "%s"', msg.fields.routingKey, msg.content.toString())
            }, { noAck: true })
        })
    })
})