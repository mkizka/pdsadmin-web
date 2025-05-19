import { useIsLoggedIn } from "./atoms/session";
import { AccountList } from "./components/account-list";
import {
  DidAccountModal,
  DidDeleteAccountModal,
  DidResetPasswordModal,
  DidTakedownModal,
  DidUntakedownModal,
} from "./components/did-operations";
import { LoginForm } from "./components/login-form";
import { Navbar } from "./components/navbar";
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
      {isLoggedIn && <DidResetPasswordModal />}
      {isLoggedIn && <DidTakedownModal />}
      {isLoggedIn && <DidUntakedownModal />}
      {isLoggedIn && <DidAccountModal />}
      {isLoggedIn && <DidDeleteAccountModal />}
      <Toaster />
    </>
  );
}
