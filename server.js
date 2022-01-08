//Dependencies
require ('dotenv').config()
//pull PORT from .env and set it to 3001 or it sets to what is returned from process.env
const { PORT = 3001, DATABASE_URL } = process.env
//import express and express is a function
const express = require('express');
//create application object
const app = express()
//import mongoose
const mongoose = require('mongoose')
// import middlware
const cors = require("cors")
const morgan = require("morgan")


//establish connection
mongoose.connect(DATABASE_URL)
// Connection Events
mongoose.connection
  .on("open", () => console.log("You are connected to MongoDB"))
  .on("close", () => console.log("You are disconnected from MongoDB"))
  .on("error", (error) => console.log(error))

  //models
  const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String,
  })

  const People = mongoose.model("People", PeopleSchema)

  //import middleware -- req => middleware => route => res
app.use(cors()) // to prevent cors errors, open access to all origins
app.use(morgan("dev")) // logging
app.use(express.json()) // parse json bodies JSON.parse("{"name":joe"}") => {name: joe}


//routes
//test route
app.get('/', (req, res) => {
    res.send('hello world');

})

// PEOPLE INDEX ROUTE
app.get("/people", async (req, res) => {
    try {
      // send all people
      res.json(await People.find({}))
    } catch (error) {
      //send error
      res.status(400).json(error)
    }
  })
  
  // PEOPLE CREATE ROUTE
  //async await
  app.post("/people", async (req, res) => {
    try {
      // send all people
      res.json(await People.create(req.body))
    } catch (error) {
      //send error
      res.status(400).json(error)
    }
  })

  // PEOPLE DELETE ROUTE
app.delete("/people/:id", async (req, res) => {
    try {
      // send all people
      res.json(await People.findByIdAndDelete(req.params.id))
    } catch (error) {
      //send error
      res.status(400).json(error)
    }
  });
  
  // PEOPLE UPDATE ROUTE
  app.put("/people/:id", async (req, res) => {
    try {
      // send all people
      res.json(
        await People.findByIdAndUpdate(req.params.id, req.body, { new: true })
      )
    } catch (error) {
      //send error
      res.status(400).json(error)
    }
  });

//listener
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`))
