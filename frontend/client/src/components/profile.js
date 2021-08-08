import React, {Component} from 'react'
import { withRouter } from 'react-router';
import '../App.css';
import Button from '@material-ui/core/Button';
import {auth} from "../firebase";
// import Logs from './Logs';


class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logs: []
        };
        this.addLog = this.addLog.bind(this);
        this.showLogs = this.showLogs.bind(this);
        const { displayName, email } = this.props.user;

        const success = (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            const data = {
                email,
                display_name: displayName,
                latitude: lat,
                longitude: lng
            };

            fetch('https://cloudlogging.herokuapp.com/location', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            console.log("Your current position is:");
            console.log(`Latitude : ${lat}`);
            console.log(`Longitude: ${lng}`);
            console.log(`More or less ${pos.coords.accuracy} meters.`);
        }

        const errors = (err) => {
            console.warn(`ERROR(${err.code}): ${err.message}`);
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        };

        const getGeoInformation = () => {
            if (navigator.geolocation) {
                navigator.permissions
                    .query({ name: "geolocation" })
                    .then(function (result) {
                        if (result.state === "granted") {
                            console.log(result.state);
                            //If granted then you can directly call your function here
                            navigator.geolocation.getCurrentPosition(success);
                        } else if (result.state === "prompt") {
                            navigator.geolocation.getCurrentPosition(success, errors, options);
                        } else if (result.state === "denied") {
                            //If denied then you have to show instructions to enable location
                        }
                        result.onchange = function () {
                            console.log(result.state);
                        };
                    });
            } else {
                console.log("Sorry, Geolocation information Not available!");
            }
        }
        getGeoInformation();
    }

    addLog() {
        const { displayName } = this.props.user;
        let data = {
            name: displayName
        };


        fetch('https://cloudlogging.herokuapp.com/', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }

    showLogs() {
        const { displayName } = this.props.user;
        this.props.history.push(`/logs?user=${displayName}`)
    }

    render() {
        return (
            <div className="cloudimg">
                <h1 className="welcome">Secure Logging Scheme for Cloud Computing</h1>
                <h1 className="p1">
                    This Application shows the working of Logs to track user activity. There are two kinds of Logs generated i.e, Admin logs and
                    User logs. The Admin logs can only be accessed by the Admin and can view all the records at once. The User logs can view only
                    be viewed by their respective Users.
                </h1>
                <div className="button1">
                    <Button variant="contained" color="primary" onClick = {this.addLog}>
                        Button X
                    </Button>
                </div>
                <div className="button2">
                    <Button variant="contained" color="primary" onClick = {this.showLogs}>
                        Log History
                    </Button>
                </div>

                {this.state.logs.length === 0 ? '' : (
                    <ul>
                        {this.state.logs.map(log => (
                            <li>
                                {JSON.stringify(log, null, 2)}
                            </li>
                        ))}
                    </ul>
                )}
                <button className = "w-full py-3 bg-red-600 mt-4 text-white" onClick = {() => {auth.signOut()}}>Sign out</button>
            </div>
        );
    }
}

export default withRouter(Profile);