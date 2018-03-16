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

### Serverless:
- Install functions emulator `npm install -g @google-cloud/functions-emulator` to test your functions locally.
- Download the service account from firebase console and replace it with `serviceAccoun.copy.json`. Set the name to `serviceAccount.json`.
