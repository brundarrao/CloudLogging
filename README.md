### Backend

Starting MongoDB on Mac:

    $ sudo rm /tmp/mongodb-27017.sock
    Password:
    $ mongod --dbpath /usr/local/var/mongodb

Open a new terminal:

    $ mongo

Create Collection : "cloud-logging"

    > use cloud-logging
    switched to db cloud-logging

If you are changing the name of the collection from "cloud-logging" to something else, ensure that you make the same changes in index.js in backend

