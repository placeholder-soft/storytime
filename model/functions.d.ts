export type CloudFunctionsType = {
  generateImage(prompt: string): Promise<{ url: string; finalPrompt: string }>;
};
