import { ListGroup } from 'react-bootstrap'
import React from 'react'

class Practica extends React.Component {
    render(){
        return (
            <div>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipiscing elit dui, fringilla facilisis at montes suscipit rhoncus ultrices, cursus augue primis auctor cum tortor litora. Ligula scelerisque orci himenaeos blandit sagittis curabitur quam, mauris primis phasellus natoque dapibus tempus, ac potenti augue egestas torquent laoreet.
                </p>
                <ListGroup>
                    {this.props.practicas.map(data => (
                        <ListGroup.Item key={data.id} onClick={() => console.log(data.email)} action>
                            {data.username}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </div>
        );
    }
}

export default Practica;