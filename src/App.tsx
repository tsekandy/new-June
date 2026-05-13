import React, { useState, useEffect } from 'react';
import { Pill, Clock, Shield, Truck, MessageCircle, Upload, ArrowRight, Phone, Mail, MapPin, Star } from 'lucide-react';
import WhatsAppPickerModal from './components/WhatsAppPickerModal';
import Header from './components/Header';
import HolidayHero from './components/HolidayHero';
import ProductCarousel from './components/ProductCarousel';
import Services from './components/Services';
import PrescriptionUpload from './components/PrescriptionUpload';
import PaymentCallback from './components/PaymentCallback';
import AboutUs from './components/pages/AboutUs';
import ServicesPage from './components/pages/ServicesPage';
import BecomePartner from './components/pages/BecomePartner';
import Careers from './components/pages/Careers';
import Feedback from './components/pages/Feedback';
import Rewards from './components/pages/Rewards';
import Locations from './components/pages/Locations';
import DrugFund from './components/pages/DrugFund';
import SEOAnalyzer from './components/pages/SEOAnalyzer';
import MedicineSearch from './components/MedicineSearch';
import WellnessHub from './components/WellnessHub';
import SpecialtyMedicineRequest from './components/SpecialtyMedicineRequest';
import TrustSignals from './components/TrustSignals';
import ArticleDetail from './components/ArticleDetail';
import PharmacistPickerModal from './components/PharmacistPickerModal';
import { getPharmacySchema, getFAQSchema } from './utils/schemaMarkup';

