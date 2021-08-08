import React, { Component } from "react";
import Button from '@material-ui/core/Button';
import qs from 'qs';
import '../App.css';
import {Table} from 'react-bootstrap';

class Logs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayName: '',
            logs: [{description:null,name:null,timestamp:null}
              ]
        };
        this.goBack = this.goBack.bind(this);
    }

    goBack() {
        this.props.history.push('/');
    }

    componentDidMount() {
        fetch('https://cloudlogging.herokuapp.com/logs')
            .then(function(response) {
                return response.json();
            })
            .then(function(logs) {
                logs = logs.map(log => {
                    const timeStamp = new Date(log.timestamp);
                    log.timestamp = `${timeStamp.toLocaleDateString('en-UK')} ${timeStamp.toLocaleTimeString('en-UK', {hour12: true})}`;
                    return log;
                });
                console.log(`Search params: ${this.props.location.search}`);
                let parsed;
                if (this.props.location.search.length > 1) {
                    parsed = qs.parse(this.props.location.search.substr(1));
                    console.log(`Parsed: ${JSON.stringify(parsed, null, 2)}`);
                    this.setState({ displayName: parsed.user });
                }
                this.setState({ logs });
            }.bind(this))
            .catch(e => console.log(`Error: ${JSON.stringify(e, null, 2)}`));

    }

    render() {
        return (
            <div className="logtable">
                <h1 className="w-full py-5 bg-blue-600 mt-4 text-white lthead">Log Table</h1>
                {/* {this.state.logs.length === 0 ? '' : (
                    <ul>
                        {(this.state.displayName === 'Cloud Logging') ? this.state.logs.map(log => (
                            <li key={log.timestamp}>
                                {JSON.stringify(log, null, 2)}
                            </li>
                        )) : this.state.logs.filter(log => (log.name === this.state.displayName)).map(log => (
                            <li key={log.timestamp}>
                                {JSON.stringify(log, null, 2)}
                            </li>
                        ))}
                    </ul>
                )}     */}


        <div className="container-fluid">
        <Table striped bordered hover variant="dark" className="table1">
         <thead>
           <tr>
            <th>Description</th>
            <th>Name</th>
            <th>Timestamp</th>
           </tr>
         </thead>
         <tbody>
         {(this.state.displayName === 'Cloud Logging')? this.state.logs.map(function(item, key){
             return(
               <tr key={key}>
                  <td>{item.description}</td>
                  <td>{item.name}</td>
                  <td>{item.timestamp}</td>
               </tr>
             )
         }
         ):
         this.state.logs.filter(log => (log.name === this.state.displayName)).map(function(item, key){
             return(
               <tr key={key}>
                  <td>{item.description}</td>
                  <td>{item.name}</td>
                  <td>{item.timestamp}</td>
               </tr>
             )
         })}
         </tbody>
       </Table>
       </div>

                <Button variant="contained" color="primary" onClick = {this.goBack}>Back</Button>
            </div>
        )
    }
}

export default Logs;