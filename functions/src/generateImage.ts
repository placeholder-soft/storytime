import { CloudFunctionsTypeWithUid } from "./handlersType";

export const generateImage: CloudFunctionsTypeWithUid["generateImage"] = async (
  prompt,
  uid,
) => {
  return {
    url: "hello",
    finalPrompt: "world" + prompt,
  };
};
