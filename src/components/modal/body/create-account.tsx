import { type FormEvent, useState } from "react";

import { usePDS, usePDSHostname } from "../../../atoms/pds";
import { Button } from "../../button";
import { useModalHandler } from "../hooks";

export function CreateAccountModalBody() {
  const pds = usePDS();
  const pdsHostname = usePDSHostname();
  const [handle, setHandle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading, handler } = useModalHandler({
    fn: () =>
      pds.createAccount({
        handle: handle as `${string}.${string}`,
        email,
        password,
      }),
    toastMessage: "Account created successfully",
    shouldReloadRepos: true,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handler();
    setHandle("");
    setEmail("");
    setPassword("");
  };

  return (
    <form
      className="flex flex-col items-center gap-4"
      onSubmit={handleSubmit}
      data-testid="create-account-form"
    >
      <span className="i-lucide-user-plus size-12"></span>
      <p className="text-center">Create new account</p>
      <label className="input input-bordered flex items-center gap-2">
        <span className="i-lucide-at-sign size-4"></span>
        <input
          type="text"
          placeholder={`example.${pdsHostname}`}
          required
          autoComplete="username"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          className="grow"
          data-testid="create-account-handle-input"
        />
      </label>
      <label className="input input-bordered flex items-center gap-2">
        <span className="i-lucide-mail size-4"></span>
        <input
          type="email"
          placeholder="Email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="grow"
          data-testid="create-account-email-input"
        />
      </label>
      <label className="input input-bordered flex items-center gap-2">
        <span className="i-lucide-lock size-4"></span>
        <input
          type="password"
          placeholder="Password"
          required
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="grow"
          data-testid="create-account-password-input"
        />
      </label>
      <Button
        type="submit"
        className="btn btn-primary relative"
        loading={loading}
        loadingClassName="loading-sm"
        data-testid="create-account-submit-button"
      >
        Create Account
      </Button>
    </form>
  );
}
