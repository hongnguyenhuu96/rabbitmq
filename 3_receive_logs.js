let amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (err, conn) => {
    conn.createChannel((err, ch) => {
        let ex = 'logs'

        ch.assertExchange(ex, 'fanout', { durable: false })

        ch.assertQueue('', { exclusive: true }, (err, q) => {
            // assertQueue -> name of queue will be auto generate and then set to q
            // exclusive -> queue is used by only one connection and will be deleted when that connection closes

            console.log(" [*] Waiting for messages in %s. To exit press CTRL + C", q.queue)

            ch.bindQueue(q.queue, ex, '')
            // bind queue to the exchange

            ch.consume(q.queue, (msg) => {
                console.log(' [x] %s', msg.content.toString())
            }, { noAck: true })
        })

    })
})


// if open 2 recieve_logs (node 3_recieve_log on 2 separate terminal)
// 2 queue will be generated with random name and binded to the exchange
// because the option for assertQueue have exclusive = true, each queue correspond to a client on a terminal
// when we disconnect the client (ex: close the terminal) -> the corresponding queue will be delete
