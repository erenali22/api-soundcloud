import React from "react";
import { useModal } from "../../context/Modal";

export function ConfirmModal({
  hint, onConfirm
}) {
  const { closeModal } = useModal();
  const onConfirmCallback = () => {
    onConfirm()
    closeModal()
  }

  return <div className="Form">
    <form>
      <div className="title">{hint}</div>
      <div className="actions">
        <button className="general-button small" onClick={closeModal}>Cancel</button>
        <button className="general-button small" onClick={onConfirmCallback}>OK</button>
      </div>
    </form>
  </div>
}