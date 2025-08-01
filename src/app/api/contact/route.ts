import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    try {
        console.log('Contact form API called');
        console.log('RESEND_API_KEY present:', !!process.env.RESEND_API_KEY);

        const body = await request.json();
        const { name, email, phone, subject, message } = body;

        console.log('Form data received:', { name, email, phone, subject, message: message?.substring(0, 50) + '...' });

        // Validation
        if (!name || !email || !subject || !message) {
            console.log('Validation failed - missing required fields');
            return NextResponse.json(
                { error: 'Gerekli alanlar eksik' },
                { status: 400 }
            );
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('Email validation failed');
            return NextResponse.json(
                { error: 'Geçersiz e-posta adresi' },
                { status: 400 }
            );
        }

        console.log('Attempting to send email with Resend...');

        // Send email using Resend
        const { data, error } = await resend.emails.send({
            from: 'Jaxophone İletişim <noreply@jaxophone.com>',
            to: ['kyetim.busi@gmail.com'], // Buraya kendi e-posta adresinizi yazın
            subject: `Yeni İletişim Formu: ${subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                    <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #F59E0B; margin-bottom: 20px; text-align: center;">🎸 Jaxophone İletişim Formu</h2>
                        
                        <div style="margin-bottom: 20px;">
                            <h3 style="color: #333; margin-bottom: 10px;">📋 Form Detayları</h3>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #666;">Ad Soyad:</td>
                                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${name}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #666;">E-posta:</td>
                                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${email}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #666;">Telefon:</td>
                                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${phone || 'Belirtilmemiş'}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #666;">Konu:</td>
                                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${subject}</td>
                                </tr>
                            </table>
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <h3 style="color: #333; margin-bottom: 10px;">💬 Mesaj</h3>
                            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #F59E0B;">
                                <p style="margin: 0; line-height: 1.6; color: #333;">${message.replace(/\n/g, '<br>')}</p>
                            </div>
                        </div>
                        
                        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                            <p style="color: #666; font-size: 14px; margin: 0;">
                                Bu e-posta Jaxophone web sitesi iletişim formundan gönderilmiştir.<br>
                                Gönderim tarihi: ${new Date().toLocaleString('tr-TR')}
                            </p>
                        </div>
                    </div>
                </div>
            `,
            replyTo: email, // Kullanıcının e-posta adresine yanıt verebilirsiniz
        });

        if (error) {
            console.error('Resend API error details:', error);
            console.error('Error message:', error.message);

            // Daha detaylı hata mesajları
            let errorMessage = 'E-posta gönderilirken bir hata oluştu';

            if (error.message?.includes('401')) {
                errorMessage = 'API anahtarı geçersiz. Lütfen Resend API anahtarınızı kontrol edin.';
            } else if (error.message?.includes('403')) {
                errorMessage = 'E-posta gönderme yetkiniz yok. Resend hesabınızı kontrol edin.';
            } else if (error.message?.includes('422')) {
                errorMessage = 'E-posta formatı geçersiz. Lütfen e-posta adreslerini kontrol edin.';
            } else if (error.message) {
                errorMessage = `Resend Hatası: ${error.message}`;
            }

            return NextResponse.json(
                { error: errorMessage },
                { status: 500 }
            );
        }

        console.log('Email sent successfully:', data);

        // Success response
        return NextResponse.json(
            {
                success: true,
                message: 'Mesajınız başarıyla gönderildi!',
                data
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Contact form error:', error);
        console.error('Error type:', typeof error);
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');

        return NextResponse.json(
            { error: 'Sunucu hatası oluştu' },
            { status: 500 }
        );
    }
} 