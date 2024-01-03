import React, { useState, useEffect } from "react";
import '../css/ShopList.css';
import { Link } from "react-router-dom";
import AddShopModal from "./AddShopModal";
import axios from "axios";
import { FaEdit, FaSignOutAlt } from "react-icons/fa";
import "../css/ShopList.css";
import { useNavigate } from "react-router-dom";
const ShopCardList = () => {
    let token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [shops, setShops] = useState([]);
    const [isAddShopModalOpen, setAddShopModalOpen] = useState(false);
    const [selectedShop, setSelectedShop] = useState(null);

    useEffect(() => {
        fetchShops();
    }, []);

    const fetchShops = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/shop/list", { headers: { "Authorization": token } });
            const data = await response.json();
            if (data?.shops) {

                setShops(data.shops);
            } else {
                localStorage.clear()
                navigate('/')
            }
        } catch (error) {
            console.error("Error fetching shops:", error);
        }
    };

    const handleAddShop = async (newShop, edit) => {
        try {
            if (edit == true) {
                const response = await axios.put("http://localhost:5000/api/shop/update", newShop, { headers: { "Authorization": token } });
                console.log(response);
                if (response.status === 200) {
                    fetchShops();
                } else {
                    console.error("Failed to add a new shop");
                }
            } else {

                const response = await axios.post("http://localhost:5000/api/shop/create", newShop, { headers: { "Authorization": token } });
                if (response.status === 200) {
                    fetchShops();
                } else {
                    console.error("Failed to add a new shop");
                }
            }
        } catch (error) {
            console.error("Error adding a new shop:", error);
        }
    };

    const handleVisitShop = (shop) => {
        setSelectedShop(shop);
        navigate(`/shops/${shop._id}`, { state: { shop } });
    };
    const handleEditShop = (shop) => {
        setAddShopModalOpen(true)
        setSelectedShop(shop);
    };


    return (
        <div className="">
            <div className="flex-between mx-3">

                <h2>Shop List</h2>
                <div className="my-3 mx-3 flex-between">
                    <Link onClick={() => setAddShopModalOpen(true)} >
                        <button className="pointer">Create Shop</button>
                    </Link>

                    <button className="close pointer" onClick={() => { localStorage.clear(); navigate('/') }}>Logout <FaSignOutAlt className="logout-icon pointer mx-3" /></button>
                </div>
            </div>
            <div className="d-flex">
                {shops.length > 0 ? shops.map((shop, index) => (
                    <div key={index} className="w-100">
                        <div className="card h-100 p-2">
                            <span className="edit-icon pointer" onClick={() => handleEditShop(shop)}><FaEdit size={20} /></span>
                            <img src={process.env.REACT_APP_IMAGE_URL + shop.image} className="card-img-top" alt={`Shop - ${shop.id}`} />
                            <div className="card-body">
                                <h5 className="card-title">{shop.name.length > 10 ? `${shop.name.slice(0, 10)}...` : shop.name}</h5>

                                <button onClick={() => handleVisitShop(shop)} className="pointer fs-10">Visit Shop</button>
                            </div>
                        </div>
                    </div>
                )) : 'No Shops Found'}
            </div>
            <AddShopModal
                isOpen={isAddShopModalOpen}
                onClose={() => {
                    setAddShopModalOpen(false);
                    setSelectedShop(null);
                }}
                onAddShop={handleAddShop}
                selectedShop={selectedShop}
            />
        </div>
    );
};

export default ShopCardList;
