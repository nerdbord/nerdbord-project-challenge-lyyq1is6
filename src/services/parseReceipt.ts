import checkIfReceipt from "./checkIfReceipt";
import getReceiptContents from "./getReceiptContents";

async function parseRecepit(imageUrl: string) {
  const isReceipt = await checkIfReceipt(imageUrl);
  if (!isReceipt.isReceipt) {
    const date = new Date().toDateString();
    return {
      [date]: {
        "Couldn't parse.": 0,
      },
    };
  }
  return getReceiptContents(imageUrl);
}

export default parseRecepit;
