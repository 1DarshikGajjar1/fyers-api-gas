function fyersLogin(username,password,pin,client_id,appSecret) {
  // login
  const loginData = {
    fy_id: username,
    password,
    app_id: "2",
    imei: "",
    recaptcha_token: ""
  };
  const loginOptions = {
    method: "post",
    payload: JSON.stringify(loginData),
    followRedirects: false,
    muteHttpExceptions:true
  };
  const loginResponse = UrlFetchApp.fetch("https://api.fyers.in/vagator/v1/login", loginOptions);
  const request_key = JSON.parse(loginResponse.getContentText())["request_key"];
  Logger.log("login initiated ...")

  // verify pin
  const verifyPinData = {
    request_key,
    identity_type: "pin",
    identifier: pin,
    recaptcha_token: ""
  };
  const verifyPinOptions = {
    method: "post",
    payload: JSON.stringify(verifyPinData),
    followRedirects: false
  };
  const verifyPinResponse = UrlFetchApp.fetch("https://api.fyers.in/vagator/v1/verify_pin", verifyPinOptions);
  const token = JSON.parse(verifyPinResponse.getContentText())["data"]["access_token"];
  Logger.log("pin verified ...")

  // get auth code
  const headers = {
    authorization: `Bearer ${token}`,
    "content-type": "application/json; charset=UTF-8"
  };
  const authCodeData = {
    fyers_id: username,
    app_id: client_id.slice(0, -4),
    redirect_uri:"https://127.0.0.1:5000/login",
    appType: "100",
    code_challenge: "",
    state: "abcdefg",
    scope: "",
    nonce: "",
    response_type: "code",
    create_cookie: true
  };
  const authCodeOptions = {
    method: "post",
    headers,
    payload: JSON.stringify(authCodeData),
    followRedirects: false
  };
  const authCodeResponse = UrlFetchApp.fetch("https://api.fyers.in/api/v2/token", authCodeOptions);
  const cookie = JSON.parse(authCodeResponse.getContentText())["cookie"];
  const parsedURL = JSON.parse(authCodeResponse.getContentText())["Url"];
  const authCodePattern = /auth_code=([^&]+)/;
  const auth_code = authCodePattern.exec(parsedURL)[1];

  // get access token
  const validateAuthcodeData = {
    grant_type: "authorization_code",
    appIdHash: Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, client_id+":"+appSecret)
              .map(function(byte){return ('0' + (byte & 0xFF)
              .toString(16)).slice(-2);})
              .join(''),
    code: auth_code
  };
  const validateAuthcodeOptions = {
    method: "post",
    headers: {
      "content-type": "application/json",
      cookie
    },
    payload: JSON.stringify(validateAuthcodeData)
  };
  const validateAuthcodeResponse = UrlFetchApp.fetch("https://api.fyers.in/api/v2/validate-authcode", validateAuthcodeOptions);
  const access_token = JSON.parse(validateAuthcodeResponse.getContentText())["access_token"];
  const scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty('access_token', access_token);
  Logger.log("authenticated")
  return access_token
}
