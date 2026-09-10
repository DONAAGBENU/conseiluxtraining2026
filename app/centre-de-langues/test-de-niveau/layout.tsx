"use client";

import { LanguageCenterProvider, useLanguageCenter } from "../../components/LanguageCenterProvider";

function LayoutInner({ children }: { children: React.ReactNode }) {
  const { darkMode } = useLanguageCenter();
  return (
    <div className={darkMode ? "lc-dark" : ""}>
      {children}
      {/* Pas de footer pour la page de test de niveau, signature by dona sera dans la page elle-même */}
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