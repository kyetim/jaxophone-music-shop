import { NextRequest, NextResponse } from 'next/server';
import { NewsletterService } from '@/lib/firestore';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    try {
        const { subject, message, type } = await request.json();

        if (!subject || !message) {
            return NextResponse.json(
                { error: 'Konu ve mesaj gereklidir' },
                { status: 400 }
            );
        }

        // Get all newsletter subscribers
        const subscribers = await NewsletterService.getAllSubscribers();

        if (subscribers.length === 0) {
            return NextResponse.json(
                { message: 'E-posta abonesi bulunamadı' },
                { status: 200 }
            );
        }

        // Send email to all subscribers
        const emailPromises = subscribers.map(async (subscriber: any) => {
            try {
                await resend.emails.send({
                    from: 'Jaxophone <noreply@jaxophone.com>',
                    to: subscriber.email,
                    subject: subject,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <div style="background: linear-gradient(135deg, #f59e0b, #ea580c); padding: 20px; text-align: center;">
                                <h1 style="color: white; margin: 0;">🎷 Jaxophone</h1>
                                <p style="color: #fef3c7; margin: 5px 0 0 0;">Müziğin Tutkunu</p>
                            </div>
                            
                            <div style="padding: 30px; background: white;">
                                <h2 style="color: #1f2937; margin-bottom: 20px;">${subject}</h2>
                                <div style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
                                    ${message.replace(/\n/g, '<br>')}
                                </div>
                                
                                <div style="text-align: center; margin-top: 30px;">
                                    <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://jaxophone.com'}" 
                                       style="background: linear-gradient(135deg, #f59e0b, #ea580c); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
                                        Mağazamızı Ziyaret Et
                                    </a>
                                </div>
                            </div>
                            
                            <div style="background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
                                <p>Bu e-postayı almak istemiyorsanız, <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://jaxophone.com'}/unsubscribe?email=${subscriber.email}" style="color: #f59e0b;">abonelikten çıkabilirsiniz</a>.</p>
                                <p>&copy; 2024 Jaxophone. Tüm hakları saklıdır.</p>
                            </div>
                        </div>
                    `
                });
            } catch (error) {
                console.error(`Error sending email to ${subscriber.email}:`, error);
            }
        });

        await Promise.all(emailPromises);

        return NextResponse.json(
            { message: `${subscribers.length} aboneye e-posta gönderildi` },
            { status: 200 }
        );
    } catch (error) {
        console.error('Newsletter email sending error:', error);
        return NextResponse.json(
            { error: 'E-posta gönderilirken bir hata oluştu' },
            { status: 500 }
        );
    }
} 