import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useParams } from "react-router-dom";
const AddProductModal = ({ isOpen, onClose, onAddProduct, selectedProduct, resetForm }) => {
    const customStyles = {
        content: {
            width: "50%",
            height: "auto", 
            margin: "auto", 
        },
    };
    const { shopId } = useParams();
    const [editedProduct, setEditedProduct] = useState({
        name: "",
        image: { preview: "", raw: null },
        quantity: 0,
        productId: "",
    });
    const [nameError, setNameError] = useState("");

    useEffect(() => {
        console.log("first")
        if (selectedProduct || resetForm) {
            setEditedProduct({
                name: selectedProduct.name,
                image: { preview: selectedProduct.image, raw: null }, 
                quantity: selectedProduct.quantity,
                productId: selectedProduct._id,
            });
            setNameError("");
        } else {
            setEditedProduct({
                name: "",
                image: { preview: "", raw: null },
                quantity: 0,
                productId: "",
            });
            setNameError("");
        }

        return () => {
            setEditedProduct({
                name: "",
                image: { preview: "", raw: null },
                quantity: 0,
                productId: "",
            });
            setNameError("");
        }
    }, [selectedProduct, resetForm]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedProduct((prevProduct) => ({
            ...prevProduct,
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
            setEditedProduct((prevProduct) => ({
                ...prevProduct,
                image: {
                    preview: URL.createObjectURL(e.target.files[0]),
                    raw: e.target.files[0],
                },
            }));
        }
    };

    const handleAddProduct = () => {
        if (!editedProduct.name.trim()) {
            setNameError("Product name cannot be blank");
            return;
        }


        setNameError("");
        const formData = new FormData();
        console.log(editedProduct)
        formData.append("name", editedProduct.name);
        formData.append("productId", editedProduct.productId);
        formData.append("shopId", shopId);
        formData.append("image", editedProduct.image.raw ? editedProduct.image.raw : editedProduct.image.preview);
        formData.append("quantity", editedProduct.quantity);

        onAddProduct(formData, editedProduct.productId ? true : false);
        onClose();

    };

    return (
        <Modal style={customStyles} isOpen={isOpen} onRequestClose={onClose} ariaHideApp={false} contentLabel="Add Product Modal">
            <h2>{selectedProduct ? "Edit Product" : "Add New Product"}</h2>
            <div>
                <label htmlFor="upload-button">
                    {editedProduct?.image?.preview && (
                        <img
                            src={editedProduct.image.raw ? editedProduct.image.preview : process.env.REACT_APP_IMAGE_URL + editedProduct.image.preview}
                            alt="Product Preview"
                            style={{ maxWidth: "100%", maxHeight: "150px" }}
                        />
                    )}
                    <div className="button">
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
            <label htmlFor="name">Product Name:</label>
            <input
                type="text"
                id="name"
                name="name"
                value={editedProduct.name}
                onChange={handleChange}
            />
            {nameError && <p className="error-message">{nameError}</p>}
            <label htmlFor="quantity">Quantity:</label>
            <input
                type="number"
                id="quantity"
                name="quantity"
                value={editedProduct.quantity}
                onChange={handleChange}
            />
            <button onClick={handleAddProduct} className="my-3 pointer">
                {selectedProduct ? "Save Product" : "Add Product"}
            </button>
            <button onClick={onClose} className="close my-3 mx-3 pointer">
                Close
            </button>
        </Modal>
    );
};

export default AddProductModal;
