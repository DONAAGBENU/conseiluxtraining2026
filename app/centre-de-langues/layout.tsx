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
          <a
            href="https://donatienagbenuporfolio.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-4 inline-block text-left text-xs font-semibold tracking-[0.18em] text-[#ff6b00] hover:text-orange-300"
          >
            BYDONATHE DEV
          </a>
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
