import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from "react-router-dom";
import Layout from "./../../components/Layout"
import axiosInstance from './../../axiosInstance';
function ProductShow() {
    const navigate = useNavigate();
    const [id, setId] = useState(useParams().id)
    const [product, setProduct] = useState({ name: '', description: '' })

    useEffect(() => {
        if (localStorage.getItem('token') == null) {
            navigate("/");
        }

        axiosInstance.get(`/products/${id}`)
            .then(function (response) {
                setProduct(response.data)
            })
            .catch(function (error) {
                console.log(error);
            })
    }, [])

    return (
        <Layout>
            <div className="container">
                <h2 className="text-center mt-5 mb-3">Show Product</h2>
                <div className="card">
                    <div className="card-header">
                        <Link
                            className="btn btn-outline-info float-right"
                            to="/dashboard"> View All Products
                        </Link>
                    </div>
                    <div className="card-body">
                        <b className="text-muted">Name:</b>
                        <p>{product.name}</p>
                        <b className="text-muted">Description:</b>
                        <p>{product.description}</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default ProductShow;