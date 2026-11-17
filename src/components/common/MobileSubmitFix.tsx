"use client";

import { useEffect } from "react";

export default function MobileSubmitFix() {
  useEffect(() => {
    function submitOnTouch(event: PointerEvent) {
      if (event.pointerType !== "touch") return;

      const element = event.target instanceof Element ? event.target : null;
      const button = element?.closest<HTMLButtonElement>('button[type="submit"]');
      if (!button || button.disabled || !button.form) return;

      // Submit before the browser dismisses the on-screen keyboard.
      event.preventDefault();
      button.form.requestSubmit(button);
    }

    document.addEventListener("pointerdown", submitOnTouch);
    return () => document.removeEventListener("pointerdown", submitOnTouch);
  }, []);

  return null;
}
