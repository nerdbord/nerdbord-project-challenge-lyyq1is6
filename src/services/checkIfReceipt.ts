import fetchChatCompletion from "./fetchChatCompletion";

const SYSTEMPROMPT = `$RECEIPT is a document received by a customer in a shop after buying some articles. 
$RECEIPT should have the date of the purchase, a list of purchased items and their corresponding prices.
You are working as a validator of shopping $RECEIPTS. 
Users are uploading documents other than $RECEIPTS, for example credit card payment confirmations.
Your task is to distinguish pictures showing a single, clear $RECEIPT.
You are supposed to always come up with a true/false answer.
Respond ONLY by correctly filling out the following object structure, where the only field is of type boolean.
{
"isReceipt": boolean,
}
`;

async function checkIfReceipt(imageUrl: string) {
  const response = await fetchChatCompletion(SYSTEMPROMPT, imageUrl);
  const jsonStringfromResponse = response.choices[0].message.content
  return JSON.parse(jsonStringfromResponse);
}

export default checkIfReceipt;
