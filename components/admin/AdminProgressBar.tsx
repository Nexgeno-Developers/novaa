"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import NProgress from "nprogress";

// Configure NProgress
NProgress.configure({
  showSpinner: false,
  speed: 500,
  minimum: 0.1,
  template: `
    <div class="bar" role="bar">
      <div class="peg"></div>
    </div>
    <div class="spinner" role="spinner">
      <div class="spinner-icon"></div>
    </div>
  `,
});

export default function AdminProgressBar() {
  const pathname = usePathname();
  const router = useRouter();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    // Only start progress if pathname actually changed
    if (previousPathname.current !== pathname) {
      NProgress.start();

      // Complete progress bar after a short delay
      const timer = setTimeout(() => {
        NProgress.done();
      }, 200);

      previousPathname.current = pathname;

      return () => {
        clearTimeout(timer);
        NProgress.done();
      };
    }
  }, [pathname]);

  // Handle clicks on navigation elements and programmatic navigation
  useEffect(() => {
    const handleLinkClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest("a, button[data-navigation]");

      if (link) {
        const href = link.getAttribute("href");
        const isExternal =
          href?.startsWith("http") ||
          href?.startsWith("mailto:") ||
          href?.startsWith("tel:");

        // Only show progress for internal navigation
        if (!isExternal && href && href.startsWith("/")) {
          NProgress.start();
        }
      }
    };

    // Override router methods to show progress for programmatic navigation
    const originalPush = router.push;
    const originalReplace = router.replace;
    const originalBack = router.back;
    const originalForward = router.forward;

    router.push = (href: string, options?: { scroll?: boolean }) => {
      NProgress.start();
      return originalPush.call(router, href, options);
    };

    router.replace = (href: string, options?: { scroll?: boolean }) => {
      NProgress.start();
      return originalReplace.call(router, href, options);
    };

    router.back = () => {
      NProgress.start();
      return originalBack.call(router);
    };

    router.forward = () => {
      NProgress.start();
      return originalForward.call(router);
    };

    // Add click listener to document
    document.addEventListener("click", handleLinkClick);

    return () => {
      // Restore original methods
      router.push = originalPush;
      router.replace = originalReplace;
      router.back = originalBack;
      router.forward = originalForward;

      document.removeEventListener("click", handleLinkClick);
    };
  }, [router]);

  return null;
}
