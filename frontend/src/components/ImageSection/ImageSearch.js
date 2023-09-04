import React, { useEffect, useState, useCallback } from "react";
import ImageCard from "../ImageCard/ImageCard";
import Loading from "../Loading/Loading";
import { Row, Col, Container } from "react-bootstrap";
import UploadComponent from "./UploadComponent";
import ImageSearchInput from "./ImageSearchInput";
import { Base_Path } from "../../config/api";
import Modal from "react-modal";
import ColorPaletteFilter from "./ColorPaletteFilter";

const sortingOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "az", label: "A-Z(Title)" },
  { value: "za", label: "Z-A(Title)" },
];

const isNameValid = (name) => /^[a-zA-Z]{4,}$/.test(name);

const ImageSearch = () => {
  const [state, setState] = useState({
    images: [],
    totalPages: 0,
    loading: false,
    sortingOption: "newest",
    currentPage: 1,
    showWelcomeModal: false,
    userName: "",
    token: localStorage.getItem("userToken") || "",
    nameInput: "",
    backgroundColor: "",
    selectedColor: "",
    searchKey: "",
  });

  const searchImages = useCallback(
    async (searchTerm, keywords) => {
      debugger;
      !searchTerm && (searchTerm = state.searchKey);
      setState((prevState) => ({ ...prevState, loading: true }));
      try {
        const response = await fetch(
          `${Base_Path}api/images/search?searchTerm=${searchTerm}&sortBy=${state.sortingOption}&page=${state.currentPage}`
        );
        const data = await response.json();
        setState((prevState) => ({
          ...prevState,
          searchKey: searchTerm,
          images: data.images,
          totalPages: data.totalPages,
          loading: false,
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
        setState((prevState) => ({
          ...prevState,
          loading: false,
          searchKey: searchTerm,
        }));
      }
    },
    [state.sortingOption, state.currentPage, state.searchKey]
  );

  const handleSortingChange = (e) => {
    setState((prevState) => ({
      ...prevState,
      sortingOption: e.target.value,
      currentPage: 1,
    }));
    searchImages("", "");
  };

  const closeWelcomeModal = () => {
    setState((prevState) => ({ ...prevState, showWelcomeModal: false }));
  };

  const handleContinueClick = () => {
    if (isNameValid(state.nameInput)) {
      const tokenPayload = {
        name: state.nameInput,
        exp: Math.floor(Date.now() / 1000) + 60,
      };
      localStorage.setItem("userToken", btoa(JSON.stringify(tokenPayload)));
      setState((prevState) => ({ ...prevState, showWelcomeModal: false }));
    } else {
      alert(
        "Please enter a valid name (min 4 characters, no spaces, no numbers or special characters)."
      );
    }
  };

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      token: localStorage.getItem("userToken") || "",
    }));
  }, []);

  useEffect(() => {
    searchImages(state.searchKey, "");
  }, [state.sortingOption, state.currentPage]);

  useEffect(() => {
    if (!state.token) {
      setState((prevState) => ({ ...prevState, showWelcomeModal: true }));
    } else {
      try {
        const decodedToken = JSON.parse(atob(state.token));
        if (decodedToken.exp > Date.now() / 1000) {
          setState((prevState) => ({
            ...prevState,
            userName: decodedToken.name,
          }));
        } else {
          localStorage.removeItem("userToken");
          setState((prevState) => ({ ...prevState, showWelcomeModal: true }));
        }
      } catch (error) {
        localStorage.removeItem("userToken");
        setState((prevState) => ({ ...prevState, showWelcomeModal: true }));
      }
    }
  }, [state.nameInput, state.userName, state.token]);

  return (
    <div style={{ background: state.selectedColor }}>
      <Modal
        isOpen={state.showWelcomeModal}
        onRequestClose={closeWelcomeModal}
        contentLabel="Welcome "
      >
        <h2>Welcome, {state.nameInput || "Guest"}!</h2>
        {state.userName ? (
          <p>Would you like to continue using the application?</p>
        ) : (
          <>
            <p>Please enter your name:</p>
            <input
              type="text"
              value={state.nameInput}
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  nameInput: e.target.value,
                }))
              }
              required
            />
          </>
        )}
        <button onClick={handleContinueClick}>Continue</button>
      </Modal>

      <div className="image-search-container">
        <ColorPaletteFilter
          color={state.selectedColor}
          setColor={(color) =>
            setState((prevState) => ({ ...prevState, selectedColor: color }))
          }
        />
        <div>
          <UploadComponent />{" "}
          <h2 className="upload-header">
            Welcome, {state.userName || state.nameInput || "Guest"}!
          </h2>
          <ImageSearchInput onSearch={searchImages} />
          <select value={state.sortingOption} onChange={handleSortingChange}>
            {sortingOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {state.loading ? (
          <Loading />
        ) : (
          <Container>
            <Row>
              {state.images.map((element) => (
                <Col sm={12} md={6} lg={4} xl={3} key={element._id}>
                  <ImageCard
                    title={element.title}
                    description={element.description}
                    alt="image"
                    createdAt={element.createdAt}
                    imageUrl={
                      element.image === null
                        ? element.filename
                        : element.filename
                    }
                    keywords={element.keywords}
                  />
                </Col>
              ))}
            </Row>

            <div className="pagination">
              <button
                onClick={() =>
                  setState((prevState) => ({
                    ...prevState,
                    currentPage: state.currentPage - 1,
                  }))
                }
                disabled={state.currentPage === 1}
              >
                Previous
              </button>
              <span className="currentPage-number">
                Page {state.currentPage}
              </span>
              <button
                onClick={() =>
                  setState((prevState) => ({
                    ...prevState,
                    currentPage: state.currentPage + 1,
                  }))
                }
                disabled={state.totalPages <= state.currentPage}
              >
                Next
              </button>
            </div>
          </Container>
        )}
      </div>
    </div>
  );
};

export default ImageSearch;
