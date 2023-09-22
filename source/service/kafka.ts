import { Kafka } from 'kafkajs';
import env from '../config/env';

let kafka = new Kafka({
    clientId: env.kafka.clientId,
    brokers: [env.kafka.cluster],
    ssl: true,
    logLevel: 0,
    sasl: {
        mechanism: 'plain',
        username: env.kafka.username,
        password: env.kafka.password,
    },
});

export const produce = async (topic: string, message: string) => {
    const producer = kafka.producer();
    await producer.connect();
    await producer.send({
        topic,
        messages: [{ value: message }],
    });
    await producer.disconnect();
};

export const consume = async (topic: string, group: string, callback: (message: string) => void) => {
    const consumer = kafka.consumer({ groupId: group });
    await consumer.connect();

    await consumer.subscribe({ topic, fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            callback(message.value?.toString() || '');
        },
    });
};
