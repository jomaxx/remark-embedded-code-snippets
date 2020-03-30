import fetch, { Request } from 'node-fetch';
import memoize from 'lodash.memoize';
import { Context, Match } from './types';

export function createApi({ githubApi, username, token }: Context) {
  const credentials =
    username && Buffer.from(`${username}:${token}`).toString('base64');

  const getJSON = memoize(async (path: string) => {
    const request = new Request(`${githubApi}${path}`);

    if (credentials) {
      request.headers.set('Authorization', `Basic ${credentials}`);
    }

    const response = await fetch(request);
    const data = await response.json();
    const { ok } = response;

    return { ok, data };
  });

  async function getSnippet({
    owner,
    repo,
    path,
    ref,
    firstLineIndex,
    numOfLines,
  }: Match) {
    const endpoint = `/repos/${owner}/${repo}/contents/${path}?ref=${ref}`;
    const { ok, data } = await getJSON(endpoint);
    return ok
      ? Buffer.from(data.content, 'base64')
          .toString()
          .split('\n')
          .slice(firstLineIndex, firstLineIndex + numOfLines)
          .join('\n')
      : `GitHubError: ${data.message}`;
  }

  return { getSnippet };
}
