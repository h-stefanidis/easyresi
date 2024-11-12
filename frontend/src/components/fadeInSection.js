// FadeInSection.js
import React, { useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const MotionBox = motion(Box);

const FadeInSection = ({ children, delay = 0 }) => {
    const control = useAnimation();
    const [ref, inView] = useInView({
        triggerOnce: true, // Animate only once when in view
        threshold: 0.3,    // 30% of the element needs to be visible
    });

    useEffect(() => {
        if (inView) {
            control.start({
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, delay }, // Apply the delay here
            });
        }
    }, [control, inView, delay]);

    return (
        <MotionBox
            ref={ref}
            initial={{ opacity: 0, y: 20 }} // Start faded out and slightly down
            animate={control}
            mb={8}
        >
            {children}
        </MotionBox>
    );
};

export default FadeInSection;