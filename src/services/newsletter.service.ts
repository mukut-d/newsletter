import nodemailer from "../nodemailer"

class NewsletterService {
    constructor() {}

    async subscribeToNewsletter(email: string){
       await nodemailer.sendMail({
        from: "newsletter@example.email",
        subject: 'Subscribed to newsletter',
        text: 'You have successfully subscribed to newsletter',
        to: `${email}`
       })

       return true;
    }

    async unsubscribeFromNewsletter(email:string){
           await nodemailer.sendMail({
        from: "newsletter@example.email",
        subject: 'Unsubscribed to newsletter',
        text: 'You have successfully sunsubscribed to newsletter',
        to: `${email}`
       })

       return true;
    }

}

export default new NewsletterService();