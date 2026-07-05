import 'react-native-get-random-values';
import * as sdk from "matrix-js-sdk";

let __client__ = null;

export const initClient = (access_token?, device_id?, user_id?) => {
  if (!__client__)
    __client__ = sdk.createClient({
      baseUrl: "https://matrix.org",
      accessToken: access_token || null,
      deviceId: device_id || null,
      userId: user_id || null,
    });

  return __client__;
};

export const Client = () => {
  return __client__;
};
