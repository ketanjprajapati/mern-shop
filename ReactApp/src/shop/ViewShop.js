import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../css/ShopList.css';
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import axios from "axios";
import AddProductModal from "./AddProductModal";
function ViewShop() {
    const location = useLocation();
    const navigate = useNavigate();
    const [shop, setShop] = useState(location.state?.shop || [])
    const [resetForm, setResetForm] = useState(false);
    const [isAddProductModalOpen, setAddProductModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    let token = localStorage.getItem('token');


    const handleAddProduct = async (newProduct, edit) => {
        try {
            if (edit == true) {
                const response = await axios.put("http://localhost:5000/api/product/update", newProduct, { headers: { "Authorization": token } });
                if (response.status === 200) {
                    setAddProductModalOpen(false);
                    setShop({ ...shop, products: response.data.products })
                } else {
                    console.error("Failed to add a new shop");
                }
            } else {

                const response = await axios.post("http://localhost:5000/api/product/add", newProduct, { headers: { "Authorization": token } });
                if (response.status === 200) {
                    setAddProductModalOpen(false);
                    setShop({ ...shop, products: response.data.products })
                } else {
                    console.error("Failed to add a new shop");
                }
            }
        } catch (error) {
            console.error("Error adding a new shop:", error);
        }
    };
    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        setAddProductModalOpen(true);
    };
    return (
        <div className="view-shop-container">
            <div className='flex my-3'>
                <FaArrowLeft className="pointer " onClick={() => navigate(-1)} />
                <div className='flex-name-image'>

                    <img width={50} src={process.env.REACT_APP_IMAGE_URL + shop.image} alt={shop.image} /> <p className='name'>{shop.name}</p>
                    <span>(Product list)</span>
                </div>
                <div className="">
                    <Link onClick={() => setAddProductModalOpen(true)} >
                        <button className="pointer">Add product</button>
                    </Link>
                </div>
            </div>

            <div className="d-flex">
                {shop.products && shop.products.length > 0 ? shop.products.map((product, index) => (
                    <div key={index} className="w-100">
                        <div className="card h-100 p-2">
                            <span className="edit-icon pointer" onClick={() => handleEditProduct(product)}><FaEdit size={20} /></span>
                            <img src={process.env.REACT_APP_IMAGE_URL + product.image} className="card-img-top" alt={`product - ${product.id}`} />
                            <div className="card-body">
                                <h5 className="card-title fs-14">Product: {product.name}</h5>
                                <h5 className="card-title fs-14">qty: {product.quantity}</h5>
                            </div>
                        </div>
                    </div>
                )) : 'No Products Found'}
            </div>
            <AddProductModal
                isOpen={isAddProductModalOpen}
                onClose={() => {
                    setResetForm(true); setAddProductModalOpen(false); setSelectedProduct({
                        name: "",
                        image: null,
                        quantity: 0,
                        productId: "",
                    })
                }}
                onAddProduct={handleAddProduct}
                selectedProduct={selectedProduct}
                resetForm={resetForm}
            />
        </div>
    );
}

export default ViewShop;
