var amqp = require("amqplib/callback_api")

amqp.connect('amqp://localhost', (err, conn) => {
    conn.createChannel((err, ch) => {
        let ex = 'topic_logs' // create exchange topic_logs

        let args = process.argv.slice(2)
        // get input arguments args = ['kern.critical', 'A critical kernel error']
        // node 5_emit_log_topic.js "kern.critical" "A critical kernel error"

        let msg = args.slice(1).join(' ') || 'Hello World!' // = A critical kernel error
        let key = (args.length > 0) ? args[0] : 'anonymous.info' // = kern.critical

        ch.assertExchange(ex, 'topic', { durable: false })
        // type of exchange is topic

        //KEY BINDING STRATEGY
        // assum the key type is (<speed>.<colour>.<species>) lazy.orage.dog

        // queue 1,2,3 binds to topic_logs

        // queue 1 key: *.orange.* -> interested in orange animal -> can recieve message with 3 words: speed.orange.tiger 
        // queue 2 key: *.*.rabbit -> interested in rabbit -> can recieve message meesage with 3 words: speed.white.rabbit
        // queue 3 key: lazy.# -> interested in lazy animal -> can revieve massage with the word lazy at the head: lazy.dog | lazy.black.cat.is.sick
        // *. one word, #.zero or many words

        ch.publish(ex, key, Buffer.from(msg))
        // set the binding key of the msg to key and send it to rabbitmq exchange

        console.log(' [x] Sent %s: %s', key, msg)
    })
    setTimeout(() => {
        conn.close()
        process.exit(0)
    }, 500);
})