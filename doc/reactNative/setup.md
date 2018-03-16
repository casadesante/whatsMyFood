## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
* You need to have `React Native` installed in your system. Please follow the instructions
[here](http://facebook.github.io/react-native/docs/getting-started.html) to install `react-native-cli`.

* Open `Xcode > Preferences`. Go to the `locations` panel and select most recent version of Xcode in `Command Line Tools`. Below is the reference.

![Xcode setup](http://facebook.github.io/react-native/docs/assets/GettingStartedXcodeCommandLineTools.png)

* Download the `facebook iOS SDK` by [clicking here](https://origincache.facebook.com/developers/resources/?id=facebook-ios-sdk-current.zip) and unzip the archive to `~/Documents/FacebookSDK`.

### Installation

* Clone this repo.

* Install dependencies for React Native.
```bash
$ cd whatsMyFood/reactNative
$ npm install
```

* Link react-native-fbsdk with the Below command
```bash
$ react-native link react-native-fbsdk
```

* Using Xcode open `whatsMyFood > reactNative > ios > whatsMyFood.xcodeproj`

* Click on the project on the left pane and you will see menus appearing on the right pane.

* Click `Build settings` and search for `Framework Search Paths` and add the path to your FacebookSDK that you downloaded above. Below is the reference image.

![FacebookSDK link](https://tppr.s3.amazonaws.com/uploads/ace607e5d16cfd47bfed0a5be84ec638.png)

* Now run the app.
```bash
$ react-native run-ios
```
