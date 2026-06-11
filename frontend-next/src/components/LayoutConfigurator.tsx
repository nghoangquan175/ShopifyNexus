"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function LayoutConfigurator() {
  const pathname = usePathname();

  useEffect(() => {
    const isAccount = pathname === "/account" || pathname.startsWith("/account/");
    if (isAccount) {
      document.documentElement.classList.add("auth-page");
    } else {
      document.documentElement.classList.remove("auth-page");
    }
  }, [pathname]);

  return null;
}
