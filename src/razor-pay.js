const uuidv4 = require('uuid/v4');
const axios = require('axios');
const payumoney = require('payumoney-node');
const razorPayModule = require('razorpay');
let razorPay = new razorPayModule({
  key_id: "", // your `KEY_ID`
  key_secret: "" // your `KEY_SECRET`
})
console.log(rzp);


const isNull = function (val) {
  if (typeof val === 'string') { val = val.trim(); }
  if (val === undefined || val === null || typeof val === 'undefined' || val === '' || val === 'undefined') {
    return true;
  }
  return false;
};


let masterCredentials = {};

export default class razorPay {


  createOrder = (payloadJson) => {
    return new Promise((resolve, reject) => {
      const {
        amount,
        currency,
        receipt,
        payment_capture,
        notes
      } = payloadJson;
      razorPay.orders.create({ amount, currency, receipt, payment_capture, notes }).then(response => {
        return resolve(response);
        console.log(response);
      }).catch(error => {
        console.log(error);
        return reject(error);
      })
    })
  }

  fetchSingleOrder = (orderId) => {
    return new Promise((resolve, reject) => {
      razorPay.orders.fetch(orderId).then(response => {
        return resolve(response);
      }).catch(error => {
        return reject(error);
      })
    })
  } 



}