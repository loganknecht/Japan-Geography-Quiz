# 日本の地理クイズ (Japan Geography Quiz)

日本の地理クイズのためにウェッブサイトで練習できます。このウェッブサイトでさまざまな日本の所をくれて正しい返事を待っている。地図に正しい所を選ばなければなってもし正しい所を選んだら次の質問に進みます。しかし違い答えで答えたら二回だけチャンスで応えることができます。全部のちゃんすが不可答えたらあの質問が失敗とマークして次の質問を進ませる。この度に数タイプのクイズがあります。クイズによって特に地方を学べることができる。地方選択肢は四つの島：九州と沖縄、本州、四国、北海道。そして、日本の地方も選ぶことができます：九州と沖縄、四国、中国、関西、中部、関東、東北、北海道。

Live site: https://loganknecht.github.io/Japan-Geography-Quiz/

## Setup

```bash
nvm install
npm install --global corepack
corepack enable
yarn install
yarn dev
```

## Commands

| Command       | What it does                                  |
| ------------- | --------------------------------------------- |
| `yarn dev`    | Run the site locally                          |
| `yarn build`  | Type check and build into `dist/`             |
| `yarn lint`   | Check code and CSS rules (ESLint + Stylelint) |
| `yarn format` | Check formatting (Prettier)                   |
| `yarn fix`    | Auto-fix lint and formatting everywhere       |

## Branches

`feature/*` → `development` → `production`

- Every pull request must pass **Lint**, **Format**, and **Build**.
- Only `development` can merge into `production`.
- Merging into `production` deploys the site.

## Editors

- **Sublime Text:** Install `JsPrettier`, `LSP`, `LSP-eslint`, and `LSP-stylelint`. Start Sublime from the terminal with `subl japan-geography-quiz.sublime-project`.
- **VS Code:** Install the recommended extensions when prompted.

Files format and lint-fix on save.
