import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';



  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get('/filteredimage', async (req, res) => {
    const image_url = req.query.image_url;

    //Validate 
    if (!image_url) {
      return res.status(400).send({ message: 'Image URL is required' });
    }
    try{
      console.log(image_url);
      const filteredPathUrl = await filterImageFromURL(image_url);
      res.sendFile(filteredPathUrl, async (e) => {
        if (e) {
          res.status(500).send({ message: 'Error sending file' });
        } else {
          await deleteLocalFiles([filteredPathUrl]);
        }
      });
    } catch (error) {
      return res.status(422).send({ message: 'Can not process the image with error', error: error });
    }
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
