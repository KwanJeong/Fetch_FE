import React, { useContext, useState } from 'react';
import { Container, Row } from "react-bootstrap";
import DogCard from './DogCard';
import DogsMatchContext from '../contexts/DogsMatchContext';

const DogsMatch = () => {

    // Retrieve the matched dogs array and a function to update it from the DogsMatchContext
    const [matchedDogs, setMatchedDogs] = useContext(DogsMatchContext);

    // Create a state variable 'dogs' initialized with the matched dogs array
    const [dogs] = useState(matchedDogs);

    // Function to mark a dog as a match
    const markMatch = (dogID) => {
         // Update the matched dogs array with the new match by finding the dog with the given ID
        setMatchedDogs([
            ...matchedDogs,
            dogs.find((dogs) => dogs.id === dogID),
        ]);
    };

    // Function to mark a dog as unmatched
    const markUnmatch = (dogID) => {
        setMatchedDogs((prevMatch) => prevMatch.filter((dog) => dog.id !== dogID));
    };

    return (
        <div>
            <h2>Your Matched Dogs</h2>
            <Container fluid>
                <Row xs={1} sm={2} md={3} lg={4} xl={6}>
                    {matchedDogs.map((dog) => (
                        <DogCard
                            key={dog.id}
                            id={dog.id}
                            img={dog.img}
                            name={dog.name}
                            age={dog.age}
                            zip_code={dog.zip_code}
                            breed={dog.breed}
                            city={dog.city}
                            state={dog.state}
                            markMatch={markMatch}
                            markUnmatch={markUnmatch}
                        />
                    ))}
                </Row>
            </Container>
        </div>
    )
}

export default DogsMatch;