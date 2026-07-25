"use strict";var Sanwo=(()=>{var P=Object.defineProperty,me=Object.defineProperties,de=Object.getOwnPropertyDescriptor,pe=Object.getOwnPropertyDescriptors,ue=Object.getOwnPropertyNames,K=Object.getOwnPropertySymbols;var G=Object.prototype.hasOwnProperty,le=Object.prototype.propertyIsEnumerable;var z=(e,t,a)=>t in e?P(e,t,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[t]=a,_=(e,t)=>{for(var a in t||(t={}))G.call(t,a)&&z(e,a,t[a]);if(K)for(var a of K(t))le.call(t,a)&&z(e,a,t[a]);return e},U=(e,t)=>me(e,pe(t));var fe=(e,t)=>{for(var a in t)P(e,a,{get:t[a],enumerable:!0})},we=(e,t,a,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of ue(t))!G.call(e,n)&&n!==a&&P(e,n,{get:()=>t[n],enumerable:!(r=de(t,n))||r.enumerable});return e};var ye=e=>we(P({},"__esModule",{value:!0}),e);var Re={};fe(Re,{autoInit:()=>ie,create:()=>S,createAsync:()=>ne,createCustomProvider:()=>T,getCurrencySymbol:()=>A,listProviders:()=>M,registerProvider:()=>ae,resolveProvider:()=>x});var p=class extends Error{constructor(e){var t;super(e.message),this.name="SanwoError",this.code=e.code,this.provider=e.provider,this.cause=e.cause,this.recoverable=(t=e.recoverable)!=null?t:!1}toJSON(){return{code:this.code,message:this.message,provider:this.provider,recoverable:this.recoverable}}},H=class{constructor(){this.listeners=new Map}on(e,t){let a=this.listeners.get(e);return a||(a=new Set,this.listeners.set(e,a)),a.add(t),()=>this.off(e,t)}off(e,t){let a=this.listeners.get(e);a&&(a.delete(t),a.size===0&&this.listeners.delete(e))}emit(e,t){let a=this.listeners.get(e);if(a)for(let r of a)try{r(t)}catch(n){}}removeAllListeners(e){e?this.listeners.delete(e):this.listeners.clear()}},$=new Set(["BIF","CLP","DJF","GNF","JPY","KMF","KRW","MGA","PYG","RWF","UGX","VND","VUV","XAF","XOF","XPF"]),B=new Set(["BHD","JOD","KWD","OMR","TND"]);function q(e,t){let a=t.toUpperCase();return $.has(a)?Math.round(e):B.has(a)?Math.round(e*1e3):Math.round(e*100)}function he(e,t){let a=t.toUpperCase();return $.has(a)?e:B.has(a)?e/1e3:e/100}function D(){let e=Date.now().toString(36),t=Math.random().toString(36).substring(2,10);return`sanwo_${e}_${t}`}function j(e,t,a){let r=a.amountInMinorUnit?e.amount:he(e.amount,e.currency),n={publicKey:t,amount:r,currency:e.currency,reference:e.reference||D(),email:e.customer.email};if(e.customer.firstName&&(n.firstName=e.customer.firstName),e.customer.lastName&&(n.lastName=e.customer.lastName),e.customer.name&&(n.name=e.customer.name),e.customer.phone&&(n.phone=e.customer.phone),e.metadata&&(n.metadata=e.metadata),e.description&&(n.description=e.description),e.sanwoProviderOptions)for(let[c,o]of Object.entries(e.sanwoProviderOptions))n[c]=o;return n}function V(e,t,a){let r=e.replace("{{sanwoBridge}}",a);return r=r.replace("{{params}}",JSON.stringify(t)),r}var ve=`function sanwoCallback(event, data) {
  window.parent.postMessage(JSON.stringify({ type: 'sanwo', event: event, data: data }), '*');
}`,be=`function sanwoCallback(event, data) {
  window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'sanwo', event: event, data: data }));
}`,ge=`function sanwoCallback(event, data) {
  messageHandler.postMessage(JSON.stringify({ type: 'sanwo', event: event, data: data }));
}`,Ce=`function sanwoCallback(event, data) {
  JSBridge.showMessageInNative(JSON.stringify({ type: 'sanwo', event: event, data: data }));
}`,ke={web:ve,"react-native":be,flutter:ge,android:Ce};function Y(e){return ke[e]}function J(e){if(!e)throw new p({code:"INVALID_CHECKOUT_OPTIONS",message:"Checkout options are required"});if(typeof e.amount!="number"||e.amount<=0||!Number.isFinite(e.amount))throw new p({code:"INVALID_CHECKOUT_OPTIONS",message:"Amount must be a positive finite number"});if(!e.currency||typeof e.currency!="string")throw new p({code:"INVALID_CHECKOUT_OPTIONS",message:"Currency is required and must be a string"});if(!e.customer||typeof e.customer!="object")throw new p({code:"INVALID_CHECKOUT_OPTIONS",message:"Customer is required"});if(!e.customer.email||typeof e.customer.email!="string")throw new p({code:"INVALID_CHECKOUT_OPTIONS",message:"Customer email is required"});if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.customer.email))throw new p({code:"INVALID_CHECKOUT_OPTIONS",message:"Customer email is invalid"})}function Se(e){let t=document.createElement("iframe");t.id="sanwo-checkout-iframe",t.style.position="fixed",t.style.top="0",t.style.left="0",t.style.width="100%",t.style.height="100%",t.style.border="none",t.style.zIndex="2147483647",t.style.backgroundColor="transparent",t.setAttribute("allowtransparency","true"),t.setAttribute("sandbox","allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox");let a=new Blob([e.html],{type:"text/html"});t.src=URL.createObjectURL(a);let r=e.containerId?document.getElementById(e.containerId):document.body;if(!r)throw new Error(`Container element "${e.containerId}" not found`);return r.appendChild(t),{iframe:t,remove(){URL.revokeObjectURL(t.src),t.remove()}}}function Z(e){if(!e.provider)throw new p({code:"INVALID_CONFIGURATION",message:"Provider is required"});if(!e.publicKey)throw new p({code:"INVALID_CONFIGURATION",message:"Public key is required"});let t=new H,a="idle",r=null,n=null;function c(){n&&(window.removeEventListener("message",n),n=null),r&&(r.remove(),r=null),a="idle"}function o(s,m){let f={type:s,provider:e.provider.id,timestamp:Date.now(),data:m};t.emit(s,f)}function v(s){e.debug&&console.log(`[Sanwo:${e.provider.id}] ${s}`)}let u=async function(s){if(a!=="idle")throw new p({code:"CHECKOUT_ALREADY_ACTIVE",message:"A checkout is already in progress"});if(typeof document=="undefined")throw new p({code:"INVALID_CONFIGURATION",message:"Sanwo web adapter requires a browser environment"});J(s),s.reference||(s=U(_({},s),{reference:D()})),a="rendering";let m=j(s,e.publicKey,e.provider),f=Y("web"),C=V(e.provider.template,m,f);return o("started",{reference:m.reference}),new Promise((b,l)=>{var k;let g=(k=e.timeout)!=null?k:12e4,w=!1,h=setTimeout(()=>{w||(w=!0,c(),l(new p({code:"TIMEOUT",message:`Checkout timed out after ${g}ms`,provider:e.provider.id,recoverable:!0})))},g),N=i=>{w||(w=!0,clearTimeout(h),c(),i.status==="successful"?o("success",i):i.status==="cancelled"?o("cancelled",i):i.status==="failed"&&o("failed",i),o("closed",i),b(i))};n=i=>{var E,y;let d;try{d=typeof i.data=="string"?JSON.parse(i.data):i.data}catch(R){return}if(d.type==="sanwo")switch(v(`Received message: ${d.event}`),d.event){case"loaded":v("Checkout loaded"),o("loaded",{reference:m.reference}),(E=s.onLoad)==null||E.call(s);break;case"success":N({status:"successful",provider:e.provider.id,reference:d.data.reference||m.reference,transactionId:d.data.transaction_id?String(d.data.transaction_id):void 0,raw:d.data});break;case"cancelled":case"closed":N({status:"cancelled",provider:e.provider.id,reference:m.reference});break;case"error":(y=s.onError)==null||y.call(s,{message:d.data.message||"Checkout failed",raw:d.data}),N({status:"failed",provider:e.provider.id,reference:m.reference,error:{code:"CHECKOUT_FAILED",message:d.data.message||"Checkout failed",provider:e.provider.id,recoverable:!1},raw:d.data});break}},window.addEventListener("message",n);try{r=Se({containerId:e.containerId,html:C}),a="opened",o("opened",{reference:m.reference})}catch(i){w=!0,clearTimeout(h),c(),l(new p({code:"CHECKOUT_FAILED",message:i instanceof Error?i.message:"Failed to create checkout iframe",provider:e.provider.id,cause:i}))}})};return u.on=(s,m)=>t.on(s,m),u.off=(s,m)=>{t.off(s,m)},u.close=()=>{c()},u.destroy=()=>{c(),t.removeAllListeners()},Object.defineProperty(u,"providerId",{get:()=>e.provider.id,enumerable:!0}),Object.defineProperty(u,"currentState",{get:()=>a,enumerable:!0}),u}var Ne=`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sanwo Checkout</title>
</head>
<body style="background-color:#fff;height:100vh">
  <script>
    {{sanwoBridge}}

    var params = {{params}};

    function initPayment() {
      try {
        var paystack = new PaystackPop();
        var config = {
          key: params.publicKey,
          email: params.email,
          amount: params.amount,
          currency: params.currency,
          onSuccess: function(response) {
            sanwoCallback('success', {
              reference: response.reference || response.trxref,
              transaction_id: response.trans || response.transaction,
              message: response.message,
              raw: response
            });
          },
          onCancel: function() {
            sanwoCallback('cancelled', {});
          },
          onClose: function() {
            sanwoCallback('closed', {});
          }
        };

        if (params.reference) config.ref = params.reference;
        if (params.channels) config.channels = params.channels;
        if (params.metadata) config.metadata = params.metadata;
        if (params.firstName) config.firstname = params.firstName;
        if (params.lastName) config.lastname = params.lastName;
        if (params.phone) config.phone = params.phone;
        if (params.label) config.label = params.label;
        if (params.plan) config.plan = params.plan;
        if (params.quantity) config.quantity = params.quantity;
        if (params.subaccount) config.subaccount = params.subaccount;
        if (params.splitCode) config.split_code = params.splitCode;
        if (params.split) config.split = params.split;
        if (params.transactionCharge) config.transaction_charge = params.transactionCharge;
        if (params.invoiceLimit) config.invoice_limit = params.invoiceLimit;

        sanwoCallback('loaded', {});
        var method = params.method || 'checkout';
        paystack[method](config);
      } catch(e) {
        sanwoCallback('error', { message: e.message });
      }
    }

    var psScript = document.createElement('script');
    psScript.src = 'https://js.paystack.co/v2/inline.js';
    psScript.onload = initPayment;
    psScript.onerror = function() {
      sanwoCallback('error', { message: 'Failed to load Paystack SDK' });
    };
    document.body.appendChild(psScript);
  <\/script>
</body>
</html>`,W={id:"paystack",name:"paystack",displayName:"Paystack",template:Ne,website:"https://paystack.com",documentation:"https://paystack.com/docs",amountInMinorUnit:!0,supportedCurrencies:["NGN","GHS","ZAR","USD","KES"],supportedCountries:["NG","GH","ZA","US","KE"],paymentMethods:["card","bank","ussd","qr","mobile_money","bank_transfer","eft"]};var Ee=`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sanwo Checkout</title>
</head>
<body style="background-color:#fff;height:100vh">
  <script>
    {{sanwoBridge}}

    var params = {{params}};

    function initPayment() {
      try {
        var config = {
          public_key: params.publicKey,
          tx_ref: params.reference,
          amount: params.amount,
          currency: params.currency,
          customer: {
            email: params.email
          },
          callback: function(response) {
            var isSuccess = response.status === 'successful' || response.status === 'completed';
            if (isSuccess) {
              sanwoCallback('success', {
                reference: response.tx_ref,
                transaction_id: response.transaction_id,
                flw_ref: response.flw_ref,
                raw: response
              });
            } else {
              sanwoCallback('error', {
                message: 'Flutterwave checkout returned status: ' + response.status,
                raw: response
              });
            }
            if (typeof FlutterwaveCheckout !== 'undefined') {
              try { FlutterwaveCheckout.close(); } catch(e) {}
            }
          },
          onclose: function() {
            sanwoCallback('cancelled', {});
          }
        };

        if (params.name || params.firstName) {
          config.customer.name = params.name || [params.firstName, params.lastName].filter(Boolean).join(' ');
        }
        if (params.phone) config.customer.phonenumber = params.phone;
        if (params.metadata) config.meta = params.metadata;
        if (params.description) config.title = params.description;
        if (params.paymentOptions) config.payment_options = params.paymentOptions;
        if (params.redirectUrl) config.redirect_url = params.redirectUrl;
        if (params.paymentPlan) config.payment_plan = params.paymentPlan;
        if (params.subaccounts) config.subaccounts = params.subaccounts;
        if (params.customizations) config.customizations = params.customizations;

        sanwoCallback('loaded', {});
        FlutterwaveCheckout(config);
      } catch(e) {
        sanwoCallback('error', { message: e.message });
      }
    }

    var flwScript = document.createElement('script');
    flwScript.src = 'https://checkout.flutterwave.com/v3.js';
    flwScript.onload = initPayment;
    flwScript.onerror = function() {
      sanwoCallback('error', { message: 'Failed to load Flutterwave SDK' });
    };
    document.body.appendChild(flwScript);
  <\/script>
</body>
</html>`,X={id:"flutterwave",name:"flutterwave",displayName:"Flutterwave",template:Ee,website:"https://flutterwave.com",documentation:"https://developer.flutterwave.com",amountInMinorUnit:!1,supportedCurrencies:["NGN","GHS","KES","ZAR","USD","EUR","GBP","TZS","UGX","RWF","XAF","XOF"],supportedCountries:["NG","GH","KE","ZA","US","GB","TZ","UG","RW","CM","CI"],paymentMethods:["card","bank_transfer","ussd","mobile_money","apple_pay","qr"]};var Ie=`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sanwo Checkout</title>
</head>
<body style="background-color:#fff;height:100vh">
  <script>
    {{sanwoBridge}}

    var params = {{params}};

    function initPayment() {
      try {
        var prefill = {};
        if (params.email) prefill.email = params.email;
        if (params.name) {
          prefill.name = params.name;
        } else if (params.firstName || params.lastName) {
          prefill.name = ((params.firstName || '') + ' ' + (params.lastName || '')).trim();
        }
        if (params.phone) prefill.contact = params.phone;

        var options = {
          key: params.publicKey,
          amount: params.amount,
          currency: params.currency,
          prefill: prefill,
          handler: function(response) {
            sanwoCallback('success', {
              paymentId: response.razorpay_payment_id,
              reference: response.razorpay_payment_id,
              transaction_id: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature
            });
          },
          modal: {
            ondismiss: function() {
              sanwoCallback('cancelled', {});
            }
          }
        };

        if (params.orderId) options.order_id = params.orderId;
        if (params.description) options.description = params.description;
        if (params.notes) options.notes = params.notes;
        if (params.theme) options.theme = params.theme;
        if (params.image) options.image = params.image;

        var rzp = new Razorpay(options);
        sanwoCallback('loaded', {});
        rzp.open();
      } catch(e) {
        sanwoCallback('error', { message: e.message });
      }
    }

    var rzpScript = document.createElement('script');
    rzpScript.src = 'https://checkout.razorpay.com/v1/checkout.js';
    rzpScript.onload = initPayment;
    rzpScript.onerror = function() {
      sanwoCallback('error', { message: 'Failed to load Razorpay SDK' });
    };
    document.body.appendChild(rzpScript);
  <\/script>
</body>
</html>`,Q={id:"razorpay",name:"razorpay",displayName:"Razorpay",template:Ie,website:"https://razorpay.com",documentation:"https://razorpay.com/docs",amountInMinorUnit:!0,supportedCurrencies:["INR","USD","EUR","GBP","SGD","AED","MYR"],supportedCountries:["IN"],paymentMethods:["card","netbanking","wallet","upi","emi","bank_transfer"]};var Pe=`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sanwo Checkout</title>
</head>
<body style="background-color:#fff;height:100vh">
  <script>
    {{sanwoBridge}}

    var params = {{params}};

    function initPayment() {
      try {
        var customerName = (params.firstName || '') + (params.lastName ? ' ' + params.lastName : '');
        if (!customerName.trim()) customerName = params.email;

        var config = {
          amount: params.amount,
          currency: params.currency || 'NGN',
          reference: params.reference,
          customerFullName: customerName,
          customerEmail: params.email,
          apiKey: params.publicKey,
          contractCode: params.contractCode,
          paymentDescription: params.description || 'Payment',
          isTestMode: params.isTestMode !== undefined ? params.isTestMode : (params.publicKey && params.publicKey.indexOf('TEST') !== -1),
          onLoadStart: function() {},
          onLoadComplete: function() {
            sanwoCallback('loaded', {});
          },
          onComplete: function(response) {
            sanwoCallback('success', {
              reference: response.paymentReference,
              transaction_id: response.transactionReference,
              transactionReference: response.transactionReference,
              paymentReference: response.paymentReference,
              amountPaid: response.amountPaid,
              paidOn: response.paidOn,
              paymentStatus: response.paymentStatus,
              raw: response
            });
          },
          onClose: function(data) {
            sanwoCallback('cancelled', data || {});
          }
        };

        if (params.metadata) config.metadata = params.metadata;
        if (params.redirectUrl) config.redirectUrl = params.redirectUrl;
        if (params.paymentMethods) config.paymentMethods = params.paymentMethods;
        if (params.incomeSplitConfig) config.incomeSplitConfig = params.incomeSplitConfig;

        MonnifySDK.initialize(config);
      } catch(e) {
        sanwoCallback('error', { message: e.message });
      }
    }

    var mfScript = document.createElement('script');
    mfScript.src = 'https://sdk.monnify.com/plugin/monnify.js';
    mfScript.onload = initPayment;
    mfScript.onerror = function() {
      sanwoCallback('error', { message: 'Failed to load Monnify SDK' });
    };
    document.body.appendChild(mfScript);
  <\/script>
</body>
</html>`,ee={id:"monnify",name:"monnify",displayName:"Monnify",template:Pe,website:"https://monnify.com",documentation:"https://docs.monnify.com",amountInMinorUnit:!1,supportedCurrencies:["NGN"],supportedCountries:["NG"],paymentMethods:["card","bank_transfer","ussd","phone_number"]};var _e=`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sanwo Checkout</title>
</head>
<body style="background-color:#fff;height:100vh">
  <script>
    {{sanwoBridge}}

    var params = {{params}};

    function initPayment() {
      try {
        var config = {
          merchant_code: params.publicKey,
          amount: params.amount,
          currency: params.currency,
          customer_email: params.email,
          txn_ref: params.reference,
          onComplete: function(response) {
            sanwoCallback('success', {
              reference: response.txnref,
              ...response
            });
          },
          onClose: function() {
            sanwoCallback('cancelled', {});
          }
        };

        if (params.firstName) config.customer_first_name = params.firstName;
        if (params.lastName) config.customer_last_name = params.lastName;
        if (params.payItemId) config.pay_item_id = params.payItemId;
        if (params.payItemName) config.pay_item_name = params.payItemName;
        if (params.siteRedirectUrl) config.site_redirect_url = params.siteRedirectUrl;

        sanwoCallback('loaded', {});
        window.webpayCheckout(config);
      } catch(e) {
        sanwoCallback('error', { message: e.message });
      }
    }

    var iwScript = document.createElement('script');
    iwScript.src = 'https://newwebpay.interswitchng.com/inline-checkout.js';
    iwScript.onload = initPayment;
    iwScript.onerror = function() {
      sanwoCallback('error', { message: 'Failed to load Interswitch SDK' });
    };
    document.body.appendChild(iwScript);
  <\/script>
</body>
</html>`,te={id:"interswitch",name:"interswitch",displayName:"Interswitch",template:_e,website:"https://interswitchgroup.com",documentation:"https://developer.interswitchgroup.com",amountInMinorUnit:!0,supportedCurrencies:["NGN"],supportedCountries:["NG"],paymentMethods:["card","bank_transfer","ussd","qr"]};var L={paystack:W,flutterwave:X,razorpay:Q,monnify:ee,interswitch:te};function x(e){return L[e.toLowerCase()]}function M(){return Object.keys(L)}function ae(e,t){L[e.toLowerCase()]=t}function T(e){var t;return{id:e.id||"custom",name:e.name||"custom",displayName:e.displayName||"Custom Provider",template:e.template,amountInMinorUnit:(t=e.amountInMinorUnit)!=null?t:!0,supportedCurrencies:e.supportedCurrencies}}var Ue={NGN:"\u20A6",USD:"$",GBP:"\xA3",EUR:"\u20AC",GHS:"\u20B5",ZAR:"R",KES:"KSh",INR:"\u20B9",JPY:"\xA5",CAD:"CA$",AUD:"A$",CNY:"\xA5",BRL:"R$"};function A(e){return Ue[e.toUpperCase()]||e}var xe='.sanwo-amount-form{display:flex;flex-direction:column;gap:12px;max-width:400px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}.sanwo-amount-input-wrapper{display:flex;align-items:center;border:2px solid #e2e8f0;border-radius:8px;padding:0 12px;background:#fff;transition:border-color .2s}.sanwo-amount-input-wrapper:focus-within{border-color:#3b82f6}.sanwo-currency-symbol{font-size:18px;font-weight:600;color:#64748b;margin-right:8px;user-select:none}.sanwo-amount-input{border:none;outline:none;font-size:24px;font-weight:600;padding:12px 0;width:100%;background:transparent;-moz-appearance:textfield}.sanwo-amount-input::-webkit-outer-spin-button,.sanwo-amount-input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}.sanwo-amount-input::placeholder{color:#cbd5e1;font-weight:400}.sanwo-email-input{border:2px solid #e2e8f0;border-radius:8px;padding:12px 16px;font-size:14px;outline:none;width:100%;box-sizing:border-box;transition:border-color .2s;font-family:inherit}.sanwo-email-input:focus{border-color:#3b82f6}.sanwo-input-error{border-color:#ef4444!important}.sanwo-amount-error{color:#ef4444;font-size:13px;margin-top:-4px}.sanwo-pay-button{background:#3b82f6;color:#fff;border:none;border-radius:8px;padding:14px 24px;font-size:16px;font-weight:600;cursor:pointer;transition:background .2s,transform .1s;font-family:inherit}.sanwo-pay-button:hover{background:#2563eb}.sanwo-pay-button:active{transform:scale(.98)}.sanwo-pay-button:disabled{background:#94a3b8;cursor:not-allowed;transform:none}',re=!1;function Me(){if(re||typeof document=="undefined")return;re=!0;let e=document.createElement("style");e.id="sanwo-amount-form-styles",e.textContent=xe,document.head.appendChild(e)}function S(e){let t;if(e.provider.toLowerCase()==="custom"){if(!e.template)throw new Error('Custom provider requires a "template" option with the provider HTML template string');t=T({template:e.template,id:e.providerId,name:e.providerName,amountInMinorUnit:e.amountInMinorUnit})}else if(t=x(e.provider),!t)throw new Error(`Unknown provider "${e.provider}". Available: ${M().join(", ")}, custom`);let a=Z({provider:t,publicKey:e.publicKey,debug:e.debug,timeout:e.timeout,containerId:e.containerId});return{checkout:r=>a(r),close:()=>a.close(),destroy:()=>a.destroy(),get instance(){return a}}}async function ne(e){if(e.provider.toLowerCase()==="custom"&&e.templateUrl&&!e.template){let t=await fetch(e.templateUrl);if(!t.ok)throw new Error(`Failed to fetch template from "${e.templateUrl}": ${t.status} ${t.statusText}`);return S(U(_({},e),{template:await t.text()}))}return S(e)}function Te(e){let t=e.dataset.sanwoProvider,a=e.dataset.sanwoKey;if(!t||!a)return null;let r={provider:t,publicKey:a,debug:e.dataset.sanwoDebug==="true",containerId:e.dataset.sanwoContainer};e.dataset.sanwoTemplate&&(r.template=e.dataset.sanwoTemplate),e.dataset.sanwoProviderId&&(r.providerId=e.dataset.sanwoProviderId),e.dataset.sanwoProviderName&&(r.providerName=e.dataset.sanwoProviderName),e.dataset.sanwoAmountInMinorUnit==="false"&&(r.amountInMinorUnit=!1);let n=e.dataset.sanwoTimeout;n&&(r.timeout=Number(n));let c=e.dataset.sanwoAmount,o=e.dataset.sanwoCurrency,v=e.dataset.sanwoEmail;if(!c||!o||!v)return null;let u={amount:Number(c),currency:o,customer:{email:v,firstName:e.dataset.sanwoFirstName,lastName:e.dataset.sanwoLastName,phone:e.dataset.sanwoPhone},reference:e.dataset.sanwoReference,description:e.dataset.sanwoDescription};return{config:r,options:u}}function oe(e,t){let a=e.dataset.sanwoCallback;if(a){let r=window[a];typeof r=="function"&&r(t)}e.dispatchEvent(new CustomEvent("sanwo:complete",{detail:t,bubbles:!0}))}function O(e,t){e.dispatchEvent(new CustomEvent("sanwo:error",{detail:t,bubbles:!0}))}async function se(e,t){let a=e.dataset.sanwoTemplateUrl;if(t.provider.toLowerCase()==="custom"&&a&&!t.template){let r=await fetch(a);if(!r.ok)throw new Error(`Failed to fetch template from "${a}": ${r.status}`);t.template=await r.text()}}function Oe(e){let t=e.dataset.sanwoProvider,a=e.dataset.sanwoKey;if(!t||!a){console.error("[Sanwo] Missing required: data-sanwo-provider, data-sanwo-key");return}let r=e.dataset.sanwoCurrency||"NGN",n=e.dataset.sanwoEmail,c=e.dataset.sanwoMinAmount?Number(e.dataset.sanwoMinAmount):void 0,o=e.dataset.sanwoMaxAmount?Number(e.dataset.sanwoMaxAmount):void 0,v=e.dataset.sanwoPlaceholder||"Enter amount",u=e.dataset.sanwoButtonText||"Pay Now";Me();let s=A(r),m=!n,f=document.createElement("div");f.className="sanwo-amount-form";let C=`<div class="sanwo-amount-input-wrapper"><span class="sanwo-currency-symbol">${s}</span><input type="number" class="sanwo-amount-input" placeholder="${v}"${c!=null?` min="${c}"`:' min="1"'}${o!=null?` max="${o}"`:""} step="any" required></div>`;m&&(C+='<input type="email" class="sanwo-email-input" placeholder="Email address" required>'),C+='<div class="sanwo-amount-error" style="display:none"></div>',C+=`<button type="button" class="sanwo-pay-button">${u}</button>`,f.innerHTML=C,e.appendChild(f);let b=f.querySelector(".sanwo-amount-input"),l=f.querySelector(".sanwo-email-input"),g=f.querySelector(".sanwo-amount-error"),w=f.querySelector(".sanwo-pay-button");function h(k){g.textContent=k,g.style.display="block"}function N(){g.style.display="none",g.textContent="",b.classList.remove("sanwo-input-error"),l==null||l.classList.remove("sanwo-input-error")}w.addEventListener("click",async k=>{var F;k.preventDefault(),N();let i=parseFloat(b.value);if(!i||i<=0){b.classList.add("sanwo-input-error"),h("Please enter a valid amount");return}if(c!=null&&i<c){b.classList.add("sanwo-input-error"),h(`Minimum amount is ${s}${c.toLocaleString()}`);return}if(o!=null&&i>o){b.classList.add("sanwo-input-error"),h(`Maximum amount is ${s}${o.toLocaleString()}`);return}let d=m?(F=l==null?void 0:l.value)==null?void 0:F.trim():n;if(!d){l==null||l.classList.add("sanwo-input-error"),h("Please enter your email address");return}let E=q(i,r),y={provider:t,publicKey:a,debug:e.dataset.sanwoDebug==="true",containerId:e.dataset.sanwoContainer};e.dataset.sanwoTemplate&&(y.template=e.dataset.sanwoTemplate),e.dataset.sanwoProviderId&&(y.providerId=e.dataset.sanwoProviderId),e.dataset.sanwoProviderName&&(y.providerName=e.dataset.sanwoProviderName),e.dataset.sanwoAmountInMinorUnit==="false"&&(y.amountInMinorUnit=!1);let R=e.dataset.sanwoTimeout;R&&(y.timeout=Number(R));try{await se(e,y)}catch(I){h("Failed to load payment template"),O(e,I);return}w.disabled=!0,w.textContent="Processing\u2026";try{let ce=await S(y).checkout({amount:E,currency:r,customer:{email:d,firstName:e.dataset.sanwoFirstName,lastName:e.dataset.sanwoLastName,phone:e.dataset.sanwoPhone},reference:e.dataset.sanwoReference,description:e.dataset.sanwoDescription});oe(e,ce)}catch(I){O(e,I)}finally{w.disabled=!1,w.textContent=u}})}function ie(){if(typeof document=="undefined")return;let e=()=>{document.querySelectorAll("[data-sanwo-provider]").forEach(a=>{if(a.dataset.sanwoInitialized!=="true"){if(a.dataset.sanwoInitialized="true",a.dataset.sanwoCustomAmount==="true"){Oe(a);return}a.addEventListener("click",async r=>{r.preventDefault();let n=Te(a);if(!n){console.error("[Sanwo] Missing required data attributes: data-sanwo-provider, data-sanwo-key, data-sanwo-amount, data-sanwo-currency, data-sanwo-email");return}try{await se(a,n.config)}catch(o){O(a,o);return}let c=S(n.config);try{let o=await c.checkout(n.options);oe(a,o)}catch(o){O(a,o)}})}})};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e):e()}return ye(Re);})();
if(typeof window!=='undefined'){window.Sanwo=Sanwo;Sanwo.autoInit&&Sanwo.autoInit();}
//# sourceMappingURL=sanwo.global.js.map