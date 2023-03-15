# fyers-api-gas
get fyers access token using Google Apps Script

```
/*
  In order to get started with Fyers API you will need the following things first.
  1. app_id and appSecret
  2. you can find it on fyers API dashboard: https://myapi.fyers.in/dashboard/
  3. or- if you do not have an App then create a new App and get the values.


  Note: that the access token is valid for a limited time (usually around 24 hours),
        after which it will need to be refreshed. You can do this by calling the
        `getAccessToken()` function again.
*/

```

step-1 copy and paste below code into your gs file:

```
function getAccessToken(){
  const username = "xxxxxxx"      // fyers_id
  const password = "xxxxxxxxxx"   // fyers_password
  const pin = "xxxx"              // your integer pin
  const app_id = 'xxxxxxxxxx-xxx' // "L9NY****W-100" (Client_id here refers to APP_ID of the created app)
  const appSecret = 'xxxxxxxxxx'  // app_secret key which you got after creating the app
  
  const fyerstokengs = UrlFetchApp.fetch("https://raw.githubusercontent.com/1DarshikGajjar1/fyers-api-gas/main/fyers-access-token.gs").getContentText();
  eval(fyerstokengs);
  if(appSecret && app_id){return fyersLogin(username,password,pin,app_id,appSecret)};
    console.log("access token is stored!")
}
function accesstoken() {
  var scriptProperties = PropertiesService.getScriptProperties();
  return scriptProperties.getProperty('access_token');
}

```

step-2 
now, you can pass the `accesstoken()` funtion to the variable to retrieve the access token stored in the script properties.

```
const access_token = accesstoken();

```
