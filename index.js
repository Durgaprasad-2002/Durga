const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const { MongoClient, ObjectId } = require("mongodb");
const { mongo } = require("mongoose");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const app = express();
const cors = require("cors");
const fs = require("fs");
const htmlContent = fs.readFileSync("Main.html", "utf8");
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
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


//---------------------------------------

app.put("/signupmail/:id", async (req, res) => {
  let mail = req.params.id;
  // Create a transporter using SMTP
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,

    auth: {
      user: "prasaddurga2031@gmail.com",
      pass: "iskcfaubrcdwfoeq",
    },
  });

  const mailOptions = {
    from: "Sai@1234567",
    to: mail,
    subject: "SignUp Info",
    html: htmlContent,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.json({ status: "Failed to send" });
      console.log("Error sending email:", error);
    } else {
      res.json({ status: "Mail sent Successful" });
      console.log("Email sent:", info.response);
    }
  });
});


app.put("/postmail/:id", async (req, res) => {
  let mail = req.params.id;
  let userDetails;
  if (req.body.BookingDetails == undefined || req.body.BookingDetails == null) {
    userDetails = req.body;
  } else {
    userDetails = req.body.BookingDetails;
  }
  // Create a transporter using SMTP
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "prasaddurga2031@gmail.com",
      pass: "iskcfaubrcdwfoeq",
    },
  });

  const mailOptions = {
    from: "prasaddurga2031@gmail.com",
    to: mail,
    subject: "Booking Details",
html: `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #007bff;">Booking Confirmation</h2>
        <p>Hello <strong>${userDetails.name}</strong>,</p>
        <p>Thank you for booking, Happy Journey..!<br/> Here are your details:</p>
        <ul style="list-style-type: none; padding-left: 0;">
          <li><strong>Name:</strong> ${userDetails.name}</li>
          <li><strong>Email:</strong> ${userDetails.address}</li>
          <li><strong>Car Model:</strong> ${userDetails.car_name}</li>
          <li><strong>From Time:</strong> ${userDetails.StartTime}</li>
          <li><strong>To Time:</strong> ${userDetails.EndTime}</li>
        </ul>
        <p>If you have any questions or need assistance, feel free to contact us.</p>
        <p style="margin-top: 20px;">Best regards,</p>
        <p><strong>Big Boy Toyz</strong></p>
      </div>
  `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.json({ status: "Failed to send" });
      console.log("Error sending email:", error);
    } else {
      res.json({ status: "Mail sent Successful" });
      console.log("Email sent:", info.response);
    }
  });
});

app.put("/cancelmail/:id", async (req, res) => {
  let mail = req.params.id;

  let userDetails;
  if (req.body.BookingDetails == undefined || req.body.BookingDetails == null) {
    userDetails = req.body;
  } else {
    userDetails = req.body.BookingDetails;
  }
  // Create a transporter using SMTP
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "prasaddurga2031@gmail.com",
      pass: "iskcfaubrcdwfoeq",
    },
  });

  const mailOptions = {
    from: "prasaddurga2031@gmail.com",
    to: mail,
    subject: "Booking Details",
   html: `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #007bff;">Booking Cancelled</h2>
        <p>Hello <strong>${userDetails.name}</strong>,</p>
        <p>Your Booking is Cancelled...!<br/> Here are your details:</p>
        <ul style="list-style-type: none; padding-left: 0;">
          <li><strong>Name:</strong> ${userDetails.name}</li>
          <li><strong>Email:</strong> ${userDetails.address}</li>
          <li><strong>Car Model:</strong> ${userDetails.car_name}</li>
          <li><strong>From Time:</strong> ${userDetails.StartTime}</li>
          <li><strong>To Time:</strong> ${userDetails.EndTime}</li>
        </ul>
        <p>If you have any questions or need assistance, feel free to contact us.</p>
        <p style="margin-top: 20px;">Best regards,</p>
        <p><strong>Big Boy Toyz</strong></p>
      </div>
  `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.json({ status: "Failed to send" });
      console.log("Error sending email:", error);
    } else {
      res.json({ status: "Mail sent Successful" });
      console.log("Email sent:", info.response);
    }
  });
});


