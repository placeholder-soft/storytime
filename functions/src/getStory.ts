import { CloudFunctionsTypeWithUid } from "./handlersType";

export const getStory: CloudFunctionsTypeWithUid["getStory"] = async (
  id: string
) => {
  return {
    id,
    story: "This is a story",
  };
};
