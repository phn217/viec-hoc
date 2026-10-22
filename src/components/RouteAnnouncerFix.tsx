"use client";

import { useLayoutEffect } from "react";

export default function RouteAnnouncerFix() {
  useLayoutEffect(() => {
    const fix = () => {
      document.querySelectorAll("next-route-announcer, #__next-route-announcer__").forEach((node) => {
        node.remove();
      });

      document.querySelectorAll("next-route-announcer").forEach((host) => {
        if (host.shadowRoot) {
          host.shadowRoot.innerHTML = "";
        }
      });
    };

    fix();

    const observer = new MutationObserver(() => fix());
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["role", "aria-live", "aria-atomic", "aria-hidden"],
    });

    const timer = window.setInterval(fix, 150);

    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, []);

  return null;
}
