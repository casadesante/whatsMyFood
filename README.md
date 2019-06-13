# WhatsMyFood

[WhatsMyFood](https://whatsmyfood.glitch.me)
Personal food review tracking made easy.

We chance upon various restaurants in which some dishes are great, whilst some are terrible, and it’s hard to remember all of them. When we revisit those restaurants, WMF will happily help you recall those good and terrible dishes.

### Why WhatsMyFood?
![WMF Illustration](https://raw.githubusercontent.com/sharathvignesh/whatsMyFood/master/doc/imgs/Illustrations.png)

### Landing Page:
[WhatsMyFood](https://whatsmyfood.glitch.me)

### How it Looks in Mobile:
![WMF GIF](https://raw.githubusercontent.com/sharathvignesh/whatsMyFood/master/doc/imgs/wmfgif.gif)

### Setting up React native:
1. Please follow the instructions [here](/doc/reactNative/setup.md) to set up React Native.
2. Create the `.env` file in root directory of the project with the requird keys

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
- After changing the source code in `serverless/functions/index.js`, CD `whatsMyFood/serverless/functions` and run `firebase deploy --only functions`.

### Telegram Bot
- Get the **TELEGRAM-BOT-TOKEN** from **TelegramBotFather** account in telegram.
- To get the telegram **groupID**, hit the following URL:
`https://api.telegram.org/bot<TELEGRAM-BOT-TOKEN>/getUpdates`
- Look for the value of `chat.id`.

### Cron Job
We need to send a weekly report of users, restuarnts & foods added to our database. This requires cron feature in firebase functions. This is not supported for the moment. So, we have used [cron-jon](https://cronless.com), an external resource to invoke the respective functions which sends a weekly report to telegram group.

### Building ios app and pushing it to Beta Flight Testing
1. Go the Build settings, increment the version number and build number.
2. Select `Generic Device` from the phone selection.
3. Hit `Command + Shift + ,` and make sure release is selected.
4. In **Xcode**, click `product` and then select `archive`
5. Once archive is completed, a wizard will open.
6. In the wizard, click `Validate the App`.
7. Once Validation is completed, Click `Distribute to the App Store`.

### NoSQL Documentation:
- [Users](https://github.com/sharathvignesh/whatsMyFood/blob/master/doc/db/noSQLSchema.md#users)
- [Restaurants](https://github.com/sharathvignesh/whatsMyFood/blob/master/doc/db/noSQLSchema.md#restaurants)
- [User-Restaurant-Menus](https://github.com/sharathvignesh/whatsMyFood/blob/master/doc/db/noSQLSchema.md#user-restaurant-menus)

### XCode Build Issues:

#### FBSDK issue
```
'FBSDKShareKit/FBSDKShareKit.h' file not found
```
If you find the above issue, do the following steps:
1. Click the Project Navigator icon.
2. Under Libraries, Find `RCTFBSDK.xcodeproj` & double click it.
3. On the Build Settings in the right, In **Framework Search Paths**, add this `$(HOME)/Documents/FacebookSDK`
4. Now running the build, will solve the problem. 

Happy Hacking!
