import { useIsLoggedIn } from "./atoms/session";
import { AccountList } from "./components/account/account-list";
import { ModalDialog } from "./components/modal/modal";
import { Navbar } from "./components/navbar";
import { PDSInfo } from "./components/pds-info";
import { SigninForm } from "./components/signin-form";
import { Toaster } from "./components/toaster";

export function App() {
  const isLoggedIn = useIsLoggedIn();
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4 max-w-md">
        {!isLoggedIn && <SigninForm />}
        {isLoggedIn && (
          <div className="flex flex-col gap-2">
            <PDSInfo />
            <AccountList />
          </div>
        )}
      </div>
      <ModalDialog />
      <Toaster />
    </>
  );
}
