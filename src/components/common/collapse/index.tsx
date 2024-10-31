import { useState } from 'react';
import {AnimatePresence, motion } from "framer-motion"

interface CollapseProps {
  children: JSX.Element | JSX.Element[];
  isOpen: boolean;
}

export default function Collapse({ children, isOpen }: CollapseProps) {
  return (
    <div className="w-full">
      <AnimatePresence>
      {isOpen && (
        <motion.div 
        key={+isOpen}
        initial={{height: 0}}
        animate={{height: "fit-content"}}
        exit={{height: 0}}
        transition={{duration: 0.25, ease: "easeInOut"}}
        
        className={`transition-[max-height] ease-in-out duration-300 overflow-hidden`}>
          {children}
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
