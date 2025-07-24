"use client";
import { ReactLenis, useLenis } from 'lenis/react'
import { ReactNode } from 'react';

type SmoothScrollingProps = {
  children: ReactNode;
};

function SmoothScrolling({ children } : SmoothScrollingProps) {
  return (
    <ReactLenis root>
      {children}
    </ReactLenis>
  );
}

export default SmoothScrolling;