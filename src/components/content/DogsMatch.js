import React, { useContext, useState } from 'react';
import { Container, Row } from "react-bootstrap";
import DogCard from './DogCard';
import DogsMatchContext from '../contexts/DogsMatchContext';

const DogsMatch = () => {

    const [matchedDogs, setMatchedDogs] = useContext(DogsMatchContext);

    const [dogs] = useState(matchedDogs);


    const markMatch = (dogID) => {
        setMatchedDogs([
            ...matchedDogs,
            dogs.find((dogs) => dogs.id === dogID),
        ]);
    };

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