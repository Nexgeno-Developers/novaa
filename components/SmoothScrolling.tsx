"use client";
import { ReactLenis, useLenis } from 'lenis/react'

function SmoothScrolling({ children } : any) {
  return (
    // @ts-ignore
    <ReactLenis root>
      {children}
    </ReactLenis>
  );
}

export default SmoothScrolling;