import { useState } from "react";
import { AppNavbar } from "../shared/AppNavbar";
import { HeroSection } from "./HeroSection";
import { CourtAvailabilitySection } from "./CourtAvailabilitySection";
import { IntroductionSection } from "./IntroductionSection";
import { ReviewsSection } from "./ReviewsSection";
import { Footer } from "./Footer";
import { LoginModal } from "./LoginModal";
import { ChatbotAssistant } from "../customer/ChatbotAssistant";

export function LandingPage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginMode, setLoginMode] = useState<"login" | "register">("login");

  const handleOpenLogin = () => {
    setLoginMode("login");
    setIsLoginModalOpen(true);
  };

  const handleOpenRegister = () => {
    setLoginMode("register");
    setIsLoginModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100">
      <AppNavbar onLoginClick={handleOpenLogin} onRegisterClick={handleOpenRegister} />

      <main>
        <HeroSection onBookNowClick={handleOpenLogin} />
        <CourtAvailabilitySection onBookClick={handleOpenLogin} />
        <IntroductionSection />
        <ReviewsSection />
      </main>

      <Footer />

      <ChatbotAssistant />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        mode={loginMode}
        onSwitchMode={(mode) => setLoginMode(mode)}
      />
    </div>
  );
}
