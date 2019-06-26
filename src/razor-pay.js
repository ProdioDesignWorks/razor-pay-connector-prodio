const uuidv4 = require('uuid/v4');
const axios = require('axios');
const payumoney = require('payumoney-node');
const razorPay = require('razorpay');
// let rzp = new razorPay({
//   key_id: process.env.KEY_ID, // your `KEY_ID`
//   key_secret: process.env.KEY_SECRET // your `KEY_SECRET`
// })
let rzp = new razorPay({
  key_id: process.env.KEY_ID, // your `KEY_ID`
  key_secret: process.env.KEY_SECRET // your `KEY_SECRET`
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


  createOrder = () => {
    razorPay.orders.create({ amount, currency, receipt, payment_capture, notes })
  }

  fetchSingleOrder = (prderId) => {
    razorPay.orders.fetch(orderId).then(response => {
    }).catch(error => {

    })
  }

  fetchPayments = (orderId) =>{
    razorPay.orders.fetchPayments(orderId).then(response=>{

    }).catch(error=>{

    })  
   }
  
  editPayer(payloadJson) {

    return new Promise((resolve, reject) => {
      resolve({ "success": true, "body": { "gatewayBuyerId": payloadJson["payeeInfo"]["gatewayBuyerId"] } });
    });
  }

  removePayer(payloadJson) {
    return new Promise((resolve, reject) => {
      resolve({ "success": true, "body": { "gatewayBuyerId": payloadJson["payeeInfo"]["gatewayBuyerId"] } });
    });
  }


  bulkUploadPayers(payloadJson) {
    return 'this is test';
  }

  makeDirectPayment(payloadJson) {
    return new Promise((resolve, reject) => {

      if (!isNull(payloadJson["paymentInfo"])) {
        payloadJson = payloadJson["paymentInfo"];
      }

      var paymentData = {
        productinfo: payloadJson["orderTitle"],
        txnid: payloadJson["orderNumber"],
        amount: payloadJson["amount"],
        email: payloadJson["email"],
        phone: payloadJson["phone"],
        lastname: payloadJson["lastname"],
        firstname: payloadJson["firstname"],
        surl: payloadJson["successUrl"],
        furl: payloadJson["failureUrl"]
      };
      //https://medium.com/@swapnilnakhate/payumoney-payment-gateway-integration-with-nodejs-f715e5fc25a
      console.log(paymentData);

      payumoney.makePayment(paymentData, function (error, response) {
        if (error) {
          // Some error
          console.log(error);
          reject({ "success": false, "body": error });
        } else {
          // Payment redirection link
          console.log(error);
          console.log(response);
          resolve({ "success": true, "payURedirectUrl": response });
        }
      });

    });
  }

  makePayment(payloadJson) {
    return new Promise((resolve, reject) => {
      soap.createClient(MASTER_MERCHANT_ACCESS["TransactionsURL"], soap_client_options, function (err, client) {
        //  TODO : Here we have to use newly created merchant Info and not master info.
        console.log(err);
        console.log(client);
        // var paymentJson = {
        //          "Username":MASTER_MERCHANT_ACCESS["UserName"],
        //          "Password":MASTER_MERCHANT_ACCESS["Password"],
        //          "Vendor": MASTER_MERCHANT_ACCESS["Vendor"],
        //          "CcInfoKey": payloadJson["cardInfo"]["gatewayCardId"],
        //          "Amount": payloadJson["paymentInfo"]["totalAmount"],
        //          "InvNum":payloadJson["paymentInfo"]["transactionId"], 
        //          "ExtData":""
        //        };
        var paymentJson = {
          "Username": MASTER_MERCHANT_ACCESS["UserName"],
          "Password": MASTER_MERCHANT_ACCESS["Password"],
          "Vendor": MASTER_MERCHANT_ACCESS["Vendor"],
          "TransType": "Sale",
          "CardNum": payloadJson["cardInfo"]["cardNumber"],
          "ExpDate": payloadJson["cardInfo"]["expDate"],
          "MagData": "",
          "NameOnCard": payloadJson["cardInfo"]["cardHolderName"],
          "Amount": payloadJson["paymentInfo"]["totalAmount"],
          "InvNum": payloadJson["paymentInfo"]["transactionId"],
          "PNRef": "",
          "Zip": "",
          "Street": "",
          "CVNum": payloadJson["cardInfo"]["cvv"],
          "ExtData": ""
        };

        console.log(paymentJson);

        try {

          client.ProcessCreditCard(paymentJson, function (err, result, body) {
            console.log(JSON.stringify(result) + ":::" + result["ProcessCreditCardResult"]["Result"]);
            if (result && typeof result["ProcessCreditCardResult"] !== undefined && typeof result["ProcessCreditCardResult"]["Result"] !== undefined) {
              if (result["ProcessCreditCardResult"]["Result"] == "0") {
                resolve({
                  "success": true,
                  "body": { "gatewayTransactionId": result["ProcessCreditCardResult"]["PNRef"] },
                });
              } else {
                let _msg = "";
                if (!isNull(result["ProcessCreditCardResult"]["Message"])) {
                  _msg = result["ProcessCreditCardResult"]["Message"];
                } else {
                  _msg = result["ProcessCreditCardResult"]["RespMSG"];
                }
                reject({ "success": false, "message": _msg });
              }

            } else {
              reject({ "success": false, "message": err });
            }
          });
        } catch (err) {
          reject({ "success": false, "message": err });
        }
      });
    });
  }

  getPayersListing(payloadJson) {
    return 'this is test';
  }

  saveCardForPayer(payloadJson) {
    return new Promise((resolve, reject) => {
      soap.createClient(MASTER_MERCHANT_ACCESS["RecurringURL"], soap_client_options, function (err, client) {
        //  TODO : Here we have to use newly created merchant Info and not master info.
        let cardNumber = payloadJson["cardInfo"]["cardNumber"];
        cardNumber = cardNumber.replace(" ", "").replace(" ", "").replace(" ", "");

        let cardHolderName = payloadJson["cardInfo"]["cardHolderName"];
        let expDate = payloadJson["cardInfo"]["expDate"];

        var creditCardInfo = {
          "Username": MASTER_MERCHANT_ACCESS["UserName"],
          "Password": MASTER_MERCHANT_ACCESS["Password"],
          "TransType": "ADD",
          "Vendor": MASTER_MERCHANT_ACCESS["Vendor"],
          "CustomerKey": payloadJson["payerInfo"]["gatewayBuyerId"],
          "CardInfoKey": "",
          "CcAccountNum": cardNumber,
          "CcExpDate": expDate,
          "CcNameOnCard": cardHolderName,
          "CcStreet": "",
          "CcZip": "",
          "ExtData": ""
        };

        try {
          client.ManageCreditCardInfo(creditCardInfo, function (err, result, body) {
            console.log(JSON.stringify(result) + ":::" + result["ManageCreditCardInfoResult"]["CcInfoKey"]);
            if (result && typeof result["ManageCreditCardInfoResult"] !== undefined && typeof result["ManageCreditCardInfoResult"]["CcInfoKey"] !== undefined) {
              resolve({
                "success": true,
                "body": { "gatewayCardId": result["ManageCreditCardInfoResult"]["CcInfoKey"] },
              });
            } else {
              reject({ "success": false, "message": err });
            }
          });
        } catch (err) {
          reject({ "success": false, "message": err });
        }
      });
    });
  }

  removeCard(payloadJson) {
    return new Promise((resolve, reject) => {
      soap.createClient(MASTER_MERCHANT_ACCESS["RecurringURL"], soap_client_options, function (err, client) {
        //  TODO : Here we have to use newly created merchant Info and not master info.
        let cardNumber = payloadJson["cardInfo"]["cardNumber"];
        cardNumber = cardNumber.replace(" ", "").replace(" ", "").replace(" ", "");

        let cardHolderName = payloadJson["cardInfo"]["cardHolderName"];
        let expDate = payloadJson["cardInfo"]["expDate"];

        var creditCardInfo = {
          "Username": MASTER_MERCHANT_ACCESS["UserName"],
          "Password": MASTER_MERCHANT_ACCESS["Password"],
          "TransType": "DELETE",
          "Vendor": MASTER_MERCHANT_ACCESS["Vendor"],
          "CustomerKey": payloadJson["payerInfo"]["gatewayBuyerId"],
          "CardInfoKey": payloadJson["cardInfo"]["gatewayCardId"],
          "CcAccountNum": cardNumber,
          "CcExpDate": expDate,
          "CcNameOnCard": cardHolderName,
          "CcStreet": "",
          "CcZip": "",
          "ExtData": ""
        };

        try {
          client.ManageCreditCardInfo(creditCardInfo, function (err, result, body) {
            console.log(JSON.stringify(result) + ":::" + result["ManageCreditCardInfoResult"]["CcInfoKey"]);
            if (result && typeof result["ManageCreditCardInfoResult"] !== undefined && typeof result["ManageCreditCardInfoResult"]["CcInfoKey"] !== undefined) {
              resolve({
                "success": true,
                "body": { "gatewayCardId": result["ManageCreditCardInfoResult"]["CcInfoKey"] },
              });
            } else {
              reject({ "success": false, "message": err });
            }
          });
        } catch (err) {
          reject({ "success": false, "message": err });
        }
      });
    });
  }

  getPayersTransactions(payloadJson) {
    return 'this is test';
  }

}