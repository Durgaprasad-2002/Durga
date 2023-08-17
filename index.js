const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const { MongoClient, ObjectId } = require("mongodb");
const { mongo } = require("mongoose");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

const Update = async () => {
  const db = await connectToDB();
  const Bookingcollection = db.collection("Bookings");
  const Bookingitems = await Bookingcollection.find({}).toArray();
  const Carcollection = db.collection("carsdata");
  const Caritems = await Carcollection.find({}).toArray();

  const current = new Date();
  const date = `${current.getFullYear()}-${
    current.getMonth() + 1
  }-${current.getDate()}`;

  for (let i = 0; i < Caritems.length; i++) {
    for (let j = 0; j < Bookingitems.length; j++) {
      if (Caritems[i]._id == Bookingitems[j].BookingDetails.car_id) {
        let En =
          Bookingitems[j]?.EndTime?.split("T")[0] ||
          Bookingitems[j]?.BookingDetails?.EndTime?.split("T")[0];
        if (En < date) {
          const itemId = Caritems[i]._id;
          let updatedItem = Caritems[i];
          updatedItem.car_status = "Available";
          const collection = db.collection("carsdata");
          const result = await collection.updateOne(
            { _id: new ObjectId(itemId) },
            { $set: updatedItem }
          );
        }
      }
    }
  }
};

app.use(cors(corsOptions)); // Use this after the variable declaration
const PORT = process.env.PORT || 3000;
const mongoURI =
  "mongodb+srv://prasaddurga2031:1234@app.lkbwh19.mongodb.net/?retryWrites=true&w=majority";

app.use(bodyParser.json());

async function connectToDB() {
  try {
    const client = new MongoClient(mongoURI, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db("rental");
    console.log("Connected");
    return db;
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

//---------------------Login Credentials-------------------

//---posting login details

app.post("/postlogcred", async (req, res) => {
  const newItem = req.body;
  console.log(newItem);
  const db = await connectToDB();
  const collection = db.collection("logins");
  const result = await collection.insertOne(newItem);
  res.json(result);
});

//---retriveing login details

app.get("/getlogcred", async (req, res) => {
  const db = await connectToDB();
  const collection = db.collection("logins");
  const items = await collection.find({}).toArray();
  res.json(items);
});


app.get("/updatestatus", async (req, res) => {
  Update();
});


//---------------------------------------------------------------------------------

//------------------------- Cars Data--------------------------------------

//--retriving cars data--

app.get("/getdata", async (req, res) => {
  const db = await connectToDB();
  const collection = db.collection("carsdata");
  const items = await collection.find({}).toArray();
  res.json(items);
});

//--adding cars data

app.post("/postcardata", async (req, res) => {
  const newItem = req.body.carData;
  console.log(newItem);
  const db = await connectToDB();
  const collection = db.collection("carsdata");
  const result = await collection.insertOne(newItem);
  res.json(result);
});

//--updating cars data

app.put("/modifycar/:id", async (req, res) => {
  const itemId = req.params.id;
  const updatedItem = req.body.carData;
  console.log(itemId);
  console.log(updatedItem);
  const db = await connectToDB();
  const collection = db.collection("carsdata");
  const result = await collection.updateOne(
    { _id: new ObjectId(itemId) },
    { $set: updatedItem }
  );
  console.log(result);
  res.json(
    result.modifiedCount > 0
      ? { message: "Item updated successfully" }
      : console.log("NOT Updated")
  );
});

//--deleting car data

app.delete("/deletecar/:id", async (req, res) => {
  const itemId = req.params.id;
  const db = await connectToDB();
  const collection = db.collection("carsdata");
  const result = await collection.deleteOne({ _id: new ObjectId(itemId) });
  res.json(
    result.deletedCount > 0
      ? { message: "Item deleted successfully" }
      : console.log("not deleted")
  );
});

//-----------------------------------------------------------------------------------------------------------------------------

//--------------------Booking Details--------------------------------------------

//--posting booking---

app.post("/postbookingdata", async (req, res) => {
  const newItem = req.body;
  console.log(newItem);
  const db = await connectToDB();
  const collection = db.collection("Bookings");
  const result = await collection.insertOne(newItem);
  res.json(result);
});

//--retriving booksing data---

app.get("/bookingsdata", async (req, res) => {
  const db = await connectToDB();
  const collection = db.collection("Bookings");
  const items = await collection.find({}).toArray();
  res.json(items);
});

//---modifying data---
app.put("/modifybook/:id", async (req, res) => {
  console.log("post method");
  const itemId = req.params.id;
  const updatedItem = req.body;
  console.log(itemId);
  console.log(updatedItem);
  const db = await connectToDB();
  const collection = db.collection("Bookings");
  const result = await collection.updateOne(
    { _id: new ObjectId(itemId) },
    { $set: updatedItem }
  );
  console.log(result);
  res.json(
    result.modifiedCount > 0
      ? { message: "Item updated successfully" }
      : console.log("NOT Updated")
  );
});

//-to delete

app.delete("/deletebook/:id", async (req, res) => {
  const itemId = req.params.id;
  const db = await connectToDB();
  const collection = db.collection("Bookings");
  const result = await collection.deleteOne({ _id: new ObjectId(itemId) });
  res.json(
    result.deletedCount > 0
      ? { message: "Item deleted successfully" }
      : console.log("not deleted")
  );
});

//---------------------------------------------------------------------------------

//----------------------------------------Staring Server---------------------------

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  connectToDB();
});
