'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var uuidv4 = require('uuid/v4');
var axios = require('axios');
var razorPayModule = require('razorpay');

var isNull = function isNull(val) {
  if (typeof val === 'string') {
    val = val.trim();
  }
  if (val === undefined || val === null || typeof val === 'undefined' || val === '' || val === 'undefined') {
    return true;
  }
  return false;
};

var razorPayObj = {};

var razorPay = function () {
  function razorPay(config) {
    _classCallCheck(this, razorPay);

    this.config = config;
    razorPayObj = new razorPayModule({
      key_id: this.config.KEY_ID,
      key_secret: this.config.KEY_SECRET
    });
  }

  _createClass(razorPay, [{
    key: 'createOrder',
    value: function createOrder(payloadJson) {
      return new Promise(function (resolve, reject) {
        var amount = payloadJson.amount,
            currency = payloadJson.currency,
            receipt = payloadJson.receipt,
            payment_capture = payloadJson.payment_capture,
            notes = payloadJson.notes;

        razorPayObj.orders.create({ amount: amount, currency: currency, receipt: receipt, payment_capture: payment_capture, notes: notes }).then(function (response) {
          return resolve(response);
          console.log(response);
        }).catch(function (error) {
          console.log(error);
          return reject(error);
        });
      });
    }
  }, {
    key: 'fetchSingleOrder',
    value: function fetchSingleOrder(payload) {
      var orderId = payload.orderId;

      return new Promise(function (resolve, reject) {
        razorPayObj.orders.fetch(orderId).then(function (response) {
          return resolve(response);
        }).catch(function (error) {
          return reject(error);
        });
      });
    }
  }, {
    key: 'capturePayment',
    value: function capturePayment(payload) {
      var paymentId = payload.paymentId,
          amount = payload.amount;

      return new Promise(function (resolve, reject) {
        razorPayObj.payments.capture(paymentId, amount).then(function (data) {
          return resolve(response);
        }).catch(function (error) {
          console.log("error", error);
          return reject(error);
        });
      });
    }
  }]);

  return razorPay;
}();

exports.default = razorPay;