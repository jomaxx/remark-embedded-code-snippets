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
![javascript](https://github.com/jomaxx/remark-embedded-code-snippets/blob/78d8ec567422a9776beb2d48dd826189aed58267/prettier.config.js#L1)
```

#### Output

```javascript
module.exports = require('@spotify/web-scripts/config/prettier.config.js');
```
