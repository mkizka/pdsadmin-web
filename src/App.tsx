import { useIsLoggedIn } from "./atoms/session";
import { AccountList } from "./components/account/account-list";
import { ModalDialog } from "./components/modal/modal";
import { Footer } from "./components/module/footer";
import { Header } from "./components/module/header";
import { PDSMenu } from "./components/module/pds-menu";
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
              <PDSMenu />
              <AccountList />
            </>
          )}
          <Footer />
        </div>
        <ModalDialog />
        <Toaster />
      </div>
    </div>
  );
}
