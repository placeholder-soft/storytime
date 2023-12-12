import { CloudFunctionsType } from "model/functions";

export type CloudFunctionsTypeWithUid = {
  [P in keyof CloudFunctionsType]: (
    ...args: [...Parameters<CloudFunctionsType[P]>, string | undefined]
  ) => ReturnType<CloudFunctionsType[P]>;
};
