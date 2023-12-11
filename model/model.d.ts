export type Character =
  | {
      type: "human" | "dog" | "cat";
    }
  | {
      type: "custom";
      name: string;
    };

// user/{uid}/projects/{projectId}
export type Project = {
  character: Character;
  name: string;
  createdAt: number;
  minted: boolean;
  title: string;
  image: string;
};