//---------------------Login Credentials-------------------

//---posting login details

app.post("/postlogcred", async (req, res) => {
  const newItem = req.body.cred;
  const Check = {
    type: newItem.type,
    user: newItem.user,
  };
  const db = await connectToDB();
  const collection = db.collection("logins");
  const existingCredentials = await collection.findOne(Check);
  if (existingCredentials) {
    res.json({ statUser: "exits" });
    console.log("Existed");
  } else {
    const result = await collection.insertOne(newItem);
    res.json(result);
    console.log("Created");
  }
});

//---retriveing login details

app.get("/getlogcred", async (req, res) => {
  const db = await connectToDB();
  const collection = db.collection("logins");
  const items = await collection.find({}).toArray();
  res.json(items);
});

// app.get("/updatestatus", async (req, res) => {
//   ;
// });

//---------------------------------------------------------------------------------

//------------------------- Cars Data--------------------------------------

//--retriving cars data--

app.get("/getdata", async (req, res) => {
  //---upmethod
  const current = new Date();

  const date = `${current.getFullYear()}-${
    current.getMonth() + 1
  }-${current.getDate()}`;

  const currentDateAndTime = new Date();
  const minDate = currentDateAndTime.toISOString();
  const db = await connectToDB();
  const Bookingcollection = db.collection("Bookings");
  const Carcollection = db.collection("carsdata");
  let Bookingitems = [];
  console.log(minDate);
  Bookingitems = await Bookingcollection.find({
    $or: [
      { EndTime: { $gte: minDate } },
      { "BookingDetails.EndTime": { $gte: minDate } },
    ],
  }).toArray();
  console.log(Bookingitems);
  let size = Bookingitems.length;
  let Caritems = await Carcollection.find({}).toArray();

  //-----------------------------------------------------------

  for (let i = 0; i < Caritems.length; i++) {
    if (size === 0) break;
    let flag = false;
    for (let j = 0; j < Bookingitems.length; j++) {
      let d1 = new Date(
        Bookingitems[j]?.EndTime?.split("T")[0] ||
          Bookingitems[j]?.BookingDetails?.EndTime?.split("T")[0]
      );
      let d2 = new Date(date);
      if (
        d1 >= d2 &&
        Caritems[i]._id == Bookingitems[j].BookingDetails.car_id
      ) {
        console.log(Bookingitems[j]);
        console.log(d1, d2);
        flag = true;
        size = size - 1;
        break;
      }
    }

    if (flag == false) {
      const itemId = Caritems[i]._id;
      let updatedItem = Caritems[i];
      
      if (updatedItem.car_status !== "Available"){
        console.log(Caritems[i], "FalseOne", flag);
      updatedItem.car_status = "Available";
      Caritems[i] = updatedItem;
      const collection = db.collection("carsdata");
      const result = await collection.updateOne(
        { _id: new ObjectId(itemId) },
        { $set: updatedItem }
      );
      }
    } else {
      const itemId = Caritems[i]._id;
      let updatedItem = Caritems[i];
      if (updatedItem.car_status !== "Booked"){
      console.log(Caritems[i], "Trueone", flag);
      updatedItem.car_status = "Booked";
      Caritems[i] = updatedItem;
      const collection = db.collection("carsdata");
      const result = await collection.updateOne(
        { _id: new ObjectId(itemId) },
        { $set: updatedItem }
      );
      }
    }
  }
  res.json(Caritems);
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
  console.log("Updated car");
  console.log(updatedItem);
  const db = await connectToDB();
  const collection = db.collection("carsdata");
  const result = await collection.updateOne(
    { _id: new ObjectId(itemId) },
    { $set: updatedItem }
  );
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
