import visit from 'unist-util-visit';
import { extname } from 'path';
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

  const { getSnippet } = createApi(context);

  return async function transformer(tree: any) {
    const promises: Promise<any>[] = [];

    visit(tree, 'paragraph', (paragraph: any, _, parent: any) => {
      if (paragraph.children.length !== 1) {
        return;
      }

      const [image] = paragraph.children;

      if (image.type !== 'image' || image.alt) {
        return;
      }

      promises.push(
        (async () => {
          const match = matchPermalink(image.url, context);

          if (match) {
            parent.children.splice(parent.children.indexOf(paragraph), 1, {
              type: 'code',
              lang: image.title || extname(match.path).slice(1),
              value: await getSnippet(match),
            });
          }
        })(),
      );
    });

    await Promise.all(promises);
  };
}
