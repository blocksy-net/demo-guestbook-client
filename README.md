
# BlockSY guestbook client

This is the source code repository of BlockSY Guestbook demonstrator client.
You can test a live version of the Guestbook here: https://blocksy-demo.symag.com/symag/

You can get more informations about BlockSY here : https://blocksy-wiki.symag.com

## install

In order to build the source you need to install:
- node: https://nodejs.org/en/download/
- yarn: https://yarnpkg.com/lang/en/docs/install/

Then run the following commands:

```
yarn install
yarn add webpack@2.6.1 webpack-dev-server@2.6.1 // version 3 has some issues for now
```

## get your nodejs .bin location (usually node_modules\.bin)
```
npm bin 
```

## build and run in dev mode locally (just change .bin location)
```
node_modules\.bin\webpack-dev-server --history-api-fallback --port 8081 --open
```

Your browser will automatically open url http://localhost:8081.

By default the client connects to Symag's Guestbook demo server.
If you want to point to your own BlockSY Guestbook server, put your URL in webpack.config.js file.

## build for production (just change .bin location)
```
node_modules\.bin\webpack --env.prod --progress -p
```

Result is generated in dist directory.
