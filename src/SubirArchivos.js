import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyDT3RmRH7Cgp7Y4zCIH0ythSsmR2OJYHNQ',
  authDomain: 'gestion-practicas.firebaseapp.com',
  projectId: 'gestion-practicas',
  storageBucket: 'gestion-practicas.appspot.com',
  messagingSenderId: '556815124831',
  appId: '1:556815124831:web:59b82a0edf39c2eb9eceea',
  measurementId: 'G-SYXNF6CT55'
};
// Initialize Firebase
firebase.initializeApp(config);

class FileUpload extends Component {
  constructor() {
    super();
    this.state = {
      uploadValue: 0
    };
  }

  handleOnChange(e) {
    const file = e.target.files[0];
    const storageRef = firebase.storage().ref(`images/${file.name}`);
    const task = storageRef.put(file);

    task.on(
      'state_changed',
      (snapshot) => {
        let percentage =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.setState({
          uploadValue: percentage
        });
      },
      (error) => {
        console.error(error.message);
      },
      () => {
        // Upload complete
        this.setState({
          picture: task.snapshot.downloadURL
        });
      }
    );
  }

  render() {
    return (
      <div>
        <progress value={this.state.uploadValue} max='100'>
          {this.state.uploadValue} %
        </progress>
        <br />
        <input type='file' onChange={this.handleOnChange.bind(this)} />
        <br />
        <img width='90' src={this.state.picture} />
      </div>
    );
  }
}

ReactDOM.render(<FileUpload />, document.getElementById('root'));
