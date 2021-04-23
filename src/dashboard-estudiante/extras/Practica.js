import React from 'react'
import './list.css'

class Practica extends React.Component {
    render(){
        return (
            <div>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipiscing elit dui, fringilla facilisis at montes suscipit rhoncus ultrices, cursus augue primis auctor cum tortor litora. Ligula scelerisque orci himenaeos blandit sagittis curabitur quam, mauris primis phasellus natoque dapibus tempus, ac potenti augue egestas torquent laoreet.
                </p>
                <ul className="list-group">
                    {this.props.practicas.map(data => (
                        <li 
                            className={`list-group-item ${data.name.length > 15 ? "disabled" : ""}`} 
                            key={data.id} 
                            onClick={() => data.name.length > 15 ? alert("Sorry, not available at the moment...") : alert(data.species)} 
                            action
                        >
                            <p>{data.name}</p>
                            <p>{data.name.length > 15 ? "No disponible" : "Disponible"}</p>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default Practica;