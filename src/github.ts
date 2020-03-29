import fetch, { Request } from 'node-fetch';
import { Context, Match } from './types';

export async function getContent(
  { owner, repo, path, ref }: Match,
  { githubApi, username, token }: Context,
) {
  const endpoint = `${githubApi}/repos/${owner}/${repo}/contents/${path}?ref=${ref}`;
  const request = new Request(endpoint);

  if (username) {
    const credentials = Buffer.from(`${username}:${token}`).toString('base64');
    request.headers.set('Authorization', `Basic ${credentials}`);
  }

  const response = await fetch(request);
  const json = await response.json();

  return response.ok
    ? Buffer.from(json.content, 'base64').toString()
    : `GitHubError: ${json.message}`;
}
