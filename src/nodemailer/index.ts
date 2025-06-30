import nodemailer from "nodemailer";
import config from "../config";
import {Job} from 'bullmq'
import {NodemailerInterface} from "../interfaces/nodemailer.interfaces"

const {nodemailerConfig} = config;

const transporter = nodemailer.createTransport({
    host: nodemailerConfig.host,
    port: nodemailerConfig.port,
    auth: {
        user: nodemailerConfig.auth.user,
        pass: nodemailerConfig.auth.pass,
    }
})


export default (job: Job<NodemailerInterface>) =>  transporter.sendMail(job.data);