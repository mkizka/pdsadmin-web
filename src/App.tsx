import { AccountList } from "./components/AccountList";
import { LoginForm } from "./components/LoginForm";
import { Navbar } from "./components/Navbar";
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
    </>
  );
}
