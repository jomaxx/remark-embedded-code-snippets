import visit from 'unist-util-visit';
import { getContent } from './github';
import { matchPermalink } from './matchPermalink';
import { Context } from './types';

export function githubPermalinksPlugin({
  github = 'https://github.com',
  githubApi = 'https://api.github.com',
  username = process.env.GITHUB_USERNAME,
  token = process.env.GITHUB_TOKEN,
} = {}) {
  const context: Context = {
    github,
    githubApi,
    username,
    token,
  };

  return async function transformer(tree: any) {
    const promises: Promise<any>[] = [];

    visit(tree, 'paragraph', (paragraph: any, _, parent: any) => {
      if (paragraph.children.length !== 1) {
        return;
      }

      visit(paragraph, 'image', (image: any) => {
        promises.push(
          (async () => {
            const match = matchPermalink(image.url, context);

            if (match) {
              const content = await getContent(match, context);

              parent.children.splice(parent.children.indexOf(paragraph), 1, {
                type: 'code',
                lang: image.alt || undefined,
                value: content
                  .split('\n')
                  .slice(match.firstLineIndex, match.numOfLines)
                  .join('\n'),
              });
            }
          })(),
        );
      });
    });

    await Promise.all(promises);
  };
}
