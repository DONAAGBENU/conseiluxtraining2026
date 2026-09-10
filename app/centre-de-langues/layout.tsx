"use client";

import { usePathname } from "next/navigation";
import Footer from "../components/Footer";
import LanguageHeader from "../components/LanguageHeader";
import { LanguageCenterProvider, useLanguageCenter } from "../components/LanguageCenterProvider";

function LayoutInner({ children, isTestPage }: { children: React.ReactNode; isTestPage: boolean }) {
  const { darkMode } = useLanguageCenter();

  return (
    <div className={darkMode ? "lc-dark" : ""}>
      {!isTestPage && <LanguageHeader />}
      {children}
      {!isTestPage ? (
        <Footer />
      ) : (
        <div className="border-t border-[#ff6b00]/20 bg-[#0a1128] py-4">
          <p className="ml-4 text-left text-xs font-medium italic tracking-[0.18em] text-[#ff6b00]">by DONA</p>
        </div>
      )}
    </div>
  );
}

export default function LanguageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isTestPage = pathname?.startsWith("/centre-de-langues/test-de-niveau") ?? false;

  return (
    <LanguageCenterProvider>
      <LayoutInner isTestPage={isTestPage}>{children}</LayoutInner>
    </LanguageCenterProvider>
  );
}
