import visit from 'unist-util-visit';
import { createApi } from './github';
import { matchPermalink } from './matchPermalink';
import { Context } from './types';

export function githubPermalinksPlugin({
  github = 'https://github.com',
  githubApi = 'https://api.github.com',
  username = '',
  token = '',
} = {}) {
  const context: Context = {
    github,
    githubApi,
    username,
    token,
  };

  const { getContent } = createApi(context);

  return async function transformer(tree: any) {
    const promises: Promise<any>[] = [];

    visit(tree, 'paragraph', (paragraph: any, _, parent: any) => {
      if (paragraph.children.length !== 1) {
        return;
      }

      const [image] = paragraph.children;

      if (image.type !== 'image') {
        return;
      }

      promises.push(
        (async () => {
          const match = matchPermalink(image.url, context);

          if (match) {
            const content = await getContent(match);

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

    await Promise.all(promises);
  };
}
