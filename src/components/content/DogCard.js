import React, { useContext, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';

import DogsMatchContext from '../contexts/DogsMatchContext';

const DogCard = (props) => {

    const [matchedDogs, setMatchedDogs] = useContext(DogsMatchContext);

    //const isMatched = matchedDogs.some((dog) => dog.id === props.id);
    const isMatched = matchedDogs.some((song) => song.id === props.id);

    const addtoMatch = () => {
        props.markMatch(props.id)
    }
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
