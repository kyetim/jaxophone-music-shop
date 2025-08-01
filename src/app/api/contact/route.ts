import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, phone, subject, message } = body;

        // Validation
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: 'Gerekli alanlar eksik' },
                { status: 400 }
            );
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Geçersiz e-posta adresi' },
                { status: 400 }
            );
        }

        // Send email using Resend
        const { data, error } = await resend.emails.send({
            from: 'Jaxophone İletişim <noreply@jaxophone.com>',
            to: ['info@jaxophone.com'], // Buraya kendi e-posta adresinizi yazın
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
            console.error('Resend error:', error);
            return NextResponse.json(
                { error: 'E-posta gönderilirken bir hata oluştu' },
                { status: 500 }
            );
        }

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
        return NextResponse.json(
            { error: 'Sunucu hatası oluştu' },
            { status: 500 }
        );
    }
} 