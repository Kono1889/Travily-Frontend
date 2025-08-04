import { motion } from 'framer-motion';

const MobileMenu = ({ setMenuOpen }) => {
  return (
    <motion.div
      initial={{ height: 0 }}
      animate={{ height: '100vh' }}
      exit={{ height: 0 }}
      className="fixed top-0 left-0 w-full bg-white flex flex-col items-center justify-center gap-8 z-10"
    >
      <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
      <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
      <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
    </motion.div>
  );
}

export default MobileMenu;