# Sounds Loud

Sounds Loud is is a clone of Soundcloud, a music and audio platform that allows users to upload, share, and promote their original music and audio tracks. Sounds Loud not only allows users view and edit their own music, but also allows users to discover music that created by other users. Users can create an account and upload their own songs, or simply explore the website as a guest by using Demo User Login.

Sounds Loud was made with React and Redux.

# Technologies used in the application

* React
* Redux
* CSS
* Sqlite3
* Sequelize
* Express
* Node.js
* Javascript
* Git

# Features

* Add/ edit/ delete a album.
* Add/ edit/ delete a song.
* Add a song to an album.
* View every album's detail.
* View songs that created by other users.

# How to setup the application?

1. Download/clone the code and cd into /backend and frontend folders, running `npm install` in both folders.
2. cd into /backend folder, setting up a .env file for your local environment like something below
   ```
   PORT=8000
   DB_FILE=db/dev.db
   JWT_SECRET=/ePPAXIEp+yU2Q==
   JWT_EXPIRES_IN=604800
   ```
3. Setup your database by running the following code in the /backend folder:
   ```
   npx dotenv sequelize db:migrate
   npx dotenv sequelize db:seed:all
   ```
4. Start both the backend and frontend servers by running `npm install` in both folders.
