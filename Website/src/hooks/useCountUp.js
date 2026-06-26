import { useState, useEffect } from 'react';

export const useCountUp = (target, duration = 2000, startTrigger = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startTrigger) return;
    
    let startTimestamp = null;
    const startValue = 0;
    
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Ease out expo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(Math.floor(easeProgress * (target - startValue) + startValue));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [target, duration, startTrigger]);

  return count;
};
