

import React from "react";
import Button from "react-bootstrap/Button";

const Pagination = ({ totalPages, currentPage, navigateToPage }) => {

    // Generate an array of page numbers from 1 to totalPages
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    // Determine the range of visible page numbers
    const pagesToShow = 10;
    let startPage = currentPage - Math.floor(pagesToShow / 2);
    startPage = Math.max(startPage, 1);
    let endPage = startPage + pagesToShow - 1;
    endPage = Math.min(endPage, totalPages);
    // recalculate startPage in case endPage is at the limit
    startPage = Math.max(endPage - pagesToShow + 1, 1);

    // Get the subset of page numbers to display
    const visiblePageNumbers = pageNumbers.slice(startPage - 1, endPage);

    return (
        <div className="d-flex justify-content-center">
            <Button
                onClick={() => navigateToPage(currentPage - 1)}
                className="mr-1"
                disabled={currentPage === 1}
            >
                {"<"}
            </Button>
            <div className="d-flex">
                {visiblePageNumbers.map((number) => (
                    <Button
                        key={number}
                        onClick={() => navigateToPage(number)}
                        variant={number === currentPage ? "light" : "secondary"}
                        className="mr-1"
                        style={{
                            color: number === currentPage ? "white" : "inherit",
                            backgroundColor: number === currentPage ? "gray" : "inherit",
                            width: "2rem", // Set a fixed width for the buttons
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        {number}
                    </Button>
                ))}
            </div>
            <Button
                onClick={() => navigateToPage(currentPage + 1)}
                className="mr-1"
                disabled={currentPage === totalPages}
            >
                {">"}
            </Button>
        </div>
    );
};

export default Pagination;

