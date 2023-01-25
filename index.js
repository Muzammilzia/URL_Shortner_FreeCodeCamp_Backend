require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const urlSchema = require('./schema/urlSchema');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
const DB = process.env.DB;

function isValidHttpUrl(string) {
  try {
    const newUrl = new URL(string);
    return newUrl.protocol === 'https:';
  } catch (err) {
    return false;
  }
}

app.use(cors());
app.use(bodyParser.urlencoded())
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.get('/api/shorturl/:url', async (req, res) => {
  const url = await urlSchema.findOne({shortURL: req.params.url});
  res.redirect(url.originalURL)
})

app.post("/api/shorturl", async (req, res) => {
  try {
    if(!isValidHttpUrl(req.body.url)){
      return res.json({error: 'invalid url'})
    }
    const url = await urlSchema.findOne({originalURL: req.body.url})
    if(url){
      return res.json({
        original_url: url.originalURL,
        short_url: url.shortURL,
      })
    }else{
      const count = await urlSchema.count()
      const newURL = await new urlSchema({
        originalURL: req.body.url,
        shortURL: count
      })
      newURL.save().then(response => {
        return res.json({
          original_url: response.originalURL,
          short_url: response.shortURL,
        })
      })
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message
    })
  }

})

mongoose.connect(DB).then(()=>{
  console.log("Database Connected!")
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
