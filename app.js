const express = require('express');

const { initializeApp, applicationDefault, cert, } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const key = require('./privatekey.json');
const functions = require('firebase-functions');


initializeApp({
    credential: cert(key),
  });
  
  const db = getFirestore();


const app = express();
app.use('/public',express.static('public'));

app.get('/:url' , async (req,res)=>{
   var snapshot = await db.collection('urls').where('short','==',req.params.url).get();

   if(snapshot.docs.at(0) == undefined)
        res.redirect('/public/404');
   else{
      var URL =  snapshot.docs.at(0).get('url');
      res.redirect(URL);
   }
   
});

app.get('/', (req,res)=>{
  res.redirect('https://url-dwarf.web.app');
});


app.get('/public/404', (req,res)=>{
  res.sendFile(`${__dirname}/public/404.html`);
});


const port = process.env.PORT || 8080;

app.listen(port);
console.log('localhost:'+ port)

//exports.app = functions.https.onRequest(app);

