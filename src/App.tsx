import { InviteCodeForm } from "./components/InviteCodeForm";
import { Navbar } from "./components/Navbar";

export function App() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4 max-w-md">
        <InviteCodeForm />
      </div>
    </>
  );
}
