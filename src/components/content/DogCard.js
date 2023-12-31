import React, { useContext } from 'react';
import { Card, Button } from 'react-bootstrap';

import DogsMatchContext from '../contexts/DogsMatchContext';

const DogCard = (props) => {

    // Get the matched dogs from the context
    const [matchedDogs] = useContext(DogsMatchContext);

    // Check if the current dog is already matched
    const isMatched = matchedDogs.some((song) => song.id === props.id);

    // Function to add the dog to the match
    const addtoMatch = () => {
        props.markMatch(props.id)
    }

    // Function to remove the dog from the match
    const removeFromMatch = () => {
        props.markUnmatch(props.id)
    }

    return (
        <Card>
            <Card.Img
                variant="top"
                src={props.img}
                alt={`${props.name} image`}
                style={{ width: '200px', height: '200px', objectFit: 'cover' }}
            />
            <Card.Body>
                <Card.Title>{props.name}</Card.Title>
                <Card.Text>
                    Age: {props.age} <br />
                    Breed: {props.breed} <br />
                    zipCode: {props.zip_code} <br />
                    City: {props.city} <br />
                    State: {props.state}
                </Card.Text>
                {isMatched ? (
                    <Button variant="danger" onClick={removeFromMatch}>
                        Remove from Match
                    </Button>
                ) : (
                    <Button variant="primary" onClick={addtoMatch}>
                        Add to Match
                    </Button>
                )}
            </Card.Body>
        </Card>
    )
}

export default DogCard;
