import React from "react";
import PropTypes from "prop-types";
import { Button, Card } from "react-bootstrap";
import { Base_Path } from "../../config/api";
import { card, img, btn, text } from "./index";

function ImageCard(props) {
  const { imageUrl, alt, description, title, keywords } = props;
  const serverImageUrl = `${Base_Path}uploads/`; // Change this URL as needed
  return (
    <Card style={card}>
      <Card.Img
        style={img}
        variant="top"
        src={`${serverImageUrl}${imageUrl}`}
        alt={alt}
      />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text style={text}>{description}</Card.Text>
        {keywords.map((tag, index) => (
          <React.Fragment key={index}>
            <button className="tag-button">{tag}</button>
            {index < keywords.length - 1 && (
              <span className="tag-space"> </span>
            )}
          </React.Fragment>
        ))}
      </Card.Body>
    </Card>
  );
}

ImageCard.propTypes = {
  imageUrl: PropTypes.string,
  alt: PropTypes.string,
  description: PropTypes.string,
  title: PropTypes.string,
  channel: PropTypes.string,
  createdAt: PropTypes.string,
};

export default ImageCard;
