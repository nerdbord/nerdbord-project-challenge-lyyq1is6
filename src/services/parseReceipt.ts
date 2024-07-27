import checkIfReceipt from "./checkIfReceipt";
import getReceiptContents from "./getReceiptContents";

async function parseRecepit(imageUrl: string) {
  const isReceipt = checkIfReceipt(imageUrl)
  if (!isReceipt) return null
  return getReceiptContents(imageUrl)
}

export default parseRecepit;
