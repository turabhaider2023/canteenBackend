export const userOderModel = {
    userId:null, //kis user ne order kiya
    items:[
        {
            itemId:null,
            quantity:0,
            price:0
        }
    ],
    totalAmount:0 ,// totalAmount = items.price*quanity,
    paymentStatus:"",
    orderStatus:"",
    placedAt: new Date()

}