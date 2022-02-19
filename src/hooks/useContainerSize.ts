import React, { useEffect, useState } from 'react';

const useContainerSize = (containerRef: React.RefObject<HTMLElement>) => {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const ref = containerRef?.current;
    if (!ref) {
      return;
    }

    const onResize = () => {
      const { clientWidth, clientHeight } = ref;

      setWidth(clientWidth);
      setHeight(clientHeight);
    };

    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [containerRef]);

  return { width, height };
};

export default useContainerSize;
