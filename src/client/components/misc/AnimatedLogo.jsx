import { motion } from 'framer-motion';

export const AnimatedLogo = ({ size = 40 }) => {
  const containerVariants = {
    hover: {
      scale: 1.05,
      transition: { type: 'spring', stiffness: 300, damping: 10 }
    }
  };

  const circleVariants = {
    animate: {
      rotate: [0, 360],
      transition: { duration: 20, repeat: Infinity, ease: 'linear' }
    }
  };

  const dotVariants = {
    animate: {
      scale: [1, 1.2, 1],
      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      whileHover="hover"
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        width: size,
        height: size,
        position: 'relative'
      }}
    >
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        variants={circleVariants}
        animate="animate"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="var(--primary)"
          strokeWidth="2"
          strokeDasharray="10 5"
        />
      </motion.svg>
      <motion.svg
        width={size * 0.6}
        height={size * 0.6}
        viewBox="0 0 24 24"
        fill="none"
        style={{ position: 'absolute' }}
      >
        <motion.path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
          fill="var(--primary)"
          opacity="0.2"
          variants={dotVariants}
          animate="animate"
        />
        <motion.path
          d="M12 5v14M5 12h14"
          stroke="var(--primary)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </motion.svg>
    </motion.div>
  );
};

export default AnimatedLogo;
