import 'react-native-get-random-values';
import * as sdk from "matrix-js-sdk";

let __client__ = null;

export const initClient = () => {
  if (!__client__)
    __client__ = sdk.createClient({ baseUrl: "https://matrix.org" });
};

export const Client = () => {
  return __client__;
};
