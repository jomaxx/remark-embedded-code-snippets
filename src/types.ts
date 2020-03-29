export type Context = {
  github: string;
  githubApi: string;
  username?: string;
  token?: string;
};

export type Match = {
  owner: string;
  repo: string;
  ref: string;
  path: string;
  firstLineIndex: number;
  numOfLines: number;
};
