import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

export async function POST(request: NextRequest) {
    try {
        if (!db) {
            return NextResponse.json(
                { error: 'Veritabanı bağlantısı kurulamadı' },
                { status: 500 }
            );
        }

        const { email } = await request.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { error: 'Geçerli bir e-posta adresi giriniz' },
                { status: 400 }
            );
        }

        // Check if email already exists
        const subscribersRef = collection(db, 'newsletter_subscribers');
        const q = query(subscribersRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            return NextResponse.json(
                { error: 'Bu e-posta adresi zaten abone' },
                { status: 400 }
            );
        }

        // Add new subscriber
        await addDoc(subscribersRef, {
            email: email.toLowerCase(),
            subscribedAt: new Date(),
            isActive: true
        });

        return NextResponse.json(
            { message: 'E-posta listemize başarıyla abone oldunuz!' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        return NextResponse.json(
            { error: 'Bir hata oluştu. Lütfen tekrar deneyiniz.' },
            { status: 500 }
        );
    }
} 