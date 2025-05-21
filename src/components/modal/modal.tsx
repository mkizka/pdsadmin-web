import { modal, type ModalAction, useModalAction } from "../../atoms/modal";
import { AccountInfoModalBody } from "./body/account-info";
import { DeleteAccountModalBody } from "./body/delete-account";
import { RequestCrawlModalBody } from "./body/request-crawl";
import { ResetPasswordModalBody } from "./body/reset-password";
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
  return <RequestCrawlModalBody />;
}

export function ModalDialog() {
  const modalAction = useModalAction();
  return (
    <dialog id={modal.getElementId()} className="modal">
      {modalAction && (
        <div className="modal-box">
          <ModalBody modalAction={modalAction} />
        </div>
      )}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
