import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import Select, { components } from 'react-select';
import { FormCheck } from 'react-bootstrap';
import { Button, Container, Form, Row, Col } from "react-bootstrap";

import AuthContext from '../contexts/AuthContext';
import DogCard from './DogCard';
import Pagination from './Pagination';
import DogsMatchContext from '../contexts/DogsMatchContext';

const Option = (props) => {
    return (
        <div>
            <components.Option {...props}>
                <FormCheck
                    type="checkbox"
                    checked={props.isSelected}
                    onChange={() => null}
                    label={props.label}
                />
            </components.Option>
        </div>
    );
};

const DogList = () => {

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useContext(AuthContext);
    const [dogs, setDogs] = useState([]);
    const [matchedDogs, setMatchedDogs] = useContext(DogsMatchContext);
    const [breeds, setBreeds] = useState([]);
    const [breedFilter, setBreedFilter] = useState([]);
    const [zipCodeFilter, setZipCodeFilter] = useState('');
    const [ageMinFilter, setAgeMinFilter] = useState('');
    const [ageMaxFilter, setAgeMaxFilter] = useState('');
    const [sortby, setSortby] = useState('breed');
    const [sort, setSort] = useState('asc');
    const [size, setSize] = useState(25);
    const [totalResults, setTotalResults] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalNumberPages, setTotalNumberPages] = useState(0);


    const fetchDogData = async (relativeUrl) => {
        try {
            const baseUrl = "https://frontend-take-home-service.fetch.com";
            const fullUrl = baseUrl + relativeUrl;
            console.log(`Fetching data from: ${fullUrl}`);
            const searchResult = await fetch(fullUrl, { credentials: 'include' });
            if (!searchResult.ok) {
                console.log(searchResult.status);
                if (searchResult.status === 401) {
                    setIsLoggedIn(false);
                    alert("Please Login");
                    navigate("/login");
                    return;
                }
            }
            const searchData = await searchResult.json();
            setTotalResults(searchData.total);
            const dogIds = searchData.resultIds;
            const numPages = Math.ceil(searchData.total / size);
            setTotalNumberPages(numPages);

            const fetchLocationData = async (zipCode) => {
                const locationDataResult = await fetch('https://frontend-take-home-service.fetch.com/locations', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify([zipCode]),
                    credentials: 'include',
                });
                const locationData = await locationDataResult.json();
                return locationData[0] || {};
            };

            const dogDataResult = await fetch('https://frontend-take-home-service.fetch.com/dogs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dogIds),
                credentials: 'include',
            });
            const dogData = await dogDataResult.json();
            const dogsWithLocation = await Promise.all(
                dogData.map(async (dog) => {
                    const location = await fetchLocationData(dog.zip_code);
                    return { ...dog, city: location.city, state: location.state };
                })
            );
            setDogs(dogsWithLocation);
        } catch (err) {
            console.error(err);
        }
    };


    useEffect(() => {
        setIsLoading(false);
    }, [dogs]);


    useEffect(() => {
        const fetchBreeds = async () => {
            try {
                const breedResult = await fetch('https://frontend-take-home-service.fetch.com/dogs/breeds', { credentials: 'include' });
                const breedData = await breedResult.json();
                const formattedBreeds = breedData.map(breed => ({ label: breed, value: breed })); // map to required format
                setBreeds(formattedBreeds); // should set formattedBreeds
            } catch (err) {
                console.error(err);
            }
        };
        fetchBreeds();
        fetchDogData(`/dogs/search?sort=breed:${sort}`);
        console.log(matchedDogs);
    }, []);

    const markMatch = (dogID) => {
        setMatchedDogs([
            ...matchedDogs,
            dogs.find((dogs) => dogs.id === dogID),
        ]);
    };

    const markUnmatch = (dogID) => {
        setMatchedDogs((prevMatch) => prevMatch.filter((dog) => dog.id !== dogID));
    };

    const constructUrl = (from) => {
        let url = `/dogs/search?`;

        if (breedFilter.length > 0) {
            breedFilter.forEach(breed => {
                url += `&breeds=${breed.value}`;
            });
        }

        const zipCodes = zipCodeFilter.split(',').map(code => code.trim());
        zipCodes.forEach(code => {
            if (code) {  // to skip empty strings if they exist
                url += `&zipCodes=${code}`;
            }
        })

        if (ageMinFilter) url += `&ageMin=${ageMinFilter}`;
        if (ageMaxFilter) url += `&ageMax=${ageMaxFilter}`;
        if (size) url += `&size=${size}`;
        url += `&sort=${sortby}:`;
        url += `${sort}`;
        if (from) url += `&from=${from}`;

        return url;
    }

    const handleSearch = () => {
        setIsLoading(true);
        const url = constructUrl();
        setPageNumber(1);
        fetchDogData(url);
    };

    const handlePageNavigation = (pageNumber) => {
        const from = (pageNumber - 1) * size;
        const url = constructUrl(from);
        fetchDogData(url);
        setPageNumber(pageNumber);
    };

    const resetSearch = () => {
        setZipCodeFilter([]);
        setBreedFilter("")
        setZipCodeFilter("");
        setAgeMinFilter("");
        setAgeMaxFilter("");
        setSize("");
        setSort("asc");
        setSortby("breed");
        setPageNumber(1);
        fetchDogData(`/dogs/search?sort=breed:asc`);
    }




    return (
        <div>
            <Form>

                <Form.Label htmlFor="searchBreed">Breeds</Form.Label>
                <Select
                    inputId='searchBreed'
                    isMulti
                    options={breeds}
                    value={breedFilter}
                    components={{ Option }}
                    onChange={setBreedFilter}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                />


                <Form.Label htmlFor="searchZipCode">Zip Code</Form.Label>
                <Form.Control
                    id="searchZipCode"
                    type="text"
                    placeholder="Enter zip codes (separate multiple zip codes with commas)"
                    value={zipCodeFilter}
                    onChange={(e) => setZipCodeFilter(e.target.value)}
                />


                <Row>
                    <Col>
                        <Form.Group>
                            <Form.Label htmlFor='searchAgeMin'>Minimum Age</Form.Label>
                            <Form.Control
                                id='searchAgeMin'
                                type="number"
                                placeholder="Minimum age"
                                value={ageMinFilter}
                                onChange={(e) => setAgeMinFilter(e.target.value)}
                            />
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group>
                            <Form.Label htmlFor='searchAgeMax'>Maximum Age</Form.Label>
                            <Form.Control
                                id='searchAgeMax'
                                type="number"
                                placeholder="Maximum age"
                                value={ageMaxFilter}
                                onChange={(e) => setAgeMaxFilter(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Form.Group>
                            <Form.Label htmlFor='sortby'>Sort By</Form.Label>
                            <Form.Control
                                id="sortby"
                                as="select"
                                value={sortby}
                                onChange={(e) => setSortby(e.target.value)}
                            >
                                <option value="breed">Breed</option>
                                <option value="age">Age</option>
                            </Form.Control>

                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group>
                            <Form.Label htmlFor='sortOrder'>Order</Form.Label>
                            <Form.Control
                                id="sortOrder"
                                as="select"
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                            >
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group>
                            <Form.Label htmlFor='size'>Size</Form.Label>
                            <Form.Control
                                id="size"
                                as="select"
                                value={size}
                                onChange={(e) => setSize(e.target.value)}
                            >
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>

                <br />

                <Button variant="primary" onClick={handleSearch} disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Search'}
                </Button>
                <Button variant="neutral" onClick={resetSearch} disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Reset Search'}
                </Button>
            </Form>

            <h4>Total Results: {totalResults}</h4> {/* Display the total number of results */}

            <Container fluid>
                <Row xs={1} sm={2} md={3} lg={4} xl={6}>
                    {dogs.map((dog) => (
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

            <Pagination
                totalPages={totalNumberPages}
                currentPage={pageNumber}
                navigateToPage={handlePageNavigation}
            />
        </div>
    );
};

export default DogList;
