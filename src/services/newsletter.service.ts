// import nodemailer from "../nodemailer"
import SubscribedUserCrud from "../crud/subscribedUser.crud"
import {NodemailerInterface} from "../interfaces/nodemailer.interfaces"
import {Queue} from "bullmq"
import config from "../config"

const {bullmqConfig}  = config

class NewsletterService {
   private queue: Queue;
   private subscribedUserCRUD: typeof SubscribedUserCrud;

    constructor() {
      this.queue = new Queue<NodemailerInterface>(bullmqConfig.queueName, {
         connection: bullmqConfig.connection,
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

       return subscribedUser;
    }

    async unsubscribeFromNewsletter(email:string){

      const removedUser = await this.subscribedUserCRUD.delete(email);
      if(!removedUser){
         return false;
      }

           await this.queue.add('send-simple',{
        from: "jaron.beatty5@ethereal.email",
        subject: 'Unsubscribed to newsletter',
        text: 'You have successfully sunsubscribed to newsletter',
        to: `${email}`
       })

       console.log(`Enqueued an email sending`);

       return removedUser;
    }

}

export default new NewsletterService();