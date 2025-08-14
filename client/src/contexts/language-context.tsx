import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ne';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.signin': 'Sign In',
    'nav.signup': 'Sign Up',
    'nav.becomeWorker': 'Become a Professional',
    
    // Common
    'common.loading': 'Loading...',
    'common.search': 'Search',
    'common.book': 'Book Now',
    'common.viewAll': 'View All',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    
    // Home page
    'home.hero.title': 'Trusted Home Services in Nepal',
    'home.hero.subtitle': 'Connect with verified professionals for all your home service needs',
    'home.services.title': 'Our Services',
    'home.testimonials.title': 'What Our Customers Say',
    'home.howItWorks.title': 'How It Works',
    
    // Professional registration
    'worker.title': 'Join as a Professional',
    'worker.step1': 'Personal Information',
    'worker.step2': 'Professional Details',
    'worker.success': 'Registration Successful!',
    'worker.bio.label': 'Professional Bio',
    'worker.experience.label': 'Years of Experience',
    'worker.skills.label': 'Skills & Services',
    'worker.areas.label': 'Service Areas',
    
    // Booking
    'booking.title': 'Book Service',
    'booking.selectDate': 'Select Date',
    'booking.selectTime': 'Select Time',
    'booking.location': 'Service Location',
    'booking.payment': 'Payment Method',
    
    // Language toggle
    'lang.switch': 'नेपाली',
  },
  ne: {
    // Navigation
    'nav.home': 'होम',
    'nav.services': 'सेवाहरू',
    'nav.about': 'हाम्रो बारे',
    'nav.contact': 'सम्पर्क',
    'nav.signin': 'साइन इन',
    'nav.signup': 'साइन अप',
    'nav.becomeWorker': 'पेशेवर बन्नुहोस्',
    
    // Common
    'common.loading': 'लोड हुँदै...',
    'common.search': 'खोज्नुहोस्',
    'common.book': 'अब बुक गर्नुहोस्',
    'common.viewAll': 'सबै हेर्नुहोस्',
    'common.submit': 'पेश गर्नुहोस्',
    'common.cancel': 'रद्द गर्नुहोस्',
    'common.save': 'सेभ गर्नुहोस्',
    
    // Home page
    'home.hero.title': 'नेपालमा भरपर्दो घर सेवाहरू',
    'home.hero.subtitle': 'तपाईंको सबै घर सेवा आवश्यकताहरूको लागि प्रमाणित पेशेवरहरूसँग जोडिनुहोस्',
    'home.services.title': 'हाम्रा सेवाहरू',
    'home.testimonials.title': 'हाम्रा ग्राहकहरू के भन्छन्',
    'home.howItWorks.title': 'यो कसरी काम गर्छ',
    
    // Professional registration
    'worker.title': 'पेशेवरको रूपमा जोडिनुहोस्',
    'worker.step1': 'व्यक्तिगत जानकारी',
    'worker.step2': 'पेशेवर विवरणहरू',
    'worker.success': 'दर्ता सफल!',
    'worker.bio.label': 'पेशेवर बायो',
    'worker.experience.label': 'अनुभवका वर्षहरू',
    'worker.skills.label': 'सीप र सेवाहरू',
    'worker.areas.label': 'सेवा क्षेत्रहरू',
    
    // Booking
    'booking.title': 'सेवा बुक गर्नुहोस्',
    'booking.selectDate': 'मिति छान्नुहोस्',
    'booking.selectTime': 'समय छान्नुहोस्',
    'booking.location': 'सेवा स्थान',
    'booking.payment': 'भुक्तानी विधि',
    
    // Language toggle
    'lang.switch': 'English',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('en');

  // Load language preference from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ne')) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ne' : 'en');
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}