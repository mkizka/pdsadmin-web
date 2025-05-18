import { AccountList } from "./components/account-list";
import { LoginForm } from "./components/login-form";
import { Navbar } from "./components/navbar";
import { ResetPasswordModal } from "./components/reset-password";
import { useIsLoggedIn } from "./utils/session";

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
    </>
  );
}
