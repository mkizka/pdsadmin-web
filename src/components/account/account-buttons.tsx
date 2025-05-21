import { useOpenModal } from "../../atoms/modal";
import type { Did } from "../../utils/types";

export function ResetPasswordButton({ did }: { did: Did }) {
  const openModal = useOpenModal();
  return (
    <div
      role="button"
      className="h-12 btn btn-ghost"
      onClick={(e) => {
        e.stopPropagation();
        openModal({ type: "reset-password", did });
      }}
    >
      <span className="i-lucide-key-round size-4"></span>
      Reset Password
    </div>
  );
}

export function DeleteAccountButton({ did }: { did: Did }) {
  const openModal = useOpenModal();
  return (
    <div
      role="button"
      className="h-12 btn btn-ghost text-error"
      onClick={(e) => {
        e.stopPropagation();
        openModal({ type: "delete", did });
      }}
    >
      <span className="i-lucide-trash-2 size-4"></span>
      Delete
    </div>
  );
}

export function TakedownAccountButton({ did }: { did: Did }) {
  const openModal = useOpenModal();
  return (
    <div
      role="button"
      className="h-12 btn btn-ghost text-error"
      onClick={(e) => {
        e.stopPropagation();
        openModal({ type: "takedown", did });
      }}
    >
      <span className="i-lucide-ban size-4"></span>
      Takedown
    </div>
  );
}

export function UntakedownAccountButton({ did }: { did: Did }) {
  const openModal = useOpenModal();
  return (
    <div
      role="button"
      className="h-12 btn btn-ghost text-success"
      onClick={(e) => {
        e.stopPropagation();
        openModal({ type: "untakedown", did });
      }}
    >
      <span className="i-lucide-check-circle size-4"></span>
      Untakedown
    </div>
  );
}
