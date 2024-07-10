import { SubscriberArgs, SubscriberConfig } from '@medusajs/medusa';

export default async function customerVerifiedHandler({
    data,
    eventName,
    container,
}: SubscriberArgs<{ email: string }>) {
    let smtpMailService = container.resolve('smtpMailService');

    //TODO: parameterize this with (a) the support email addr and (b) the URL of Hamza
    await smtpMailService.sendMail({
        from: process.env.SMTP_FROM,
        subject: 'Email Verified',
        templateName: 'verify-confirmation',
        to: data.email,
        mailData: {},
    });
    return;
    // Do something with the order
}

export const config: SubscriberConfig = {
    event: 'customer.verified',
};
