import { motion } from 'framer-motion';

export const AnimatedIcon = ({ 
  icon: Icon, 
  size = 20, 
  color = 'currentColor', 
  animate = true,
  hoverEffect = 'scale',
  ...props 
}) => {
  const getAnimationProps = () => {
    if (!animate) return {};
    
    switch (hoverEffect) {
      case 'rotate':
        return {
          whileHover: { rotate: 360 },
          transition: { duration: 0.6, ease: 'easeInOut' }
        };
      case 'bounce':
        return {
          whileHover: { y: -5, scale: 1.1 },
          transition: { type: 'spring', stiffness: 400, damping: 10 }
        };
      case 'pulse':
        return {
          whileHover: { scale: [1, 1.1, 1] },
          transition: { duration: 0.5, repeat: Infinity }
        };
      case 'scale':
      default:
        return {
          whileHover: { scale: 1.15 },
          whileTap: { scale: 0.95 },
          transition: { type: 'spring', stiffness: 300, damping: 15 }
        };
    }
  };

  return (
    <motion.div
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
      {...getAnimationProps()}
    >
      <Icon size={size} color={color} {...props} />
    </motion.div>
  );
};

export default AnimatedIcon;
