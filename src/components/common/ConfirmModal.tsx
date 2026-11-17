"use client";

import { useEffect, useState, type ReactNode } from "react";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  icon?: ReactNode;
  confirmationText?: string;
  confirmationPlaceholder?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  loading = false,
  icon,
  confirmationText,
  confirmationPlaceholder = "Type to confirm",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const [confirmationValue, setConfirmationValue] = useState("");
  const confirmationRequired = Boolean(confirmationText);
  const confirmationValid = !confirmationRequired || confirmationValue.trim() === confirmationText;

  useEffect(() => {
    if (!open) setConfirmationValue("");
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[#10251b80] px-5"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) onCancel();
      }}
    >
      <div
        aria-labelledby="confirm-modal-title"
        aria-modal="true"
        className="w-full max-w-[340px] rounded-[18px] bg-white p-5 text-center shadow-[0_18px_50px_#10251b40]"
        role="dialog"
      >
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-[#fff0f0] text-[#c0393b]">
          {icon || (
            <svg
              className="size-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
              <path d="M10.3 3.8 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3l-7.5-13.2a2 2 0 0 0-3.4 0Z" />
            </svg>
          )}
        </div>
        <h2
          className="m-0 mt-3 text-[18px] font-extrabold text-[#20342a]"
          id="confirm-modal-title"
        >
          {title}
        </h2>
        <p className="m-0 mt-2 text-[13px] leading-[1.5] text-[#68766e]">
          {message}
        </p>
        {confirmationRequired && (
          <div className="mt-4 text-left">
            <label className="mb-1.5 block text-[12px] font-bold text-[#526158]" htmlFor="confirm-modal-input">
              Type <span className="text-[#c0393b]">{confirmationText}</span> to confirm <span className="text-[#c0393b]">*</span>
            </label>
            <input
              autoComplete="off"
              className="min-h-11 w-full rounded-[10px] border border-[#d7e2da] px-3 text-sm text-[#20342a] outline-none focus:border-[#08714f] focus:ring-2 focus:ring-[#08714f20]"
              disabled={loading}
              id="confirm-modal-input"
              onChange={(event) => setConfirmationValue(event.target.value)}
              placeholder={confirmationPlaceholder}
              value={confirmationValue}
            />
          </div>
        )}
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <button
            className="min-h-11 rounded-[10px] border border-[#d7e2da] bg-white px-3 text-sm font-bold text-[#526158] hover:bg-[#f5f8f6]"
            disabled={loading}
            onClick={onCancel}
            type="button"
          >
            {cancelLabel}
          </button>
          <button
            className="min-h-11 rounded-[10px] bg-[#c0393b] px-3 text-sm font-bold text-white hover:bg-[#aa3032] disabled:opacity-60"
            disabled={loading || !confirmationValid}
            onClick={() => {
              if (confirmationValid) void onConfirm();
            }}
            type="button"
          >
            {loading ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
