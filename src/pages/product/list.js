import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom"
import Swal from 'sweetalert2'
import Layout from "./../../components/Layout"
import { jwtDecode } from 'jwt-decode';
import axiosInstance from './../../axiosInstance';
function ProductList() {
    const navigate = useNavigate();
    const [productList, setProductList] = useState([])
    const [page, setPage] = useState(1);
    const [limit] = useState(10); // Number of items per page
    const [total, setTotal] = useState(0);
    const [keyword, setKeyword] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const token = localStorage.getItem('token');
    let decodedToken = null;

    if (token) {
        decodedToken = jwtDecode(token);
    }

    useEffect(() => {
        if (localStorage.getItem('token') == null) {
            navigate('/');
        }
        fetchProductList();
    }, [page, keyword, startDate, endDate]);

    const fetchProductList = () => {
        axiosInstance
            .get('/products', {
                params: { page, limit, keyword, startDate, endDate },
            })
            .then(function (response) {
                setProductList(response.data.products);
                setTotal(response.data.total);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axiosInstance.delete(`/products/${id}`)
                    .then(function (response) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Product deleted successfully!',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        fetchProductList()
                    })
                    .catch(function (error) {
                        Swal.fire({
                            icon: 'error',
                            title: 'An Error Occurred!',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    });
            }
        })
    }

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const handleNextPage = () => {
        if (page < Math.ceil(total / limit)) {
            setPage(page + 1);
        }
    };

    return (
        <Layout>
            <div className="container">
                <h2 className="text-center mt-5 mb-3">Product Manager</h2>
                <div className="card">
                    {decodedToken?.role == 'user' &&
                        <div className="card-header">
                            <Link className="btn btn-outline-primary" to="/create">Create New Product </Link>
                        </div>}
                    <div className="card-body">
                        <div className="mb-3">
                            <input
                                type="text"
                                placeholder="Search by name or description"
                                className="form-control"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                            <input
                                type="date"
                                className="form-control mt-2"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                            <input
                                type="date"
                                className="form-control mt-2"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>User</th>
                                    <th width="240px">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productList.map((product, key) => {
                                    return (
                                        <tr key={key}>
                                            <td>{product.name}</td>
                                            <td>{product.description}</td>
                                            <td>{product.userId.fullName}</td>
                                            <td>
                                                <Link
                                                    to={`/show/${product._id}`}
                                                    className="btn btn-outline-info mx-1">
                                                    Show
                                                </Link>
                                                {decodedToken?.role == 'user' &&
                                                    (<><Link
                                                        className="btn btn-outline-success mx-1"
                                                        to={`/edit/${product._id}`}>
                                                        Edit
                                                    </Link>
                                                        <button
                                                            onClick={() => handleDelete(product._id)}
                                                            className="btn btn-outline-danger mx-1">
                                                            Delete
                                                        </button></>)
                                                }
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        <div className="d-flex justify-content-between">
                            <div>Total: {total}</div>
                            <button className="btn btn-primary" onClick={handlePreviousPage} disabled={page === 1}>
                                Previous
                            </button>
                            <button className="btn btn-primary" onClick={handleNextPage} disabled={page >= Math.ceil(total / limit)}>
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default ProductList;