# Mysubs-API
An api for searching and downloading subtitles for movies and tv-shows in various languages.

## Installation
```shell
git clone https://github.com/HasanAbbadi/mysubs-api
cd mysubs-api
npm install
npm run start
```

the api will start at port 4500 by default.

## Usage:
There are three routes to this api:

* `/all`:       sends all json data from `all-data.json`.
* `/search`:    search the file for subtitles you can use the imdb id or the title of the show.
* `/get`:        used with the id that you get from using the search route. 

### `/search` Route:
You can search this api using the imdb id or the title of the movie/tv-show you're looking for.

* Available parameters:
    * `lang`:   specify the language of the subtitles.
    * `s`:      specify the season if it's a series.
    * `e`:      specify the episode of the season.
