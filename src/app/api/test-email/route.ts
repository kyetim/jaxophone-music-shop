import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: 'E-posta adresi gereklidir' },
                { status: 400 }
            );
        }

        if (!process.env.RESEND_API_KEY) {
            return NextResponse.json(
                { error: 'RESEND_API_KEY yapılandırılmamış' },
                { status: 500 }
            );
        }

        console.log('Attempting to send email via Resend...');

        const emailData = {
            from: 'Jaxophone <noreply@jaxophone.com>',
            to: email,
            subject: 'Jaxophone - Test E-postası',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #f59e0b, #ea580c); padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0;">🎷 Jaxophone</h1>
                        <p style="color: #fef3c7; margin: 5px 0 0 0;">Müziğin Tutkunu</p>
                    </div>
                    
                    <div style="padding: 30px; background: white;">
                        <h2 style="color: #1f2937; margin-bottom: 20px;">Test E-postası</h2>
                        <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
                            Bu bir test e-postasıdır. E-posta sistemi çalışıyor!
                        </p>
                        
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://jaxophone.com'}" 
                               style="background: linear-gradient(135deg, #f59e0b, #ea580c); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
                                Mağazamızı Ziyaret Et
                            </a>
                        </div>
                    </div>
                    
                    <div style="background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
                        <p>&copy; 2024 Jaxophone. Tüm hakları saklıdır.</p>
                    </div>
                </div>
            `
        };

        const result = await resend.emails.send(emailData);

        console.log('Resend API response:', JSON.stringify(result, null, 2));

        // Check if the email was actually sent
        if (result && result.data && result.data.id) {
            console.log(`Email sent successfully with ID: ${result.data.id}`);
            return NextResponse.json(
                {
                    message: 'Test e-postası başarıyla gönderildi',
                    emailId: result.data.id,
                    result: result,
                    timestamp: new Date().toISOString()
                },
                { status: 200 }
            );
        } else {
            console.error('Resend returned unexpected response:', result);
            return NextResponse.json(
                {
                    error: 'E-posta gönderildi ancak beklenmeyen yanıt alındı',
                    result: result
                },
                { status: 500 }
            );
        }
    } catch (error: any) {
        console.error('Test email error details:', {
            message: error?.message || 'Unknown error',
            stack: error?.stack,
            name: error?.name || 'Unknown error type'
        });

        return NextResponse.json(
            {
                error: 'Test e-postası gönderilirken hata oluştu',
                details: {
                    message: error?.message || 'Unknown error',
                    name: error?.name || 'Unknown error type'
                }
            },
            { status: 500 }
        );
    }
} 