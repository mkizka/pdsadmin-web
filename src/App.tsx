import { useIsLoggedIn } from "./atoms/session";
import { AccountList } from "./components/account/account-list";
import { ModalDialog } from "./components/modal/modal";
import { Header } from "./components/module/header";
import { PDSInfo } from "./components/module/pds-info";
import { SigninForm } from "./components/module/signin-form";
import { Toaster } from "./components/ui/toaster";

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
