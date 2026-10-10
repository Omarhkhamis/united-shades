"use client";

/**
 * SweetAlert2 dialogs & toasts for the dashboard (Arabic / RTL, brand colors).
 * Loaded lazily so it never runs during server rendering.
 */
const load = () => import("sweetalert2").then((m) => m.default);

const base = {
  customClass: {
    popup: "swal-us",
    confirmButton: "btn btn--primary",
    denyButton: "btn btn--danger",
    cancelButton: "btn btn--ghost",
    actions: "swal-us__actions",
  },
  buttonsStyling: false,
  reverseButtons: false,
} as const;

/** Ask before doing something. Resolves to true when the user confirms. */
export async function confirmAction(opts: { title: string; text?: string; confirmText?: string; danger?: boolean }) {
  const Swal = await load();
  const res = await Swal.fire({
    ...base,
    icon: opts.danger ? "warning" : "question",
    title: opts.title,
    text: opts.text,
    showCancelButton: true,
    confirmButtonText: opts.confirmText ?? "تأكيد",
    cancelButtonText: "إلغاء",
    focusCancel: !!opts.danger,
    customClass: { ...base.customClass, confirmButton: opts.danger ? "btn btn--danger" : "btn btn--primary" },
  });
  return res.isConfirmed;
}

/** Small notification in the corner. */
export async function notify(type: "success" | "error" | "info" | "warning", title: string) {
  const Swal = await load();
  await Swal.fire({
    ...base,
    toast: true,
    position: "top-start",
    icon: type,
    title,
    showConfirmButton: false,
    timer: type === "error" ? 5000 : 2600,
    timerProgressBar: true,
    customClass: { popup: "swal-us swal-us--toast" },
  });
}
