import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Music,
    Heart,
    Award,
    Users,
    Globe,
    Star,
    Truck,
    Shield,
    Clock,
    Phone,
    Mail,
    MapPin,
    ArrowRight,
    Quote
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
    const stats = [
        { label: 'Mutlu Müzisyen', value: '50,000+', icon: Users },
        { label: 'Ürün Çeşidi', value: '10,000+', icon: Music },
        { label: 'Yıllık Deneyim', value: '25+', icon: Award },
        { label: 'Şehirde Hizmet', value: '81', icon: Globe }
    ];

    const values = [
        {
            icon: Music,
            title: 'Müzik Tutkusu',
            description: 'Müziğin evrensel dilini konuşan herkesin hayallerini gerçekleştirmek için buradayız.',
            color: 'text-amber-600'
        },
        {
            icon: Heart,
            title: 'Kaliteli Hizmet',
            description: 'Her müşterimize özel yaklaşım ve profesyonel danışmanlık hizmeti sunuyoruz.',
            color: 'text-red-500'
        },
        {
            icon: Award,
            title: 'Güvenilir Kalite',
            description: 'Yalnızca dünya markalarından orijinal ve garantili ürünler satıyoruz.',
            color: 'text-blue-600'
        },
        {
            icon: Shield,
            title: 'Güvenli Alışveriş',
            description: 'SSL sertifikalı güvenli ödeme sistemi ve koşulsuz iade garantisi.',
            color: 'text-green-600'
        }
    ];

    const team = [
        {
            name: 'Ahmet Melodi',
            role: 'Kurucu & CEO',
            instrument: 'Gitar',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
            description: '25 yıllık müzik deneyimi ile Jaxophone\'u kurdu.'
        },
        {
            name: 'Elif Nota',
            role: 'Ürün Müdürü',
            instrument: 'Piyano',
            image: 'https://images.unsplash.com/photo-1494790108755-2616b4e1ba03?w=300&h=300&fit=crop&crop=face',
            description: 'Müzik akademisi mezunu, ürün seçiminde uzman.'
        },
        {
            name: 'Can Ritim',
            role: 'Teknik Direktör',
            instrument: 'Davul',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
            description: 'Ses teknolojileri konusunda 15 yıllık deneyim.'
        },
        {
            name: 'Seda Armoni',
            role: 'Müşteri İlişkileri',
            instrument: 'Keman',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
            description: 'Müşteri memnuniyeti odaklı profesyonel yaklaşım.'
        }
    ];

    const services = [
        { icon: Truck, title: 'Ücretsiz Kargo', description: '500₺ üzeri siparişlerde' },
        { icon: Shield, title: '2 Yıl Garanti', description: 'Tüm enstrümanlarda' },
        { icon: Clock, title: '24 Saat Destek', description: 'Teknik danışmanlık' },
        { icon: Star, title: 'Kurulum Hizmeti', description: 'Ücretsiz kurulum' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <Header />

            <main className="overflow-hidden">
                {/* Hero Section */}
                <section className="relative py-20 lg:py-32 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <Badge className="bg-gradient-to-r from-amber-600 to-orange-600 text-white border-0 text-sm px-4 py-2">
                                        Müziğin Kalbi
                                    </Badge>
                                    <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                        Müziğin
                                        <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent block">
                                            Tutkunuzu
                                        </span>
                                        Yaşatıyoruz
                                    </h1>
                                    <p className="text-xl text-gray-600 leading-relaxed">
                                        1998 yılından bu yana Türkiye&apos;nin en büyük müzik enstrümanları mağazası olarak,
                                        müzisyenlerin hayallerini gerçekleştirmek için buradayız.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button
                                        size="lg"
                                        className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                                        asChild
                                    >
                                        <Link href="/products">
                                            Ürünleri Keşfet
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="border-amber-300 text-amber-700 hover:bg-amber-50 px-8 py-4 rounded-xl font-semibold cursor-pointer"
                                        asChild
                                    >
                                        <Link href="#contact">İletişime Geç</Link>
                                    </Button>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                                    <Image
                                        src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=600&fit=crop"
                                        alt="Müzik Enstrümanları"
                                        width={600}
                                        height={600}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-6 shadow-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full flex items-center justify-center">
                                            <Music className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-2xl text-gray-900">25+</div>
                                            <div className="text-sm text-gray-600">Yıllık Deneyim</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center group cursor-pointer">
                                    <div className="w-16 h-16 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <stat.icon className="h-8 w-8 text-white" />
                                    </div>
                                    <div className="font-bold text-3xl text-gray-900 mb-2">{stat.value}</div>
                                    <div className="text-gray-600">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Story Section */}
                <section className="py-20 bg-gradient-to-r from-gray-50 to-gray-100">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                                        Hikayemiz
                                    </h2>
                                    <p className="text-lg text-gray-600 leading-relaxed">
                                        1998 yılında küçük bir dükkanda başlayan yolculuğumuz, bugün Türkiye&apos;nin
                                        en güvenilir müzik enstrümanları mağazası haline geldi.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <blockquote className="relative p-6 bg-white rounded-xl shadow-lg">
                                        <Quote className="absolute top-4 left-4 h-6 w-6 text-amber-600 opacity-50" />
                                        <p className="text-gray-700 italic pl-8">
                                            &quot;Müzik, insanların kalbiyle konuşmasının en güzel yoludur.
                                            Biz de bu dili konuşan herkese kapımızı açık tutuyoruz.&quot;
                                        </p>
                                        <footer className="mt-4 pl-8">
                                            <div className="font-semibold text-gray-900">Ahmet Melodi</div>
                                            <div className="text-sm text-gray-600">Kurucu & CEO</div>
                                        </footer>
                                    </blockquote>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-4 bg-white rounded-lg shadow">
                                        <div className="font-bold text-2xl text-amber-600">1998</div>
                                        <div className="text-sm text-gray-600">Kuruluş Yılı</div>
                                    </div>
                                    <div className="text-center p-4 bg-white rounded-lg shadow">
                                        <div className="font-bold text-2xl text-amber-600">50K+</div>
                                        <div className="text-sm text-gray-600">Mutlu Müşteri</div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                                    <Image
                                        src="https://images.unsplash.com/photo-1571327073757-af4cf893f3e6?w=600&h=450&fit=crop"
                                        alt="Müzik Mağazası"
                                        width={600}
                                        height={450}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                                Değerlerimiz
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Her adımımızda müşteri memnuniyeti ve kaliteyi ön planda tutarak,
                                müzik dünyasında fark yaratıyoruz.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {values.map((value, index) => (
                                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer">
                                    <CardContent className="p-6 text-center space-y-4">
                                        <div className={`w-16 h-16 rounded-xl bg-gray-50 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}>
                                            <value.icon className={`h-8 w-8 ${value.color}`} />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900">{value.title}</h3>
                                        <p className="text-gray-600">{value.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                                Ekibimiz
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Müzik tutkusu ve uzmanlığıyla size en iyi hizmeti sunmak için burada olan ekibimiz.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {team.map((member, index) => (
                                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer">
                                    <CardContent className="p-6 text-center space-y-4">
                                        <div className="relative w-24 h-24 mx-auto">
                                            <Image
                                                src={member.image}
                                                alt={member.name}
                                                width={96}
                                                height={96}
                                                className="rounded-full object-cover w-full h-full shadow-lg group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                                            <p className="text-amber-600 font-medium">{member.role}</p>
                                            <p className="text-sm text-gray-500">{member.instrument}</p>
                                        </div>
                                        <p className="text-gray-600 text-sm">{member.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                                Hizmetlerimiz
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Müzik yolculuğunuzda yanınızda olmak için sunduğumuz profesyonel hizmetler.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {services.map((service, index) => (
                                <div key={index} className="text-center group cursor-pointer">
                                    <div className="w-16 h-16 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <service.icon className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                                    <p className="text-gray-600">{service.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="py-20 bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                                Bizimle İletişime Geçin
                            </h2>
                            <p className="text-xl text-white/90 max-w-3xl mx-auto">
                                Sorularınız mı var? Müzik yolculuğunuzda size nasıl yardımcı olabileceğimizi öğrenin.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 mb-12">
                            <div className="text-center text-white">
                                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Phone className="h-8 w-8" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Telefon</h3>
                                <p className="text-white/90">0212 555 0123</p>
                            </div>

                            <div className="text-center text-white">
                                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Mail className="h-8 w-8" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">E-posta</h3>
                                <p className="text-white/90">info@jaxophone.com</p>
                            </div>

                            <div className="text-center text-white">
                                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <MapPin className="h-8 w-8" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Adres</h3>
                                <p className="text-white/90">Müzik Sokak No:1 Beyoğlu/İstanbul</p>
                            </div>
                        </div>

                        <div className="text-center">
                            <Button
                                size="lg"
                                className="bg-white text-amber-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                                asChild
                            >
                                <Link href="/contact">
                                    Detaylı İletişim
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="space-y-4">
                            <div className="text-2xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
                                🎷 Jaxophone
                            </div>
                            <p className="text-gray-400">
                                Müziğin tutkununu yaşatan Türkiye&apos;nin en büyük enstrüman mağazası.
                            </p>
                            <div className="flex space-x-4">
                                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-amber-600 transition-colors cursor-pointer">
                                    <Music className="h-5 w-5" />
                                </div>
                                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-amber-600 transition-colors cursor-pointer">
                                    <Heart className="h-5 w-5" />
                                </div>
                                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-amber-600 transition-colors cursor-pointer">
                                    <Star className="h-5 w-5" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold">Hızlı Linkler</h4>
                            <div className="space-y-2">
                                <Link href="/products" className="block text-gray-400 hover:text-white transition-colors cursor-pointer">
                                    Ürünler
                                </Link>
                                <Link href="/categories" className="block text-gray-400 hover:text-white transition-colors cursor-pointer">
                                    Kategoriler
                                </Link>
                                <Link href="/brands" className="block text-gray-400 hover:text-white transition-colors cursor-pointer">
                                    Markalar
                                </Link>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold">Müşteri Hizmetleri</h4>
                            <div className="space-y-2">
                                <Link href="/contact" className="block text-gray-400 hover:text-white transition-colors cursor-pointer">
                                    İletişim
                                </Link>
                                <Link href="/shipping" className="block text-gray-400 hover:text-white transition-colors cursor-pointer">
                                    Kargo Bilgileri
                                </Link>
                                <Link href="/returns" className="block text-gray-400 hover:text-white transition-colors cursor-pointer">
                                    İade & Değişim
                                </Link>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold">İletişim</h4>
                            <div className="space-y-2 text-gray-400">
                                <p>📞 0212 555 0123</p>
                                <p>✉️ info@jaxophone.com</p>
                                <p>📍 Müzik Sokak No:1 Beyoğlu/İstanbul</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 Jaxophone Music Shop. Tüm hakları saklıdır.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
} 