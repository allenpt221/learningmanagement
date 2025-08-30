import React from "react";

interface ConfirmationDeletionProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message?: string;
}

function ConfirmationDeletion({
  isOpen,
  onConfirm,
  onCancel,
  message = "Are you sure you want to delete this post?",
}: ConfirmationDeletionProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="bg-white rounded-md p-6 max-w-sm w-full shadow-lg">
        <h2 id="confirm-dialog-title" className="text-lg font-semibold mb-4">
          Confirm Deletion
        </h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-black text-white hover:bg-black/50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationDeletion;
