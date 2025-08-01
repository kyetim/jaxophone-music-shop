import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    try {
        console.log('Test email API called');
        console.log('RESEND_API_KEY present:', !!process.env.RESEND_API_KEY);
        console.log('API Key first 10 chars:', process.env.RESEND_API_KEY?.substring(0, 10) + '...');

        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: ['kyetim.busi@gmail.com'],
            subject: 'Test E-postası - Jaxophone',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
                    <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #F59E0B; text-align: center;">🎸 Jaxophone Test E-postası</h2>
                        <p style="color: #333; font-size: 16px; line-height: 1.6;">
                            Bu bir test e-postasıdır. Resend API'nin çalışıp çalışmadığını kontrol etmek için gönderilmiştir.
                        </p>
                        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 20px;">
                            <p style="margin: 0; color: #666;">
                                <strong>Gönderim Zamanı:</strong> ${new Date().toLocaleString('tr-TR')}
                            </p>
                        </div>
                    </div>
                </div>
            `,
        });

        if (error) {
            console.error('Test email error:', error);
            return NextResponse.json(
                { error: `Test e-postası gönderilemedi: ${error.message}` },
                { status: 500 }
            );
        }

        console.log('Test email sent successfully:', data);
        return NextResponse.json(
            { success: true, message: 'Test e-postası başarıyla gönderildi!', data },
            { status: 200 }
        );

    } catch (error) {
        console.error('Test email API error:', error);
        return NextResponse.json(
            { error: 'Test e-postası gönderilirken hata oluştu' },
            { status: 500 }
        );
    }
} 