## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
* Install node version 10.6.0 (Use nvm to install 10.6.0 and set default version by `nvm alias default 10.6.0`)

* Open `Xcode > Preferences`. Go to the `locations` panel and select most recent version of Xcode in `Command Line Tools`. Below is the reference.

![Xcode setup](http://facebook.github.io/react-native/docs/assets/GettingStartedXcodeCommandLineTools.png)

* Download the `facebook iOS SDK` by [clicking here](https://origincache.facebook.com/developers/resources/?id=facebook-ios-sdk-current.zip) and unzip the archive to `~/Documents/FacebookSDK`.

### Installation

* Clone this repo.

* Install dependencies for React Native.
```bash
$ cd whatsMyFood
$ npm i
$ cd wahtsMyFood/reactNative
$ npm i
$ npm i -g babel-upgrade react-native-git-upgrade
$ babel-upgrade
$ react-native-git-upgrade

```

* Link react-native-fbsdk with the Below command
```bash
$ react-native link react-native-fbsdk
```

* Using Xcode open `whatsMyFood > reactNative > ios > whatsMyFood.xcodeproj`

* Click on the project on the left pane and you will see menus appearing on the right pane.

* Go to RCTFBSDK.xcodeproj then build settings->framework search paths. And change `~/Documents/FacebookSDK` to `$(HOME)/Documents/FacebookSDK`

* Now run the app using command line
```bash
$ react-native run-ios
```
(or) using Xcode left top build button (play icon).
