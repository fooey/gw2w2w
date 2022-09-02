import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { MdRefresh } from 'react-icons/md';

interface ISpinnerProps {
  isActive: boolean;
}
export const Spinner: React.FC<ISpinnerProps> = ({ isActive }) => {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <MdRefresh className={`animate-spin text-2xl`} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
