import React, { useEffect, useState } from "react";
import ImageCard from "../ImageCard/ImageCard";
import Loading from "../Loading/Loading";
import { Row, Col } from "react-bootstrap";
import { Container, card } from "./index";
import UploadComponent from "./UploadComponent";
import ImageSearchInput from "./ImageSearchInput";
import { Base_Path } from "../../config/api";

const ImageSearch = (props) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const cache = {};

  const searchImages = async (searchTerm, keywords) => {
    setLoading(true);
    try {
      // Make API request to search images
      const response = await fetch(
        `${Base_Path}api/images/search?searchTerm=${searchTerm}`
      );
      const data = await response.json();
      setImages(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <UploadComponent />
        <ImageSearchInput onSearch={searchImages} />
      </div>
      {loading ? (
        <Loading />
      ) : (
        <Container>
          <Row>
            {images.map((element) => (
              <Col sm={12} md={6} lg={4} xl={3} style={card} key={element._id}>
                <ImageCard
                  title={element.title}
                  description={element.description}
                  alt=" image"
                  createdAt={element.createdAt}
                  imageUrl={
                    element.image === null ? element.filename : element.filename
                  }
                  keywords={element.keywords}
                />
              </Col>
            ))}
          </Row>
        </Container>
      )}
    </>
  );
};

export default ImageSearch;
