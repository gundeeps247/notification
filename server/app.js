const express = require("express");
const app = express();
const webpush = require('web-push');
const cors = require("cors");

const port = 3000;

const apiKeys = {
    publicKey: "BFKnRoDz48jEu9XMhT7ogCHkMb82kgCIpVBrdWb9MFOoDQ_S7vQ4TXFf9YLGAvB2XAKXufCEeMuRvpoNUkRP8Xg",
    privateKey: "iSfmen5jReU59t7EUhou-u9i0Gm-AVWrtCQwG3psRJ0"
};

webpush.setVapidDetails(
    'mailto:goyalyash1605@gmail.com',
    apiKeys.publicKey,
    apiKeys.privateKey
);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello world");
});

const subDatabase = {};

app.post("/save-subscription", (req, res) => {
    const { userId, subscription } = req.body;
    if (userId && subscription) {
        subDatabase[userId] = subscription;
        res.json({ status: "Success", message: "Subscription saved!" });
    } else {
        res.status(400).json({ status: "Error", message: "Missing user ID or subscription data" });
    }
});

// Function to send notifications to a specific user
function sendNotificationToUser(userId, message) {
    const subscription = subDatabase[userId];
    if (subscription) {
        webpush.sendNotification(subscription, message)
            .catch(error => {
                console.error("Error sending notification:", error);
            });
    }
}

// Route to handle sending push notification to a specific user
app.post("/send-notification", (req, res) => {
    const { userId, message } = req.body;
    if (userId && message) {
        sendNotificationToUser(userId, message);
        res.json({ status: "Success", message: "Notification sent!" });
    } else {
        res.status(400).json({ status: "Error", message: "Missing user ID or message" });
    }
});

// Trigger the function when the server starts
app.listen(port, () => {
    console.log("Server running on port 3000!");
});
