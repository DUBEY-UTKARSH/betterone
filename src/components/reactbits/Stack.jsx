import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import './Stack.css';

const Stack = ({
  cards = [],
  randomRotation = false,
  sensitivity = 180,
  sendToBackOnClick = true,
  cardClassName = ''
}) => {
  const [stack, setStack] = useState(cards);

  const handleCardClick = (index) => {
    if (!sendToBackOnClick) return;
    setStack((prev) => {
      const copy = [...prev];
      const [clicked] = copy.splice(index, 1);
      copy.push(clicked);
      return copy;
    });
  };

  return (
    <div className="reactbits-stack-container">
      <AnimatePresence>
        {stack.map((card, index) => {
          const isTop = index === 0;
          const rotation = randomRotation ? (index % 2 === 0 ? 3 : -3) : 0;
          const offset = index * 8;
          const scale = 1 - index * 0.04;

          return (
            <motion.div
              key={card.id || index}
              className={`reactbits-stack-card ${cardClassName}`}
              style={{
                zIndex: stack.length - index,
                transformOrigin: 'bottom center'
              }}
              animate={{
                top: `${offset}px`,
                scale: scale,
                rotate: rotation,
                opacity: 1
              }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20
              }}
              whileHover={isTop ? { scale: scale + 0.02, y: -4 } : {}}
              onClick={() => isTop && handleCardClick(0)}
            >
              {card.content}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default Stack;
