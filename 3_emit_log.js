let amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (err, conn) => {
    conn.createChannel((err, ch) => {
        let ex = 'logs'
        let msg = process.argv.slice(2).join(' ') || 'Hello World'

        ch.assertExchange(ex, 'fanout', { durable: false });
        ch.publish(ex, '', Buffer.from(msg))
        console.log(' [x] Sent %s', msg)
    })
    setTimeout(() => { conn.close(); process.exit(0) }, 500)
})

// fanout: exchange will send the message to all binded queue
// name of queue will be ignore because of fanout method -> send to all binded queue -> no need to specify

