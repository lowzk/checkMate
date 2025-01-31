import util from "util"
import axios from "axios"
import * as admin from "firebase-admin"
import * as functions from "firebase-functions"
import { defineString } from "firebase-functions/params"
import { imageHash } from "image-hash"

const graphApiVersion = defineString("GRAPH_API_VERSION")
const graphApiUrl = process.env["GRAPH_API_URL"] || "https://graph.facebook.com"
const imageHashSync = util.promisify(imageHash)

if (!admin.apps.length) {
  admin.initializeApp()
}

async function downloadWhatsappMedia(mediaId: string) {
  const token = process.env.WHATSAPP_TOKEN
  //get download URL
  const response = await axios({
    method: "GET", // Required, HTTP method, a string, e.g. POST, GET
    url: `${graphApiUrl}/${graphApiVersion.value()}/${mediaId}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  let url = response?.data?.url
  let responseBuffer
  if (url) {
    try {
      //download image and upload to cloud storage
      responseBuffer = await axios({
        method: "GET",
        url: url,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "arraybuffer",
      })
    } catch (err) {
      functions.logger.log(err)
      throw new Error(
        "Error occured while downloading and calculating hash of image"
      )
    }
  } else {
    throw new Error("Error occured while fetching image url from Facebook")
  }
  return Buffer.from(responseBuffer.data)
}

async function getHash(buffer: Buffer) {
  const result = await imageHashSync(
    {
      data: buffer,
    },
    8,
    true
  )
  return result
}

async function getSignedUrl(storageUrl: string) {
  try {
    const storage = admin.storage()
    const [temporaryUrl] = await storage
      .bucket()
      .file(storageUrl)
      .getSignedUrl({
        action: "read",
        expires: Date.now() + 60 * 60 * 1000,
      })
    return temporaryUrl
  } catch (error) {
    functions.logger.error(error)
    // You can also log the error to an external monitoring service or send an alert to the developers
    return null
  }
}

export { downloadWhatsappMedia, getHash, getSignedUrl }
