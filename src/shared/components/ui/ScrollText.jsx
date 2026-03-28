import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../core/utils/cn';

const ScrollText = ({
  texts = [
    "Plombiers",
    "Électriciens", 
    "Menuisiers",
    "Peintres",
    "Maçons",
    "Techniciens",
    "Femmes de ménage",
    "Climatisation",
    "Jardiniers",
    "Couvriers",
    "Carreleurs",
    "Soudeurs"
  ],
  className,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const observerRef = useRef(null);
  const itemsRef = useRef([]);
  const containerRef = useRef(null);

  // Scroll to top on mount
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, []);

  const handleIntersection = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const index = itemsRef.current.findIndex(
          (item) => item === entry.target
        );
        setActiveIndex(index);
      }
    });
  };

  // Setup intersection observer
  const setupObserver = (element, index) => {
    if (element && !itemsRef.current[index]) {
      itemsRef.current[index] = element;

      if (!observerRef.current) {
        observerRef.current = new IntersectionObserver(handleIntersection, {
          threshold: 0.7,
          root: containerRef.current,
          rootMargin: "-45% 0px -45% 0px",
        });
      }

      observerRef.current.observe(element);
    }
  };

  // Animation variants for reveal effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: (index) => ({
      opacity: 0,
      x: index % 2 === 0 ? -100 : 100,
      rotate: index % 2 === 0 ? -10 : 10,
    }),
    visible: {
      opacity: 1,
      x: 0,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.5,
      },
    },
  };

  return (
    <div className={cn("mx-auto w-full max-w-3xl", className)}>
      <div
        className={cn(
          "scrollbar-none h-[200px] overflow-y-auto",
          "relative flex flex-col items-center",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        )}
        ref={containerRef}
      >
        <div className="h-[100px]" />
        <motion.div
          animate="visible"
          className="flex w-full flex-col items-center"
          initial="hidden"
          variants={containerVariants}
        >
          {texts.map((text, index) => (
            <motion.div
              className={cn(
                "whitespace-nowrap px-4 py-6 font-bold text-4xl md:text-5xl",
                "transition-colors duration-300",
                activeIndex === index
                  ? "text-blue-600 dark:text-white"
                  : "text-neutral-400/50 dark:text-neutral-600"
              )}
              custom={index}
              initial="hidden"
              key={text}
              ref={(el) => setupObserver(el, index)}
              variants={itemVariants}
              viewport={{
                once: false,
                margin: "-20% 0px -20% 0px",
              }}
              whileInView="visible"
            >
              {text}
            </motion.div>
          ))}
        </motion.div>
        <div className="h-[100px]" />
      </div>
    </div>
  );
};

export default ScrollText;