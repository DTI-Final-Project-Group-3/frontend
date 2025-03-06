export const ProductMutationConstant = {
  STATUS_PENDING: 1,
  STATUS_COMPLETED: 2,
  STATUS_CANCELLED: 3,
  STATUS_DECLINED: 4,
  STATUS_EXPIRED: 5,

  TYPE_MANUAL_MUTATION: 1,
  TYPE_AUTO_MUTATION: 2,
  TYPE_CREATE_INVENTORY: 4,
  TYPE_UPDATE_INVENTORY: 3,
  TYPE_DELETE_INVENTORY: 5,
} as const;

export const ProductMutationStatusColorsConstant = {
  pending: "bg-amber-100 text-amber-700", // pending
  completed: "bg-emerald-100 text-emerald-700", // completed
  cancelled: "bg-rose-100 text-rose-700", // cancelled
  declined: "bg-red-100 text-rose-700", // declined
  expired: "bg-red-100 text-rose-700", // expired
  default: "bg-slate-100 text-slate-700", // default
} as const;
