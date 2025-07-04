import {Worker} from "bullmq"
import config from "../config"
import processor from "./"
import {BullMQOtel} from "bullmq-otel"

const {bullmqConfig} = config


export function initWorker() {
    const worker = new Worker(bullmqConfig.queueName, processor, {
        connection: bullmqConfig.connection,
        concurrency: bullmqConfig.concurrency
    })

    worker.on('completed', (job) => {
        console.log(`Completed job ${job.id} successfully`)
    })

    worker.on('failed', (job, err) => {
        console.log(`Failed Job ${job.id} with ${err}`)
    })

}