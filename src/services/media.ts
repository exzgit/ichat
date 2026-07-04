import AsyncStorage from "@react-native-async-storage/async-storage";

import { Buffer } from "buffer";
global.Buffer = Buffer;

export async function mxcUrlToHttpV1(mxcUrl, width = 64, height = 64, method = "scale", timeout = 5000) {
  if (!mxcUrl) return null;

  const mxc = mxcUrl.replace("mxc://", "");
  const [serverName, mediaId] = mxc.split("/");

  const accessToken = await AsyncStorage.getItem("access_token");

  return `https://matrix.org/_matrix/client/v1/media/thumbnail/${serverName}/${mediaId}?width=${width}&height=${height}&method=${method}&timeout=${timeout}&access_token=${accessToken}`;
}

export async function mxcUrlToImageV1(mxcUrl, width = 64, height = 64, method = "scale", timeout = 5000) {
  if (!mxcUrl) return null;

  const accessToken = await AsyncStorage.getItem("access_token");

  const mxc = mxcUrl.replace("mxc://", "");
  const [serverName, mediaId] = mxc.split("/");


  const res = await fetch(
    `https://matrix.org/_matrix/client/v1/media/thumbnail/${serverName}/${mediaId}?width=${width}&height=${height}&method=${method}&timeout=${timeout}`,
    {
      headers: {
        Accept: "image/*",
        Authorization: `Bearer ${accessToken}` 
      }
    });

  const contentType = res.headers.get("content-type") || "image/png";

  const buffer = await res.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");

  return `data:${contentType};base64,${base64}`;
}
