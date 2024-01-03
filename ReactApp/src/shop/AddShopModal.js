import React, { useState, useEffect } from "react";
import Modal from "react-modal";

const AddShopModal = ({ isOpen, onClose, onAddShop, selectedShop }) => {
    const customStyles = {
        content: {
            width: "50%", 
            height: "auto", 
            margin: "auto", 
        },
    };
    const [editedShop, setEditedShop] = useState({
        image: { preview: "", raw: null },
        name: "",
        _id: "",
    });
    const [nameError, setNameError] = useState("");

    useEffect(() => {
        if (selectedShop) {
            setEditedShop({
                image: { preview: selectedShop.image, raw: null }, 
                name: selectedShop.name,
                _id: selectedShop._id,
            });
        } else {
            setEditedShop({
                image: { preview: "", raw: null },
                name: "",
            });
        }
        setNameError("");
    }, [selectedShop]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedShop((prevShop) => ({
            ...prevShop,
            [name]: value,
        }));
        if (name === "name" && !value.trim()) {
            setNameError("Name cannot be blank");
        } else {
            setNameError("");
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files.length) {
            setEditedShop((prevShop) => ({
                ...prevShop,
                image: {
                    preview: URL.createObjectURL(e.target.files[0]),
                    raw: e.target.files[0],
                },
            }));
        }
    };

    const handleAddShop = () => {
        if (!editedShop.name.trim()) {
            setNameError("shop name cannot be blank");
            return;
        }
        const formData = new FormData();
        console.log("editedShop", editedShop)
        formData.append("name", editedShop.name);
        formData.append("shopId", editedShop._id);
        formData.append("image", editedShop.image.raw ? editedShop.image.raw : editedShop.image.preview);
        setEditedShop({
            image: { preview: "", raw: null },
            name: "",
        });
        onAddShop(formData, selectedShop ? true : false);
        onClose();
    };

    return (
        <Modal style={customStyles} isOpen={isOpen} onRequestClose={onClose} ariaHideApp={false} contentLabel="Add Shop Modal">
            <h2>{selectedShop ? "Edit Shop" : "Add New Shop"}</h2>
            <div>
                <label htmlFor="upload-button">
                    {editedShop.image.preview && (
                        <img
                            src={editedShop.image.raw ? editedShop.image.preview : process.env.REACT_APP_IMAGE_URL + editedShop.image.preview}
                            alt="Shop Preview"
                            style={{ maxWidth: "100%", maxHeight: "150px" }}
                        />
                    )}
                    <div className="button pointer">
                        <span className="fa-stack fa-2x mt-3 mb-2">
                            <i className="fas fa-circle fa-stack-2x" />
                            <i className="fas fa-store fa-stack-1x fa-inverse" />
                        </span>
                        <p className="text-center">Upload photo</p>
                    </div>
                </label>
                <input
                    type="file"
                    id="upload-button"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                />
            </div>
            <label htmlFor="name">Shop Name:</label>
            <input
                type="text"
                id="name"
                name="name"
                value={editedShop.name}
                onChange={handleChange}
            />
            {nameError && <p className="error-message">{nameError}</p>}
            <button onClick={handleAddShop} className="my-3 pointer">
                {selectedShop ? "Save Shop" : "Add Shop"}
            </button>
            <button onClick={onClose} className="my-3 pointer close mx-3">
                Close
            </button>
        </Modal>
    );
};

export default AddShopModal;
