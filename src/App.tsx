import { InviteCodeForm } from "./components/InviteCodeForm";
import { LoginForm } from "./components/LoginForm";
import { Navbar } from "./components/Navbar";
import { useIsLoggedIn } from "./utils/session";

export function App() {
  const isLoggedIn = useIsLoggedIn();
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4 max-w-md">
        <LoginForm />
        {isLoggedIn && <InviteCodeForm />}
      </div>
    </>
  );
}
