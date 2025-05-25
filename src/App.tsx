import { useIsLoggedIn } from "./atoms/session";
import { AccountList } from "./components/account/account-list";
import { Header } from "./components/header";
import { ModalDialog } from "./components/modal/modal";
import { PDSInfo } from "./components/pds-info";
import { SigninForm } from "./components/signin-form";
import { Toaster } from "./components/toaster";

export function App() {
  const isLoggedIn = useIsLoggedIn();
  return (
    <div className="bg-base-300">
      <div className="bg-base-200 container mx-auto h-full min-h-dvh max-w-md p-4">
        <div className="flex flex-col gap-4">
          <Header />
          {!isLoggedIn && <SigninForm />}
          {isLoggedIn && (
            <>
              <PDSInfo />
              <AccountList />
            </>
          )}
        </div>
        <ModalDialog />
        <Toaster />
      </div>
    </div>
  );
}
