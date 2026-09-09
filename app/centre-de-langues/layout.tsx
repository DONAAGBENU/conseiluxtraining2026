"use client";

import LanguageHeader from "../components/LanguageHeader";
import { LanguageCenterProvider, useLanguageCenter } from "../components/LanguageCenterProvider";

function LayoutInner({ children }: { children: React.ReactNode }) {
  const { darkMode } = useLanguageCenter();
  return (
    <div className={darkMode ? "lc-dark" : ""}>
      <LanguageHeader />
      {children}
    </div>
  );
}

export default function LanguageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageCenterProvider>
      <LayoutInner>{children}</LayoutInner>
    </LanguageCenterProvider>
  );
}
