import React from 'react'
import reactDom from 'react-dom'
import firebase from 'firebase'


const config = {
 
  };
  // Initialize Firebase
  firebase.initializeApp(config);


class SubirArchivo extends React.Component{
    constructor(){
        super()
        this.state ={
            uploadValue: 0
        }
    }
handleOnChange(event){
    const file = event.target.files(6)
    const storageRef = firebase.storage().ref('picture/${file.name}')
    const task = storageRef.put(file)
    task.on("state_changet", (snapshot)=>{
        let percentage = (snapshot.bytesTransferred / snapshot.totalBytes)*100
        this.setState({
            uploadValue: percentage
        })
    },(error) => {
        this.setState({
            message:'Ha ocurrido un error: ${errore.message}'

        },()=>{
            this.setState({
                message:'Archivo subido',
                picture:task.snaoshot.dowloadURL
            })
        })
    })
  }

    render(){
        return(
            <div>
                <progress value={this.state.uploadValue} max='300'></progress>
                <br/>
                <input type="file" onChange={this.handleOnChange.bind(this)}/>
                <br/>
                {this.state.message}
                <br/>
                <img width='100' src={this.state.picture}/>
            </div>
        )
    }

    
}
reactDom.render(<SubirArchivo/>,document.getElementById('root'))