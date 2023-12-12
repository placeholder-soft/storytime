export type CloudFunctionsType = {
  generateImage(prompt: string): Promise<{ image_url: string, revised_prompt: string }>;
};
