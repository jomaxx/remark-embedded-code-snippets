import { Context, Match } from './types';

export function matchPermalink(
  href: string,
  { github }: Context,
): Match | null {
  const pattern = `^${github}/([^/]+)/([^/]+)/blob/([0-9a-f]{40})/([^#]+)#L([0-9]+)(-L([0-9]+))?$`;
  const regex = new RegExp(pattern);
  const match = href.match(regex);
  if (!match) return null;
  const [, owner, repo, ref, path, start, , end = start] = match;
  const firstLineIndex = Number(start) - 1;
  const numOfLines = 1 + Number(end) - Number(start);
  return { owner, repo, ref, path, firstLineIndex, numOfLines };
}
