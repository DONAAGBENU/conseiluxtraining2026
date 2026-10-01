"use client";

import { LanguageCenterProvider, useLanguageCenter } from "../../components/LanguageCenterProvider";

function LayoutInner({ children }: { children: React.ReactNode }) {
  const { darkMode } = useLanguageCenter();
  return (
    <div className={darkMode ? "lc-dark" : ""}>
      {children}
    </div>
  );
}

export default function TestLevelLayout({
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