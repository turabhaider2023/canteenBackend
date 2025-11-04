export const CanteenOrderModel = {
  orderId: null,               // kis user order ko process kar raha hai (UserOrderModel se link)
  handledBy: null,             // canteen staff userId
  status: "in_progress",       // "in_progress" | "completed"
  preparedAt: new Date(),      // preparation start time
  deliveredAt: null,           // delivery complete time
};
