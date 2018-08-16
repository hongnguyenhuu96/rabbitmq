# rabbitmq
Run: `$ docker run -d --hostname my-rabbit --name some-rabbit -p 5672:5672 rabbitmq`

## Hello world
![1_helloworld](https://www.rabbitmq.com/img/tutorials/python-one-overall.png)
![1](https://user-images.githubusercontent.com/12449250/44225238-25cbcb00-a1b7-11e8-8820-e3e6dc7fdfc4.png)

## Work queue (load balancing task for comsumer using 1 queue)
![2_workqueue](https://www.rabbitmq.com/img/tutorials/prefetch-count.png)
![2](https://user-images.githubusercontent.com/12449250/44225239-26646180-a1b7-11e8-9b48-e5bc11662946.png)

## Public/subscribe (fanout to message to all consumer)
![3_fanout](https://www.rabbitmq.com/img/tutorials/python-three-overall.png)
![3](https://user-images.githubusercontent.com/12449250/44225240-26646180-a1b7-11e8-9b34-9e4f2f7c9fcb.png)

## Routing (direct - key mapping (chanel procuder and chanel comsumer share the same key to communicate) )
![4_routing](https://www.rabbitmq.com/img/tutorials/direct-exchange.png)
![4](https://user-images.githubusercontent.com/12449250/44225241-26fcf800-a1b7-11e8-8a50-4787de4a7cb6.png)

## Topics (topic - key mapping (key producer chanel: *.*.rabbit, lazy.#), key consumer: speed.white.rabbit, lazy.man))
![5_topics](https://www.rabbitmq.com/img/tutorials/python-five.png)
![5](https://user-images.githubusercontent.com/12449250/44225242-26fcf800-a1b7-11e8-8941-16d003de7239.png)

## Remote procedure call (RPC) (Multi servers serve one client)
![6_RPC](https://www.rabbitmq.com/img/tutorials/python-six.png)
![6](https://user-images.githubusercontent.com/12449250/44225243-27958e80-a1b7-11e8-8b55-87c8e10f5ba9.png)

