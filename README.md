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
- Build project for deploy
```bash
# run command
$ npm run deploy
```
## Deploy
- Clean and Build
```bash
# run command
$ npm run clean
$ npm run deploy
```
- Connect to the server `192.168.132.12`
- kill process
```bash
# list processes
$ ps aux | grep js
$ kill [process number]
```
- Change dir to `admin` dir
```bash
$ cd admin
```
- Copy local `admin_panel_build` dir to server `admin_panel_build` dir
- Run server
```bash
# run server
$ cd admin
$ node admin/admin_panel_build/server/app.js &
$ exit
```

