import fetchChatCompletion from "./fetchChatCompletion";

const SYSTEMPROMPT = `You are working as a validator of shopping $RECEIPTS.
Your task is to read the contents of the $RECEIPT and format it into a JSON structure.
Respond ONLY by correctly filling out the following object structure, where each "itemName" represents an item from the $RECEIPT, and each "totalPrice" is a number.
{
'dateOfReceipt': {
    'itemName': 'totalPrice',
  },
}
Do not wrap the json codes in JSON markers.
`;

async function getReceiptContents(imageUrl: string) {
  const response = await fetchChatCompletion(SYSTEMPROMPT, imageUrl);
  const jsonStringfromResponse = response.choices[0].message.content
  return JSON.parse(jsonStringfromResponse);
}

export default getReceiptContents;
