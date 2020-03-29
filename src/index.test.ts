import '@jomaxx/jest-polly';
import remark from 'remark';
import plugin from './index';

const markdown = `
![](https://github.com/jomaxx/remark-embedded-code-snippets/blob/78d8ec567422a9776beb2d48dd826189aed58267/prettier.config.js#L1)

![javascript](https://github.com/jomaxx/remark-embedded-code-snippets/blob/78d8ec567422a9776beb2d48dd826189aed58267/prettier.config.js#L1-L2)
`;

test('embeds code snippet', async () => {
  const result = await run(markdown);

  expect(result).toMatchInlineSnapshot(`
    "    module.exports = require('@spotify/web-scripts/config/prettier.config.js');

    \`\`\`javascript
    module.exports = require('@spotify/web-scripts/config/prettier.config.js');

    \`\`\`
    "
  `);
});

function run(string: string) {
  return new Promise((resolve, reject) => {
    remark()
      .use(plugin)
      .process(string, (err, file) => {
        if (err) reject(err);
        else resolve(String(file));
      });
  });
}
