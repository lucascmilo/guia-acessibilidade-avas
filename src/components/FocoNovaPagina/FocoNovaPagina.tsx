"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function FocoNovaPagina() {
  const pathname = usePathname();
  const anterior = useRef(pathname);
  const marcador = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (anterior.current === pathname) return;
    anterior.current = pathname;
    marcador.current?.focus({ preventScroll: true });
  }, [pathname]);

  return <span ref={marcador} tabIndex={-1} className="visually-hidden" />;
}
