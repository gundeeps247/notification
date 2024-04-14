const express = require("express");
const app = express();
const webpush = require('web-push');
const cors = require("cors");
const { MongoClient } = require('mongodb'); // Added for MongoDB connection

const port = 3000;

const apiKeys = {
  publicKey: "BFKnRoDz48jEu9XMhT7ogCHkMb82kgCIpVBrdWb9MFOoDQ_S7vQ4TXFf9YLGAvB2XAKXufCEeMuRvpoNUkRP8Xg",
  privateKey: "iSfmen5jReU59t7EUhou-u9i0Gm-AVWrtCQwG3psRJ0"
};

webpush.setVapidDetails(
  'mailto:gundeepsinhm@gmail.com',
  apiKeys.publicKey,
  apiKeys.privateKey
);

const corsOptions = {
    origin: 'https://notification-psi-virid.vercel.app/', // Replace with your frontend origin
  };
  
  app.use(cors(corsOptions));
  
app.use(express.json());

// Replace with your MongoDB Atlas connection string
const uri = "mongodb+srv://gundeepsinghm:collegepassword@cluster0.rnnuthn.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDb() {
    try {
      await client.connect();
      console.log("Connected to MongoDB Atlas");
      db = client.db("device details"); // Replace with your database name
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
    }
  }
  
  connectToDb(); // Call the connect function on app startup
  
  
app.get("/", (req, res) => {
    res.send("Hello world");
  });
  
  // No changes required here
  app.post("/save-subscription", async (req, res) => {
    try {
      const subscription = req.body;
      const result = await db.collection("subscriptions").insertOne(subscription);
      res.json({ status: "Success", message: "Subscription saved!", subscriptionId: result.insertedId });
    } catch (error) {
      console.error("Error saving subscription:", error);
      res.status(500).json({ status: "Error", message: "Failed to save subscription" });
    }
  });
  
  // Update this function to fetch subscriptions from MongoDB before sending notifications
  async function sendNotificationToAllSubscribers(message) {
    try {
      const subscriptions = await db.collection("subscriptions").find().toArray();
      subscriptions.forEach(subscription => {
        webpush.sendNotification(subscription, message)
          .catch(error => {
            console.error("Error sending notification:", error);
          });
      });
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    }
  }
  
  // No changes required here
  app.post("/send-notification", (req, res) => {
    const { message } = req.body;
    sendNotificationToAllSubscribers(message);
    res.json({ status: "Success", message: "Notification sent!" });
  });
  
  app.listen(port, () => {
    console.log(`Server running on port ${port}!`);
  });
  