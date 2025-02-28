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