export default function App() {
  const initialSlug = new URLSearchParams(window.location.search).get('article');
  const [currentPage, setCurrentPage] = useState(initialSlug ? 'article' : 'home');
  const [articleSlug, setArticleSlug] = useState<string | null>(initialSlug);
  const [showPharmacistPicker, setShowPharmacistPicker] = useState(false);
  const [showFloatingWhatsApp, setShowFloatingWhatsApp] = useState(false);

  const showPage = (page: string) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  const showHome = () => {
    setCurrentPage('home');
    window.history.pushState({}, '', window.location.pathname);
    window.scrollTo(0, 0);
  };
  const viewArticle = (slug: string) => {
    setArticleSlug(slug);
    setCurrentPage('article');
    window.history.pushState({}, '', `?article=${slug}`);
    window.scrollTo(0, 0);
  };
  const backFromArticle = () => {
    setArticleSlug(null);
    setCurrentPage('home');
    window.history.pushState({}, '', window.location.pathname);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const handlePopState = () => {
      const slug = new URLSearchParams(window.location.search).get('article');
      if (slug) {
        setArticleSlug(slug);
        setCurrentPage('article');
      } else {
        setArticleSlug(null);
        setCurrentPage('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach((s) => s.remove());
    const pharmacySchema = document.createElement('script');
    pharmacySchema.type = 'application/ld+json';
    pharmacySchema.innerHTML = JSON.stringify(getPharmacySchema());
    document.head.appendChild(pharmacySchema);
    const faqSchema = document.createElement('script');
    faqSchema.type = 'application/ld+json';
    faqSchema.innerHTML = JSON.stringify(getFAQSchema());
    document.head.appendChild(faqSchema);
  }, []);

  const isCallbackPage =
    window.location.pathname === '/payment-callback' ||
    window.location.search.includes('OrderTrackingId');

  if (isCallbackPage) return <PaymentCallback />;

  const renderPage = () => {
    if (currentPage === 'article' && articleSlug)
      return <ArticleDetail slug={articleSlug} onBack={backFromArticle} onArticleChange={viewArticle} />;
    if (currentPage === 'about') return <AboutUs onBack={showHome} />;
    if (currentPage === 'services') return <ServicesPage onBack={showHome} />;
    if (currentPage === 'partner') return <BecomePartner onBack={showHome} />;
    if (currentPage === 'careers') return <Careers onBack={showHome} />;
    if (currentPage === 'feedback') return <Feedback onBack={showHome} />;
    if (currentPage === 'rewards') return <Rewards onBack={showHome} />;
    if (currentPage === 'locations') return <Locations onBack={showHome} />;
    if (currentPage === 'drugfund') return <DrugFund onBack={showHome} />;
    if (currentPage === 'seo') return <SEOAnalyzer onBack={showHome} />;
    return null;
  };

  const subPage = renderPage();

  return (
    <div className="min-h-screen bg-white">
      <Header onNavigate={showPage} />

      {subPage ? (
        /* Sub-page: content offset by header height */
        <div className="pt-16 md:pt-20">{subPage}</div>
      ) : (
        /* Home page */
        <>
          <HolidayHero />

          {/* Smart Medicine Search */}
          <section className="section-padding bg-white border-b border-neutral-100">
            <div className="section-container max-w-3xl">
              <div className="mb-6">
                <p className="text-sm font-semibold text-primary-600 tracking-wide uppercase mb-2">Find Medicines Fast</p>
                <h2 className="heading-md text-neutral-900 mb-3">Search by Medicine Name or Symptom</h2>
              </div>
              <MedicineSearch />
            </div>
          </section>

          {/* Trust Bar */}
          <section className="bg-white border-b border-neutral-100">
            <div className="section-container py-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {[
                  { icon: <Pill className="w-6 h-6" />, label: 'All Categories', value: 'Complete range' },
                  { icon: <Truck className="w-6 h-6" />, label: 'Import Service', value: 'Any medication' },
                  { icon: <Shield className="w-6 h-6" />, label: 'Licensed', value: 'NDA approved' },
                  { icon: <Clock className="w-6 h-6" />, label: '24/7 Available', value: 'Always open' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="shrink-0 w-12 h-12 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900 text-sm">{item.label}</p>
                      <p className="text-xs text-neutral-500">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <ProductCarousel />
          <Services />

          {/* How It Works */}
          <section className="section-padding bg-neutral-50">
            <div className="section-container">
              <div className="text-center mb-16">
                <p className="text-sm font-semibold text-primary-600 tracking-wide uppercase mb-3">How It Works</p>
                <h2 className="heading-lg text-neutral-900 mb-4">Getting your medication is simple</h2>
                <p className="text-body-lg max-w-2xl mx-auto">
                  Three easy steps to access professional pharmaceutical care from Uganda's leading pharmacy.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                {[
                  {
                    step: '01',
                    title: 'Upload Your Prescription',
                    description: 'Upload your prescription images or PDF files through our secure platform. Our system accepts all common file formats.',
                    icon: <Upload className="w-7 h-7" />,
                  },
                  {
                    step: '02',
                    title: 'Professional Review',
                    description: 'Our licensed pharmacists review your prescription, verify details, and prepare your medication with expert care.',
                    icon: <Shield className="w-7 h-7" />,
                  },
                  {
                    step: '03',
                    title: 'Pickup or Delivery',
                    description: 'Collect your medication at our Nansana location or arrange delivery across Kampala, Wakiso, Mukono, and Jinja.',
                    icon: <Truck className="w-7 h-7" />,
                  },
                ].map((item, i) => (
                  <div key={i} className="relative">
                    <div className="card p-8 h-full">
                      <div className="flex items-center gap-4 mb-5">
                        <div className="w-14 h-14 rounded-xl bg-primary-600 text-white flex items-center justify-center shrink-0">
                          {item.icon}
                        </div>
                        <span className="text-5xl font-bold text-neutral-100">{item.step}</span>
                      </div>
                      <h3 className="heading-sm text-neutral-900 mb-3">{item.title}</h3>
                      <p className="text-body">{item.description}</p>
                    </div>
                    {i < 2 && (
                      <div className="hidden md:flex absolute top-1/2 -right-6 transform -translate-y-1/2 text-neutral-300 z-10">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="section-padding bg-white">
            <div className="section-container">
              <div className="text-center mb-16">
                <p className="text-sm font-semibold text-primary-600 tracking-wide uppercase mb-3">Testimonials</p>
                <h2 className="heading-lg text-neutral-900 mb-4">What our customers are saying</h2>
                <p className="text-body-lg max-w-2xl mx-auto">
                  Real experiences from customers across Kampala, Wakiso, Mukono & Jinja.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    quote: "The staff here are so friendly and helpful. They always take time to explain my medications clearly.",
                    name: "Sarah M.",
                    location: "Kampala",
                    image: "https://iili.io/FOgoSh7.jpg",
                  },
                  {
                    quote: "I've been coming here for years. The pharmacists are knowledgeable and the service is excellent.",
                    name: "James K.",
                    location: "Wakiso",
                    image: "https://iili.io/FOgoUQ9.jpg",
                  },
                  {
                    quote: "The WhatsApp service is so convenient! I can get help for my family's medication needs anytime.",
                    name: "Mary A.",
                    location: "Mukono",
                    image: "https://iili.io/FOgorBe.jpg",
                  },
                ].map((testimonial, i) => (
                  <div key={i} className="card p-8">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 text-accent-400 fill-accent-400" />
                      ))}
                    </div>
                    <p className="text-neutral-700 leading-relaxed mb-6 italic">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-neutral-900 text-sm">{testimonial.name}</p>
                        <p className="text-xs text-neutral-500">{testimonial.location}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="bg-primary-800 section-padding">
            <div className="section-container">
              <div className="text-center mb-12">
                <h2 className="heading-lg text-white mb-4">The backbone of pharmaceutical care in Uganda</h2>
                <p className="text-primary-200 text-lg max-w-2xl mx-auto">
                  Thousands of families trust Happy Pills Pharmacy for their healthcare needs.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { value: '1000+', label: 'Happy Customers' },
                  { value: '24/7', label: 'Availability' },
                  { value: '4', label: 'Service Areas' },
                  { value: '5', label: 'Star Rating' },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <p className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</p>
                    <p className="text-primary-300 text-sm font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <TrustSignals />
          <SpecialtyMedicineRequest />
          <WellnessHub onArticleClick={viewArticle} />

          {/* Prescription Upload */}
          <section id="upload" className="section-padding bg-white">
            <div className="section-container max-w-5xl">
              <PrescriptionUpload />
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="section-padding bg-neutral-900">
            <div className="section-container">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div>
                  <p className="text-sm font-semibold text-primary-400 tracking-wide uppercase mb-3">Contact Us</p>
                  <h2 className="heading-lg text-white mb-6">
                    Ready to experience Uganda's best pharmaceutical care?
                  </h2>
                  <p className="text-neutral-400 text-lg mb-10 leading-relaxed">
                    Contact Happy Pills Pharmacy through your preferred method. Serving Kampala, Wakiso, Mukono & Jinja.
                  </p>

                  <div className="space-y-6">
                    {[
                      { icon: <Phone className="w-5 h-5" />, label: 'Phone', details: ['+256 709 745 309', '+256 782 504 503'] },
                      { icon: <Mail className="w-5 h-5" />, label: 'Email', details: ['happypillspharmacy@gmail.com'] },
                      { icon: <MapPin className="w-5 h-5" />, label: 'Location', details: ['Zalex House, Nansana Trading Centre', 'Kampala-Hoima Road'] },
                      { icon: <MessageCircle className="w-5 h-5" />, label: 'WhatsApp', details: ['Instant consultation available'] },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary-600/20 text-primary-400 flex items-center justify-center shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm mb-1">{item.label}</p>
                          {item.details.map((d, j) => (
                            <p key={j} className="text-neutral-400 text-sm">{d}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-neutral-800 rounded-2xl p-8 md:p-10">
                  <h3 className="heading-sm text-white mb-6">Quick Actions</h3>
                  <div className="space-y-4">
                    <button
                      onClick={() => setShowPharmacistPicker(true)}
                      className="w-full btn-primary py-4 text-base"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Start WhatsApp Consultation
                    </button>
                    <button
                      onClick={() => document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' })}
                      className="w-full btn-secondary py-4 text-base border-neutral-600 text-white hover:bg-neutral-700"
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      Upload Prescription
                    </button>
                    <button
                      onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                      className="w-full bg-neutral-700 text-white py-4 px-6 rounded-lg font-semibold hover:bg-neutral-600 transition-colors text-base"
                    >
                      View All Services
                    </button>
                  </div>

                  <div className="mt-8 pt-6 border-t border-neutral-700">
                    <h4 className="text-white font-semibold text-sm mb-3">Operating Hours</h4>
                    <p className="text-neutral-400 text-sm">Monday - Sunday: 7:30 AM - 12:00 AM</p>
                    <p className="text-primary-400 text-sm font-medium mt-1">24/7 Emergency Services Available</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-neutral-950 text-white">
            <div className="section-container py-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                <div className="lg:col-span-1">
                  <div className="flex items-center gap-3 mb-4">
                    <img src="https://iili.io/FOn6LiP.jpg" alt="Happy Pills Pharmacy Logo" className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <h3 className="font-bold text-white">Happy Pills Pharmacy</h3>
                      <p className="text-xs text-neutral-500">Uganda</p>
                    </div>
                  </div>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                    Your trusted healthcare partner providing quality pharmaceutical care across Uganda.
                  </p>
                  <p className="text-neutral-500 text-xs">
                    Zalex House, Nansana Trading Centre<br />
                    Kampala-Hoima Road, Kampala<br />
                    Open: Mon-Sun 7:30 AM - 12:00 AM
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-4 text-sm tracking-wide uppercase">Quick Links</h4>
                  <ul className="space-y-3">
                    {[
                      { label: 'About Us', page: 'about' },
                      { label: 'Our Services', page: 'services' },
                      { label: 'Locations', page: 'locations' },
                      { label: 'Careers', page: 'careers' },
                      { label: 'Drug Fund', page: 'drugfund' },
                    ].map((link) => (
                      <li key={link.page}>
                        <button onClick={() => showPage(link.page)} className="text-neutral-400 hover:text-white transition-colors text-sm">
                          {link.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-4 text-sm tracking-wide uppercase">Get Involved</h4>
                  <ul className="space-y-3">
                    {[
                      { label: 'Become Partner', page: 'partner' },
                      { label: 'Rewards Program', page: 'rewards' },
                      { label: 'Give Feedback', page: 'feedback' },
                      { label: 'SEO Analyzer', page: 'seo' },
                    ].map((link) => (
                      <li key={link.page}>
                        <button onClick={() => showPage(link.page)} className="text-neutral-400 hover:text-white transition-colors text-sm">
                          {link.label}
                        </button>
                      </li>
                    ))}
                    <li>
                      <button onClick={() => window.open('https://g.page/r/CZLGojT2D8h_EAE/review', '_blank')} className="text-neutral-400 hover:text-white transition-colors text-sm">
                        Leave Review
                      </button>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-4 text-sm tracking-wide uppercase">Connect</h4>
                  <div className="space-y-3 mb-6">
                    <a href="https://www.facebook.com/hppharmacyUg/" target="_blank" rel="noopener noreferrer" className="block text-neutral-400 hover:text-white transition-colors text-sm">Facebook</a>
                    <a href="https://www.instagram.com/happypillspharmacy" target="_blank" rel="noopener noreferrer" className="block text-neutral-400 hover:text-white transition-colors text-sm">Instagram</a>
                    <a href="https://twitter.com/HppharmacyUg" target="_blank" rel="noopener noreferrer" className="block text-neutral-400 hover:text-white transition-colors text-sm">Twitter</a>
                    <a href="https://ug.linkedin.com/company/happy-pills-healthcare-limited" target="_blank" rel="noopener noreferrer" className="block text-neutral-400 hover:text-white transition-colors text-sm">LinkedIn</a>
                    <a href="https://www.tiktok.com/@happypillspharmacyug?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" className="block text-neutral-400 hover:text-white transition-colors text-sm">TikTok</a>
                    <a href="https://whatsapp.com/channel/0029VaGFM6m11ulYFtpqg41W" target="_blank" rel="noopener noreferrer" className="block text-neutral-400 hover:text-white transition-colors text-sm">WhatsApp Channel</a>
                  </div>
                  <p className="text-neutral-500 text-xs">Serving: Kampala - Wakiso - Mukono - Jinja</p>
                </div>
              </div>
            </div>

            <div className="border-t border-neutral-800">
              <div className="section-container py-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-neutral-500 text-xs">&copy; 2025 Happy Pills Pharmacy Uganda. All rights reserved.</p>
                <p className="text-neutral-600 text-xs">Licensed Pharmacy - Professional Service</p>
              </div>
            </div>
          </footer>
        </>
      )}

      {showPharmacistPicker && (
        <PharmacistPickerModal
          onClose={() => setShowPharmacistPicker(false)}
          message="Hello! I would like to speak with a pharmacist from Happy Pills Pharmacy."
        />
      )}

      {/* Floating WhatsApp Button */}
      <button
        onClick={() => setShowFloatingWhatsApp(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold text-sm px-4 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        aria-label="WhatsApp Us"
      >
        <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span>WhatsApp Us</span>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-75"></span>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></span>
      </button>

      {showFloatingWhatsApp && (
        <WhatsAppPickerModal
          onClose={() => setShowFloatingWhatsApp(false)}
          message="Hello Happy Pills Pharmacy! I need assistance with my medication needs."
          title="WhatsApp Us"
        />
      )}
    </div>
  );
}
