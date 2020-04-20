import express from 'express'
import bodyParser from 'body-parser'
import { sequelize } from './sequelize'
import { filterImageFromURL, deleteLocalFiles } from './util/util'
import { IndexRouter } from './controllers/v0/index.router'
import { requireAuth } from './controllers/v0/users/routes/auth.router'
import { V0MODELS } from './controllers/v0/model.index'

(async () => {
  await sequelize.addModels(V0MODELS)
  await sequelize.sync()

  const app = express()
  const port = process.env.PORT || 8082
  app.use(bodyParser.json())

  app.use('/api/v0/', IndexRouter)

  app.get('/filteredimage', 
    requireAuth, 
    async (req, res) => {
      const { image_url: imageUrl } = req.query 
      if (!imageUrl) {
        return res.status(404).send('image_url required')
      }
      try {
        const filePath = await filterImageFromURL(imageUrl)
        res.status(200).sendFile(filePath)
      } catch (err) {
        console.log(err)
        return res.status(422).send(err.message)
      }
  })
  
  // Root Endpoint - Displays a simple message to the user
  app.get("/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  })
  
  app.listen(port, () => {
      console.log( `server running http://localhost:${ port }` )
      console.log( `press CTRL+C to stop server` )
  })
})()
