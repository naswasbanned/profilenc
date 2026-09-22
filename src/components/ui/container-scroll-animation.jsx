import React, { useRef, useState, useEffect, createContext, useContext } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import './container-scroll-animation.css';

export const ContainerScrollContext = createContext(null);
export const useContainerScroll = () => useContext(ContainerScrollContext);

export const ContainerScroll = ({
  titleComponent,
  children,
  className = '',
  containerClassName = '',
}) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.88, 0.96] : [0.94, 1];
  };

  // Phase 1 (0.00 -> 0.12): 3D perspective tilt from 18deg to 0deg flat view
  const rotate = useTransform(scrollYProgress, [0, 0.12], [18, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.12], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 0.12], [0, -14]);
  const headerOpacity = useTransform(scrollYProgress, [0.08, 0.16], [1, 0.95]);

  return (
    <ContainerScrollContext.Provider value={{ scrollYProgress, isMobile }}>
      <div
        className={`fn-scroll-container ${containerClassName}`}
        ref={containerRef}
      >
        <div className="fn-scroll-sticky-wrap">
          <div className="fn-scroll-perspective-wrap">
            {titleComponent && (
              <Header translate={translate} opacity={headerOpacity} titleComponent={titleComponent} />
            )}
            <Card rotate={rotate} scale={scale} className={className}>
              {typeof children === 'function'
                ? children({ scrollYProgress, isMobile })
                : children}
            </Card>
          </div>
        </div>
      </div>
    </ContainerScrollContext.Provider>
  );
};

export const Header = ({ translate, opacity, titleComponent }) => {
  return (
    <motion.div
      style={{
        translateY: translate,
        opacity,
      }}
      className="fn-scroll-header"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
  className = '',
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
      }}
      className={`fn-scroll-card ${className}`}
    >
      <div className="fn-scroll-card-inner">
        {children}
      </div>
    </motion.div>
  );
};

export default ContainerScroll;
