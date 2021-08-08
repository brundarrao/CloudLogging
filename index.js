const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const nodemailer = require('nodemailer');
const Logs = require('./src/model/LogSchema');
const UserLocation = require('./src/model/UserLocationSchema');
const PORT = process.env.PORT || 5000;
require("dotenv").config();

const path = require("path");

app.use(express.static(path.join(__dirname, "frontend/client", "build")))

const mail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'clbemonitor@gmail.com',
        pass: 'clbem2021'
    }
});

const mailOptions = {
    from: 'clbemonitor@gmail.com',
    subject: 'Caution: Suspicious Login',
    html: `<h2>Hello</h2>`
}

app.use(cors());

mongoose.connect("mongodb+srv://BrundaB5:BrundaB5@123@cluster0.vw63z.mongodb.net/cloud-logging?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const connection = mongoose.connection;
mongoose.set('useFindAndModify', false);

connection.once("open", function() {
  console.log("Connection with MongoDB was successful");
});

app.use(express.json());

app.get('/', (req, res) => res.send('Hello world!'));

app.get('/logs', (req, res) => {
  console.log('Sending the logs');
    Logs.find({}, { _id: 0, __v: 0 }, { lean: true })
      .then(logs => res.json(logs))
      .catch(err => res.status(404).json({ nologsfound: 'No Logs found' }));
  });

app.post('/', (req, res) => {
    console.log(JSON.stringify(req.body, null, 2));
   Logs.create(req.body)
      .then(book => res.json({ msg: 'Logs added successfully' }))
      .catch(err => res.status(400).json({ error: 'Unable to log activity' }));
  });

app.post('/location', async (req, res) => {
    console.log(JSON.stringify(req.body, null, 2));

    const deg2rad = (deg) => (deg * (Math.PI/180));

    const getDistanceFromLatLonInKm = (lat1,lon1,lat2,lon2) => {
        const R = 6371; // Radius of the earth in km
        let dLat = deg2rad(lat2-lat1);  // deg2rad below
        let dLon = deg2rad(lon2-lon1);
        let a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return  R * c; // Distance in km
    };

    if (req.body.email && req.body.latitude && req.body.longitude) {
        const new_lat = req.body.latitude;
        const new_lng = req.body.longitude;
        let oldLocation;
        try {
            oldLocation = await UserLocation.findOne(
                {email: req.body.email},
                {_id: 0, email: 1, latitude: 1, longitude: 1, display_name: 1},
                {lean: true}
            );
        } catch(e) {
            console.log(`Failed to retrieve user location: ${JSON.stringify(e, null, 2)}`);
            return res.status(400).json({
                msg: 'Unable to retrieve user location',
                error: e
            });
        }
        let distance;
        console.log(`old location: ${JSON.stringify(oldLocation, null, 2)}`);
        if (oldLocation && oldLocation.latitude && oldLocation.longitude) {
            const old_lat = oldLocation.latitude;
            const old_lng = oldLocation.longitude;
            if (old_lat && old_lng && new_lat && new_lng) {
                distance = getDistanceFromLatLonInKm(old_lat, old_lng, new_lat, new_lng);
            }
            if (distance && distance > 5) {
                mailOptions.to = req.body.email;
                mailOptions.html = `<h2>Currently logged in from a place at a distance of ${distance} km from previous login</h2>
<p>Contact support if you have not logged in</p>`;
                mail.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            }
            console.log(`User logged in from a distance of ${distance} km`);
        } else {
            console.log('No user location information found');
        }

        const query = { email: req.body.email };
        let update = {
            latitude: req.body.latitude,
            longitude: req.body.longitude
        };
        if (req.body.display_name)
            update.display_name = req.body.display_name;
        const options = {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        };

        console.log(`Update information: ${JSON.stringify(update, null, 2)}`);
        try {
            await UserLocation.findOneAndUpdate(query, update, options);
            console.log('Updated location information successfully');
            res.status(200).json({ msg: 'Updated location information successfully' });
        } catch(e) {
            return res.status(400).json({
                msg: 'Unable to update user location',
                error: e
            });
        }
    }
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend/client", "build", "index.html"));
});

app.listen(PORT, function() {
  console.log("Server is running on Port: " + PORT);
});