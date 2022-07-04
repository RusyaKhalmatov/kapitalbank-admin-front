# Kapitalbank admin panel

## Dependencies
- install nodeJS 16.15.0

## Install

```bash
# run commands
$ cd /path-to/kapital-admin-fron
$ npm install
```

## Start project locally
```bash
# run commands
$ npm start
```
- open in browser `http://localhost:8882`

## Develop
```bash
# run command
$ npm run dev
```
- open in browser `http://localhost:8080`

## Build

- build project for deploy
```bash
# run command
$ npm run deploy
```

## Deploy

- Connect to the server
- kill process
```bash
# list processes
$ ps aux | grep js
$ kill [process number]
```
- copy local `admin_panel_build` dir to server `admin_panel_build` dir
- run server
```bash
# run server
$ node admin/admin_panel_build/server/app.js &
$ exit
```

