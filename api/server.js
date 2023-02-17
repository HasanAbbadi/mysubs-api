import fs from 'fs';
import fetch from 'node-fetch';
import data from "../all-data.json" assert { type: "json" };
   
// To solve the cors issue
import cors from 'cors';

// json file with the data
import express from "express";
const app = express();
  
   
const port = process.env.PORT || 4500;

app.listen(port, () => console.log(`Server started at ${port}`));

app.use(cors());

if (app.get('env') === 'development') {
  app.locals.pretty = true;
}

app.get('/', (req, res) => {
    res.set('Content-Type', 'text/plain')
    res.send(`[Welcome to the largest free subtitles api 😄!]

Available routes: /search/, /get/`)
} )
// when get request is made, alldata() is called
app.get('/all', alldata);
function alldata(request, response) {
    response.send(data);
}
  
app.get('/search', (req, res) => {
    res.set('Content-Type', 'text/plain')
    res.send(`USAGE: /search/IMDB_ID (or title)
    /search/IMDB_ID (or title)?lang=LANGUAGE
    /search/IMDB_ID (or title)?lang=LANGUAGE&s=SEASON
    /search/IMDB_ID (or title)?lang=LANGUAGE&s=SEASON&e=EPISODE

EXAMPLE:
    /search/tt0944947?lang=Danish&s=03&e=05
    /search/Game of Thrones?lang=Arabic&s=03&e=05`)
})

app.get('/search/:query', searchElement);
function searchElement(request, response) {
    const query = request.params.query;
    const lang = request.query.lang;
    const season = request.query.s;
    const episode = request.query.e;
    let se,ep
    const result = data.filter((e) => {
        const key = query.startsWith('tt') ? e.imdb_id : e.title
        if (e.season != undefined){
            se = e.season.split('E')[0].match(/(\d+)/)
            ep = e.season.split('E').pop()
            if (se) {
                se = se[0]
            }
        }
        if (lang != undefined && season != undefined && episode != undefined){
            return key == query &&
                e.lang == lang &&
                se == season &&
                episode == ep
        } else if (lang != undefined && episode != undefined){
            return key == query &&
                e.lang == lang &&
                episode == ep
        } else if (lang != undefined && season != undefined){
            return key == query &&
                e.lang == lang &&
                se == season
        } else if (lang != undefined){
            return key == query &&
                e.lang == lang
        }
        return key == query
    })

    if (result.length == 1){
        response.redirect(`/get/${result[0].id}`)
    }
    response.send(result)
}

app.get('/get', (_, res) => {
    res.send('USAGE: /get/MYSUBS_ID')
})

app.get('/get/:id', getSub);
async function getSub(request, response) {
    const id = request.params.id;
    const res = await fetch(`https://www.mysubs.org/get-subtitle/${id}`)
    const text = await res.text()

    response.set('Content-Type', 'text/plain')
    response.send('WEBVTT\n\n' + text)
}