export type CloudFunctionsType = {
  generateImage(
    prompt: string
  ): Promise<{ image_url: string; revised_prompt: string }>;
  getStory(id: string): Promise<{ id: string; story: string }>;

  gaslessMint(
    to: string,
    title: string,
    imageUrl: string
  ): Promise<{ objectId: string }>;
};
