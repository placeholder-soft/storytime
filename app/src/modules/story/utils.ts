export const parseScene = (content: string) => {
  // TODO: parse `Scene` type out of AI generated content
  console.log(content);
  return {
    content: "",
    options: [],
  };
};

export const parseStoryGuideline = (content: string) => {
  // TODO: parse the story title, coverImage, intro and first `Scene` type out of AI generated content
  console.log(content);
  return {
    title: "",
    intro: "",
    coverImageUrl: "",
    scene: {
      content: "",
      options: [],
    },
  };
};
