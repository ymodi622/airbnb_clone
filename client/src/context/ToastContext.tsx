import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';

interface ToastContextType {
    showToast: (message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');

    const showToast = useCallback((msg: string = 'Service is not available') => {
        setMessage(msg);
        setIsVisible(true);
    }, []);

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Global Toast Container */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
                <AnimatePresence>
                    {isVisible && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="bg-neutral-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium tracking-wide"
                        >
                            {message}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
