export const stockTransactionModel = {
    itemId:null,
    quantity:0, //+ve for add and -ve for remove
    type: "purchase",           // "purchase" | "sale" | "wastage" | "adjustment"
    referenceId: null,          // link to order/restock/sale //referenceId batata hai ki stock transaction kis record se linked hai, jaise purchase ke liye CanteenRestockOrder ya sale ke liye UserOrder.
                                  //Agar transaction independent hai (jaise wastage ya manual adjustment), to referenceId null hoti hai.
    balanceAfter: 0,            // stock level after transaction
    createdBy: null,            // who recorded it
    approvedBy: null,           // (optional) who approved it
    createdAt: new Date(),      // timestamp
    remarks: "",                // optional notes
}