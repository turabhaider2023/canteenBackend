export const canteenRestockOrderModel = {
items:[
    {itemId:null,
     price:0,
     quantity:0,
     total:0 // quantity*price for the fast calculation
    }
],
totalAmount:0,
vendorId:null,
requestedBy:null, //staff member jisne order kiya 
approvedBy:null, // staff member jisne order request ko approve kiya hai
status:"",
createdAt:new Date(),
receivedAt:null ,// jb order receive ho jaye 
remarks:"" 

}