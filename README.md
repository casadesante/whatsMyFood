# whatsMyFood
A mobile app to remember your fav food at each restaurant you eat.

### Setting up React native:
Please follow the instructions [here](/doc/reactNative/setup.md) to set up React Native.  

### Contributing:
This repo uses [Commitzen](https://www.npmjs.com/package/commitizen) to make the commits more readable and understandable. **cz-conventional-changelog** commitzen adapter is added at the root's `package.json`.

Install commitzen globally by running `npm install commitizen -g`.

Install commitzen's plugin named emoji-cz by running `npm install emoji-cz -g`

#### Commit workflow:

- Add your files using `git add` or `git add .`
- Commit by running `npm run commit`
- Answer the questions and it will automatically commit
- Now, push the commits to remote. 

### Serverless setup:
- Check into **serverless** by running `cd serverless/functions`.
- Run `npm i -g firebase-tools` to deploy firebase functions.
- Set required **environment variables** by running
```js
firebase functions:config:set telegram.groupid="<TELEGRAM-GROUPID>"
firebase functions:config:set telegram.token="<TELEGRAM-BOT-TOKEN>"
``` 
- Check **Telegram Bot** section for any help with telegram environment variable information.
- After changing the source code in `serverless/functions/index.js`, run `firebase deploy --only functions`.

### Telegram Bot
- Get the **TELEGRAM-BOT-TOKEN** from **TelegramBotFather** account in telegram.

- To get the telegram **groupID**, hit the following URL:
`https://api.telegram.org/bot<TELEGRAM-BOT-TOKEN>/getUpdates`
- Look for the value of `chat.id`.

### NoSQL Documentation:
- [Users](https://github.com/sharathvignesh/whatsMyFood/blob/master/doc/db/noSQLSchema.md#users)
- [Restaurants](https://github.com/sharathvignesh/whatsMyFood/blob/master/doc/db/noSQLSchema.md#restaurants)
- [User-Restaurant-Menus](https://github.com/sharathvignesh/whatsMyFood/blob/master/doc/db/noSQLSchema.md#user-restaurant-menus)