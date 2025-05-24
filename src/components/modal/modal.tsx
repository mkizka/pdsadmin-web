import { modal, type ModalAction, useModalAction } from "../../atoms/modal";
import { AccountInfoModalBody } from "./body/account-info";
import { CreateAccountModalBody } from "./body/create-account";
import { DeleteAccountModalBody } from "./body/delete-account";
import { InviteCodeModalBody } from "./body/invite-code";
import { RequestCrawlModalBody } from "./body/request-crawl";
import { ResetPasswordModalBody } from "./body/reset-password";
import { SignoutModalBody } from "./body/signout";
import { TakedownAccountModalBody } from "./body/takedown-account";
import { UntakedownAccountModalBody } from "./body/untakedown-account";

type ModalBodyProps = {
  modalAction: ModalAction;
};

function ModalBody({ modalAction }: ModalBodyProps) {
  if (modalAction.type === "account-info") {
    return <AccountInfoModalBody {...modalAction} />;
  }
  if (modalAction.type === "reset-password") {
    return <ResetPasswordModalBody {...modalAction} />;
  }
  if (modalAction.type === "takedown") {
    return <TakedownAccountModalBody {...modalAction} />;
  }
  if (modalAction.type === "untakedown") {
    return <UntakedownAccountModalBody {...modalAction} />;
  }
  if (modalAction.type === "delete") {
    return <DeleteAccountModalBody {...modalAction} />;
  }
  if (modalAction.type === "invite-code") {
    return <InviteCodeModalBody {...modalAction} />;
  }
  if (modalAction.type === "create-account") {
    return <CreateAccountModalBody />;
  }
  if (modalAction.type === "logout") {
    return <SignoutModalBody />;
  }
  return <RequestCrawlModalBody />;
}

export function ModalDialog() {
  const modalAction = useModalAction();
  return (
    <dialog id={modal.getElementId()} className="modal">
      {modalAction && (
        <div className="modal-box max-h-[calc(100dvh*11/12)]">
          <ModalBody modalAction={modalAction} />
          <form method="dialog" className="absolute top-3 right-3 size-8">
            <button className="btn btn-circle btn-ghost size-full">
              <span className="i-lucide-x size-5 cursor-pointer"></span>
            </button>
          </form>
        </div>
      )}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
