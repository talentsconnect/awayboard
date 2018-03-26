# Awayboard

"The Awayboard" is a dashboard-like overview for teams, whose members may work remotely, 
to know which team member is working from where.

Draggable photo-like tiles of team-members can be placed in columns
for office, homeoffice and away.

![Screenshot displaying main features of the application](assets/screenshot.png)

## Browser support 

Following are browsers, in which the "Awayboard" was tested and appeared usable.

The "+" means, it is expected to keep on working in coming versions.


| [<img src="https://raw.githubusercontent.com/talentsconnect/awayboard/master/assets/images/firefox.png" alt="Firefox" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/talentsconnect/awayboard/master/assets/images/chrome.png" alt="Chrome" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/talentsconnect/awayboard/master/assets/images/safari.png" alt="Safari" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/talentsconnect/awayboard/master/assets/images/opera.png" alt="Opera" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Opera | [<img src="https://raw.githubusercontent.com/talentsconnect/awayboard/master/assets/images/chrome-android.png" alt="Chrome for Android" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome for Android |
| --------- | --------- | --------- | --------- | --------- |
| 59+| 65+ | 11+ | 51+ | last version |

Missing browser support results by the use of the feaures: [CSS Grid](https://caniuse.com/#feat=css-grid) and [CSS Variables](https://caniuse.com/#feat=css-variables) - this may be re-written at some point.

<small>(browser icons by https://github.com/godban/browsers-support-badges)</small>

## Usage
Enter a name and an image-url (has to be somewhere online), click "Add person".
Then drag your tile to the desired column.

After that, tiles are stored permanently, so every person may update their working status accordingly.


## Installation
1. Build a docker image

    `$ docker build . -t awayboard `
    
2. Run it with published port. That can be changed in the Dockerfile.

    `$ docker run -p 5711:5711 awayboard`


## Configuration
In `conf.json` it is possible to configurate the desired columns, each with title, background-iamge and symbol.
Although the Awayboard uses CSS Grids' `auto-fit` and a fractional width, not all configurations might look equally good.
Up to six columns were tested und look quite ok on a usual large screen.


## Credits

Idea based on an offline, whiteboard-and-magnets based solution by the Talents Connect SMASH-Squad.

Code initially written by [https://github.com/voodoocode/](https://github.com/voodoocode/).

#### Background images
Thanks to unsplash.com and the kind photographers of the photos which are used as the columns' background images.

* "Office" [photo by Jack Finnigan](https://unsplash.com/photos/qTT9w8MRLvo)
* "Homeoffice" [photo by Slava Keyzman](https://unsplash.com/photos/qr4d407hSjo)
* "Away": [photo by Andrew Charney](https://unsplash.com/photos/0Y-tc6hu5gg)