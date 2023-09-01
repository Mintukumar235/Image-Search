import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Base_Path } from "../../config/api";

const UploadComponent = () => {
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleUpload = async () => {
    // Construct formData for the API request
    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("keywords", keywords);

    try {
      const response = await fetch(`${Base_Path}api/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Handle successful upload
      } else {
        // Handle upload error
      }
    } catch (error) {
      console.error("Error uploading:", error);
    }

    // Close the modal
    handleClose();
  };

  return (
    <div>
      <Button variant="primary" onClick={handleShow}>
        click Here for upload image
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="file" onChange={handleImageChange} />
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="text"
            placeholder="Keywords"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpload}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UploadComponent;
