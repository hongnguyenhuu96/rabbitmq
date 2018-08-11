var amqp = require("amqplib/callback_api")

amqp.connect('amqp://localhost', (err, conn) => {
    conn.createChannel((err, ch) => {
        let ex = 'direct_logs' // create exchange direact_logs

        let args = process.argv.slice(2)
        // get input arguments args = ['info', 'Run. Run. Or it will explode.']
        // node 4_emit_log_direct.js error "Run. Run. Or it will explode."

        let msg = args.slice(1).join(' ') || 'Hello World!' // = Run. Run. Or it will explode.
        let severity = (args.length > 0) ? args[0] : 'info' // = info

        ch.assertExchange(ex, 'direct', { durable: false })
        // type of exchange is direct (exchange send message to the queue with rule
        // (binding key of queue = bidding key of the message))

        ch.publish(ex, severity, Buffer.from(msg))
        // set the binding key of the msg to severity and send it to rabbitmq exchange

        console.log(' [x] Sent %s: %s', severity, msg)
    })
    setTimeout(() => {
        conn.close()
        process.exit(0)
    }, 500);
})