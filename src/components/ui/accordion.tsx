"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

interface AccordionContextType {
  openIndex: number | null;
  setOpenIndex: (index: number | null) => void;
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  index: number;
  defaultOpen?: boolean;
}

export function AccordionItem({ title, children, index, defaultOpen = false }: AccordionItemProps) {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('AccordionItem must be used within Accordion');
  }

  const { openIndex, setOpenIndex } = context;
  const isOpen = openIndex === index;

  const handleToggle = () => {
    setOpenIndex(isOpen ? null : index);
  };

  return (
    <motion.div
      className="border-b border-border"
      initial={false}
      animate={{
        backgroundColor: isOpen ? 'rgba(0, 0, 0, 0.02)' : 'transparent',
      }}
      transition={{ duration: 0.2 }}
    >
      <motion.button
        onClick={handleToggle}
        className="w-full px-6 py-5 text-left flex items-center justify-between bg-transparent hover:bg-muted/30 transition-colors"
        whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.03)' }}
        whileTap={{ scale: 0.998 }}
      >
        <motion.span
          className="font-semibold text-base text-foreground"
          animate={{
            color: isOpen ? 'hsl(var(--foreground))' : 'hsl(var(--foreground))',
          }}
        >
          {title}
        </motion.span>
        <motion.div
          animate={{
            rotate: isOpen ? 180 : 0,
          }}
          transition={{
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        </motion.div>
      </motion.button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: {
                height: 'auto',
                opacity: 1,
                transition: {
                  height: {
                    duration: 0.4,
                    ease: [0.4, 0, 0.2, 1],
                  },
                  opacity: {
                    duration: 0.3,
                    ease: [0.4, 0, 0.2, 1],
                    delay: 0.1,
                  },
                },
              },
              collapsed: {
                height: 0,
                opacity: 0,
                transition: {
                  height: {
                    duration: 0.3,
                    ease: [0.4, 0, 0.2, 1],
                  },
                  opacity: {
                    duration: 0.2,
                    ease: [0.4, 0, 0.2, 1],
                  },
                },
              },
            }}
            style={{ overflow: 'hidden' }}
          >
            <motion.div
              className="px-6 py-5 text-muted-foreground leading-relaxed"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1],
                delay: 0.15,
              }}
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface AccordionProps {
  children: ReactNode;
  className?: string;
  defaultOpenIndex?: number;
}

export function Accordion({ children, className, defaultOpenIndex = 0 }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  return (
    <AccordionContext.Provider value={{ openIndex, setOpenIndex }}>
      <motion.div
        className={cn("border border-border", className)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        {children}
      </motion.div>
    </AccordionContext.Provider>
  );
}
