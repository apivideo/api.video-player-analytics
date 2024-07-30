<!--<documentation_excluded>-->
[![badge](https://img.shields.io/twitter/follow/api_video?style=social)](https://twitter.com/intent/follow?screen_name=api_video) &nbsp; [![badge](https://img.shields.io/github/stars/apivideo/api.video-player-analytics?style=social)](https://github.com/apivideo/api.video-player-analytics) &nbsp; [![badge](https://img.shields.io/discourse/topics?server=https%3A%2F%2Fcommunity.api.video)](https://community.api.video)
![](https://github.com/apivideo/.github/blob/main/assets/apivideo_banner.png)
![npm](https://img.shields.io/npm/v/@api.video/player-analytics) ![ts](https://badgen.net/badge/-/TypeScript/blue?icon=typescript&label)
<h1 align="center">api.video player analytics module</h1>

[api.video](https://api.video) is the video infrastructure for product builders. Lightning fast video APIs for integrating, scaling, and managing on-demand & low latency live streaming features in your app.

## Table of contents

- [Table of contents](#table-of-contents)
- [Project description](#project-description)
- [Getting started](#getting-started)
  - [Installation](#installation)
    - [Method #1: requirejs](#method-1-requirejs)
    - [Method #2: typescript](#method-2-typescript)
    - [Method #3: imple include in a javascript project](#method-3-imple-include-in-a-javascript-project)
- [Documentation](#documentation)
  - [Instantiation options](#instantiation-options)
  - [Module methods](#module-methods)
    - [**`ovbserveMedia(media: HTMLVideoElement)`**](#ovbservemediamedia-htmlvideoelement)
    - [**`dispose()`**](#dispose)


<!--</documentation_excluded>-->
<!--<documentation_only>
---
title: api.video Player analytics plugin
meta: 
  description: The official api.video Player analytics plugin for api.video. [api.video](https://api.video/) is the video infrastructure for product builders. Lightning fast video APIs for integrating, scaling, and managing on-demand & low latency live streaming features in your app.
---

# api.video Player analytics plugin

[api.video](https://api.video/) is the video infrastructure for product builders. Lightning fast video APIs for integrating, scaling, and managing on-demand & low latency live streaming features in your app.

</documentation_only>-->
## Project description

Javascript module to manually call the api.video analytics collector. 

This is useful if you are using a video player for which we do not yet provide a ready-to-use monitoring module.

If you use one of the following video player, you should rather use the associated packaged monitoring module:

| Player   | monitoring module                                                                           |
| -------- | ------------------------------------------------------------------------------------------- |
| video.js | [@api.video/api.video-videojs-analytics](https://github.com/apivideo/api.video-videojs-analytics) |
| hls.js   | [@api.video/api.video-hlsjs-analytics](https://github.com/apivideo/api.video-hlsjs-analytics)     |


This module is compatible with React Native.

## Getting started

### Installation 

#### Method #1: requirejs

If you use requirejs you can add the module as a dependency to your project with 

```sh
$ npm install --save @api.video/player-analytics
```

You can then use the module in your script: 

```javascript
var { PlayerAnalytics } = require('@api.video/player-analytics');


const playerAnalytics = new PlayerAnalytics({
    ...options // see below for available options
});
```

#### Method #2: typescript

If you use Typescript you can add the SDK as a dependency to your project with 

```sh
$ npm install --save @api.video/player-analytics
```

You can then use the SDK in your script: 

```typescript
import { PlayerAnalytics } from '@api.video/player-analytics'

const playerAnalytics = new PlayerAnalytics({
    ...options // see below for available options
});
```

#### Method #3: imple include in a javascript project

Include the SDK in your HTML file like so:

```html
<head>
    ...
    <script src="https://unpkg.com/@api.video/player-analytics" defer></script>
</head>
```

Then, once the `window.onload` event has been trigered, instantiate the module with `new PlayerAnalytics()`:
```html
<script type="text/javascript">
    var playerAnalytics = new PlayerAnalytics("#target", { 
        ...options // see below for available options
    });
</script>
```

## Documentation

### Instantiation options

The analytics module constructor takes a `PlayerAnalyticsOptions` parameter that contains the following options:

 
|         Option name | Mandatory | Type                                  | Description                                                                                                  |
| ------------------: | --------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
|            mediaUrl | **yes**   | string                                | url of the media (eg. `https://cdn.api.video/vod/vi5oDagRVJBSKHxSiPux5rYD/hls/manifest.m3u8`)                |
|        userMetadata | no        | ```{ [name: string]: string }[]```    | object containing [metadata](https://api.video/blog/tutorials/dynamic-metadata/) (see **Full example** below) |
|            sequence | no        | ```{start: number; end?: number;} ``` | if only a sequence of the video is going to be played                                                        |
| onSessionIdReceived | no        | ```(sessionId: string) => void```     | callback to be called once the session id is reveiced                                                        |
 

Once the module is instantiated, the following methods have to be called to monitor the playback events.

### Module methods

#### **`ovbserveMedia(media: HTMLVideoElement)`**

this method attaches event listeners to the provided HTMLVideoElement to track and analyze media playback events. No data will be collected before this method is called. 


#### **`dispose()`**

his method removes all event listeners attached by `observeMedia` and cleans up any resources used for tracking media playback events.

