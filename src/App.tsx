import { useIsLoggedIn } from "./atoms/session";
import { AccountList, AccountModal } from "./components/account-list";
import { LoginForm } from "./components/login-form";
import { Navbar } from "./components/navbar";
import { ResetPasswordModal } from "./components/reset-password";
import { TakedownModal } from "./components/takedown";
import { Toaster } from "./components/toaster";

export function App() {
  const isLoggedIn = useIsLoggedIn();

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4 max-w-md">
        {!isLoggedIn && <LoginForm />}
        {isLoggedIn && <AccountList />}
      </div>
      {isLoggedIn && <ResetPasswordModal />}
      {isLoggedIn && <TakedownModal />}
      {isLoggedIn && <AccountModal />}
      <Toaster />
    </>
  );
}
