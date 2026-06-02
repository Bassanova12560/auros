/** Shared motion tokens — spring physics + premium easing */

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export const SPRING = {
  type: "spring" as const,
  stiffness: 120,
  damping: 22,
  mass: 0.8,
};

export const SPRING_GENTLE = {
  type: "spring" as const,
  stiffness: 80,
  damping: 24,
};

export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: EASE_OUT_EXPO },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.7, ease: EASE_OUT_EXPO },
  },
};

export const staggerContainer = (stagger = 0.1, delay = 0) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});
