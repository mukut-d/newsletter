// import nodemailer from "../nodemailer"
import SubscribedUserCrud from "../crud/subscribedUser.crud"
import {NodemailerInterface} from "../interfaces/nodemailer.interfaces"
import {Queue} from "bullmq"
import config from "../config"
import {BullMQOtel} from 'bullmq-otel'

const {bullmqConfig}  = config

class NewsletterService {
   private queue: Queue;
   private subscribedUserCRUD: typeof SubscribedUserCrud;
   private cronPattern: '0 0 12 * * 5';

    constructor() {
      this.queue = new Queue<NodemailerInterface>(bullmqConfig.queueName, {
         connection: bullmqConfig.connection,
         telemetry: new BullMQOtel('newsletter-tracer')
      })


      this.subscribedUserCRUD = SubscribedUserCrud;
    }

    async subscribeToNewsletter(email: string){

      const subscribedUser = await this.subscribedUserCRUD.create(email);
      if(!subscribedUser){
         return false;
      }

       await this.queue.add('send-simple',{
        from: "jaron.beatty5@ethereal.email",
        subject: 'Subscribed to newsletter',
        text: 'You have successfully subscribed to newsletter',
        to: `${email}`
       })

       console.log(`Enqueued an email sending`)

       await this.startSendingWeeklyEmails(email);

       return subscribedUser;
    }

    async unsubscribeFromNewsletter(email:string){

      const removedUser = await this.subscribedUserCRUD.delete(email);
      if(!removedUser){
         return false;
      }

      await this.queue.add('send-simple',{
        from: "mukut.m.das2000@gmail.com",
        subject: 'Unsubscribed from a newsletter',
        text: 'You have successfully sunsubscribed to newsletter',
        to: `${email}`
       })

       console.log(`Enqueued an email sending`);

       const result = await this.stopSendingWeeklyEmails(email);
       console.log(result ? `scheduler for email ${email} removed` : `scheduler for email: ${email} not found`);

       return removedUser;
    }

    private async startSendingWeeklyEmails(email: string){
      await this.queue.upsertJobScheduler(
         `${email}`,
         {pattern: this.cronPattern},
         {name: 'send-weekly-newsletter',
            data: {
               from: 'newsletter@example.email',
               subject: 'weekly newsletter',
               text: 'newsletter',
               to: `${email}`
            }
         }
      )
    }

    private async stopSendingWeeklyEmails(email: string){
      return this.queue.removeJobScheduler(`${email}`)
    }

}

export default new NewsletterService();