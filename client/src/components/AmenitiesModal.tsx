import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

type AmenitiesModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AmenitiesModal({ isOpen, onClose }: AmenitiesModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden text-neutral-900 z-10 border border-neutral-100"
          >
            {/* Header with Close button */}
            <div className="p-6 pb-2 flex items-center shrink-0">
              <button
                onClick={onClose}
                className="p-2 -ml-2 rounded-full hover:bg-neutral-100 transition-colors focus:outline-none text-neutral-900 cursor-pointer"
                aria-label="Close modal"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Content Body */}
            <div className="px-6 sm:px-8 pb-8 overflow-y-auto custom-scrollbar flex-1 space-y-8">
              <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">What this place offers</h2>

              {/* Bathroom Category */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Bathroom</h3>
                <div className="divide-y divide-neutral-200/70 text-base">
                  <div className="py-4 flex items-center gap-4 text-neutral-800">
                    <svg className="w-6 h-6 text-neutral-800 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M4.5 12h11.25M15.75 12a3.75 3.75 0 100-7.5H6.75A2.25 2.25 0 004.5 6.75v5.25m11.25 0v3.75a2.25 2.25 0 01-2.25 2.25h-1.5a.75.75 0 01-.75-.75V12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Hairdryer</span>
                  </div>
                  <div className="py-4 flex items-center gap-4 text-neutral-800">
                    <svg className="w-6 h-6 text-neutral-800 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25V12.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 12.75v5.25a2.25 2.25 0 002.25 2.25z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Cleaning products</span>
                  </div>
                  <div className="py-4 flex items-center gap-4 text-neutral-800">
                    <svg className="w-6 h-6 text-neutral-800 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 13.682A4.5 4.5 0 003.375 16.86v.14c0 2.485 2.015 4.5 4.5 4.5h8.25c2.485 0 4.5-2.015 4.5-4.5v-.14a4.5 4.5 0 00-1.625-3.178l-4.091-3.273a2.25 2.25 0 01-.659-1.591V3.104" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Shampoo</span>
                  </div>
                  <div className="py-4 flex items-center gap-4 text-neutral-800">
                    <svg className="w-6 h-6 text-neutral-800 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Hot water</span>
                  </div>
                  <div className="py-4 flex items-center gap-4 text-neutral-800">
                    <svg className="w-6 h-6 text-neutral-800 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.75 20.25h16.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Shower gel</span>
                  </div>
                </div>
              </div>

              {/* Bedroom and laundry Category */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Bedroom and laundry</h3>
                <div className="divide-y divide-neutral-200/70 text-base">
                  <div className="py-4 flex items-center gap-4 text-neutral-800">
                    <svg className="w-6 h-6 text-neutral-800 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M6 3h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2zm6 5a4 4 0 100 8 4 4 0 000-8z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Washing machine</span>
                  </div>
                  <div className="py-4 flex items-center gap-4 text-neutral-800">
                    <svg className="w-6 h-6 text-neutral-800 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M12 3a2.25 2.25 0 00-2.25 2.25c0 .66.286 1.255.744 1.666L3.375 13.5a1.5 1.5 0 00.957 2.625h15.336a1.5 1.5 0 00.957-2.625L13.506 6.916A2.243 2.243 0 0014.25 5.25 2.25 2.25 0 0012 3z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Hangers</span>
                  </div>
                  <div className="py-4 flex items-center gap-4 text-neutral-800">
                    <svg className="w-6 h-6 text-neutral-800 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Bed linen</span>
                  </div>
                  <div className="py-4 flex items-center gap-4 text-neutral-800">
                    <svg className="w-6 h-6 text-neutral-800 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M3.75 6.75h16.5M3.75 10.5h16.5M3.75 14.25h16.5M3.75 18h16.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Room-darkening blinds</span>
                  </div>
                </div>
              </div>

              {/* Kitchen and dining Category */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Kitchen and dining</h3>
                <div className="divide-y divide-neutral-200/70 text-base">
                  <div className="py-4 flex items-center gap-4 text-neutral-800">
                    <svg className="w-6 h-6 text-neutral-800 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Fully equipped modular kitchen</span>
                  </div>
                  <div className="py-4 flex items-center gap-4 text-neutral-800">
                    <svg className="w-6 h-6 text-neutral-800 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Microwave & Coffee maker</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
