export type Character =
  | {
      type: "human" | "dog" | "cat";
    }
  | {
      type: "custom";
      name: string;
    };

// user/{uid}/projects/{projectId}

//  it equals StoryProgressPromptRole at FE
export enum Role {
  System = "system",
  User = "user",
  Assistant = "assistant",
}

// what we send to openAI for next generation, its an accumulated list: RawPrompt[], it = StoryProgress at FE
export type RawPrompt = {
  role: Role;
  content: string;
};

// note: Project = Story from FE
export type Project = {
  character: Character;
  name: string;
  createdAt: number;
  minted: boolean;
  title: string;
  introduction: string;
  coverImage: string;
  rawPrompts: RawPrompt[];
};

// content is to display, value is what user give prompt to
export type SceneOption = { content: string; value: string };

// not sure if we should just put this under Project Model or use relation, all works for me
export type Scene = {
  id: string;
  projectId: string;
  title: string; // project
  introduction: string; // project
  type: "story-introduction" | "story-followup" | "story-ending";
  character: string;
  setting: string;
  sceneNumber: number;
  sceneTitle: string;
  sceneImage: string;
  sceneDescription: string;
  optionsPrompt: string;
  options: string[];
};
