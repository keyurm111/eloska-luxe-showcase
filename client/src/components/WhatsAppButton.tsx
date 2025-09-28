import React, { useState } from 'react';
import { X, ExternalLink } from 'lucide-react';

// WhatsApp Logo SVG Component
const WhatsAppLogo = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
  </svg>
);

// IndiaMART Logo Image Component
const IndiaMARTLogo = ({ className }: { className?: string }) => (
  <img
    src="/india mart.jpeg"
    alt="IndiaMART"
    className={`${className} object-contain`}
  />
);

const FloatingButtons = () => {
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const [indiamartOpen, setIndiamartOpen] = useState(false);

  const phoneNumber = '+919978064763'; // WhatsApp number
  const message = 'Hello! I am interested in your products. Can you please help me?';
  const indiamartUrl = 'https://www.indiamart.com/eloskaworld/';

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    
    // Add a small delay for better UX
    setTimeout(() => {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }, 100);
    
    setWhatsappOpen(false);
  };

  const handleIndiaMARTClick = () => {
    setTimeout(() => {
      window.open(indiamartUrl, '_blank', 'noopener,noreferrer');
    }, 100);
    
    setIndiamartOpen(false);
  };

  const handleWhatsAppButtonClick = () => {
    if (whatsappOpen) {
      setWhatsappOpen(false);
    } else {
      handleWhatsAppClick();
    }
  };

  const handleIndiaMARTButtonClick = () => {
    if (indiamartOpen) {
      setIndiamartOpen(false);
    } else {
      handleIndiaMARTClick();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col space-y-3">
      {/* IndiaMART Button */}
      <button
        onClick={handleIndiaMARTButtonClick}
        className="indiamart-button group relative bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-900 rounded-full p-3 sm:p-4 shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-gray-400/50 focus:outline-none focus:ring-4 focus:ring-gray-300/30 touch-manipulation border border-gray-200"
        aria-label="Visit our IndiaMART store"
        title="Visit our IndiaMART store"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gray-100/50 rounded-full scale-75"></div>
          <IndiaMARTLogo className="relative h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        
        {/* Ripple effect */}
        <div className="absolute inset-0 rounded-full bg-gray-200 opacity-0 group-active:opacity-30 transition-opacity duration-150"></div>
        
        {/* Tooltip - Hidden on mobile */}
        <div className="indiamart-tooltip absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none hidden sm:block">
          Visit our IndiaMART store
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
        </div>
      </button>

      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsAppButtonClick}
        className="whatsapp-button group relative bg-[#25D366] hover:bg-[#20BA5A] active:bg-[#1DA851] text-white rounded-full p-3 sm:p-4 shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-[#25D366]/50 focus:outline-none focus:ring-4 focus:ring-[#25D366]/30 touch-manipulation"
        aria-label="Contact us on WhatsApp"
        title="Chat with us on WhatsApp"
      >
        {/* WhatsApp logo with subtle background */}
        <div className="relative">
          <div className="absolute inset-0 bg-white/20 rounded-full scale-75"></div>
          <WhatsAppLogo className="relative h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        
        {/* Ripple effect */}
        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-active:opacity-20 transition-opacity duration-150"></div>
        
        {/* Tooltip - Hidden on mobile */}
        <div className="whatsapp-tooltip absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none hidden sm:block">
          Chat with us on WhatsApp
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
        </div>
      </button>

      {/* IndiaMART Floating Message */}
      {indiamartOpen && (
        <div className="absolute bottom-20 right-0 bg-white rounded-lg shadow-2xl p-4 max-w-xs border border-gray-200 animate-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-semibold text-gray-900 text-sm">IndiaMART Store</h4>
            <button
              onClick={() => setIndiamartOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-gray-600 text-xs mb-3">
            Visit our IndiaMART store to see all products
          </p>
          <button
            onClick={handleIndiaMARTClick}
            className="w-full bg-white hover:bg-gray-50 text-gray-900 text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 border border-gray-200"
          >
            <IndiaMARTLogo className="h-4 w-4" />
            <span>Visit Store</span>
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* WhatsApp Floating Message */}
      {whatsappOpen && (
        <div className="absolute bottom-20 right-0 bg-white rounded-lg shadow-2xl p-4 max-w-xs border border-gray-200 animate-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-semibold text-gray-900 text-sm">Quick Chat</h4>
            <button
              onClick={() => setWhatsappOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-gray-600 text-xs mb-3">
            Click to start a conversation on WhatsApp
          </p>
          <button
            onClick={handleWhatsAppClick}
            className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <WhatsAppLogo className="h-4 w-4" />
            <span>Open WhatsApp</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default FloatingButtons;
