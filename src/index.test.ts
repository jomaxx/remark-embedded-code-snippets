import '@jomaxx/jest-polly';
import remark from 'remark';
import plugin from './index';

const markdown = `
![](https://github.com/spotify/web-scripts/blob/4393f46c3d73b9243837a46c64641d707e5dfbc4/.prettierrc.js#L1)

![js](https://github.com/spotify/web-scripts/blob/4393f46c3d73b9243837a46c64641d707e5dfbc4/.prettierrc.js#L1-L2)
`;

test('embeds code snippet', async () => {
  const result = await run(markdown);

  expect(result).toMatchInlineSnapshot(`
    "    module.exports = require('./packages/prettier-config');

    \`\`\`js
    module.exports = require('./packages/prettier-config');

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
