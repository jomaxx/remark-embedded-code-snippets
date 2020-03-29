# remark-embedded-code-snippets

[Remark](https://remark.js.org/) plugin for [embedding code snippets from github permalinks](https://github.blog/2017-08-15-introducing-embedded-code-snippets/).

## Usage

```sh
yarn add --dev remark-embedded-code-snippets
```

```javascript
import remark from 'remark';
import embeddedCodeSnippets from 'remark-embedded-code-snippets';
import report from 'vfile-reporter';

remark()
  .use(embeddedCodeSnippets)
  .process(markdown, (err, file) => {
    console.log(String(file));
    console.error(report(err || file));
  });
```

### Example

#### Input

```markdown
![javascript](https://github.com/spotify/web-scripts/blob/4393f46c3d73b9243837a46c64641d707e5dfbc4/.prettierrc.js#L1)
```

#### Output

```javascript
module.exports = require('./packages/prettier-config');
```
