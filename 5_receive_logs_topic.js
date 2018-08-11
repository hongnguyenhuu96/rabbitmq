let amqp = require('amqplib/callback_api')

// node 5_receive_logs_topic.js "kern.*" "*.critical"
let args = process.argv.slice(2) // ['kern.*', '*.critical']

// key is not set -> nothing to output
if (args.length == 0) {
    console.log("Usage: receive_logs_topic.js <facility>.<severity>");
    process.exit(1);
}

amqp.connect('amqp://localhost', (err, conn) => {
    conn.createChannel((err, ch) => {
        // set the name of exchange to topic_logs, type of exchange is topic (see the exlaination in emit file)
        let ex = 'topic_logs'
        ch.assertExchange(ex, 'topic', { durable: false })

        // auto generate queue with random name, 1 queue <-> 1 connection
        ch.assertQueue('', { exclusive: true }, (err, q) => {
            console.log(' [*] Waiting for logs. To exit press CTRL + C')

            // bind the queue to the exchange and set the binding key of queue to key
            args.forEach(key => ch.bindQueue(q.queue, ex, key))

            // this comsumer is interested in kernel and critical error

            // ch.bindQueue('random name', 'topic_logs', 'kern.*')
            // ch.bindQueue('random name', 'topic_logs', '*.critical')

            // -> queue q can recieve message that has the format key kern.* and *.critical
            // example: message with 'kern.normal', 'network.critical' key -> ok
            // example: meesage with 'network.normal' -> not interested to receive -> refuse

            // bring the message from the channel to the queue and output
            ch.consume(q.queue, (msg) => {
                console.log(' [x] %s: "%s"', msg.fields.routingKey, msg.content.toString())
            }, { noAck: true })
        })
    })
})