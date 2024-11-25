import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom"
import Swal from 'sweetalert2'
import Layout from "./../../components/Layout"
import axiosInstance from './../../axiosInstance';
function UserList() {
    const navigate = useNavigate();
    const [userList, setUserList] = useState([])
    const [page, setPage] = useState(1);
    const [limit] = useState(10); // Number of items per page
    const [total, setTotal] = useState(0);
    const [keyword, setKeyword] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        if (localStorage.getItem('token') == null) {
            navigate("/");
        }
        fetchUserList()
    }, [page, keyword, startDate, endDate]);



    const fetchUserList = () => {
        axiosInstance.get('/users', {
            params: { page, limit, keyword, startDate, endDate },
        }).then(function (response) {
            setUserList(response.data.users);
            setTotal(response.data.total);
        }).catch(function (error) {
            console.log(error);
        })
    }

    const handleActive = (id, flag) => {
        let url = `/users/active/${id}`;
        if (flag == 'active') {
            url = `/users/inactive/${id}`;
        }
        axiosInstance.put(url)
            .then(function (response) {
                Swal.fire({
                    icon: 'success',
                    title: `User ${flag} successfully!`,
                    showConfirmButton: false,
                    timer: 1500
                })
                fetchUserList()
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
                <h2 className="text-center mt-5 mb-3">User Manager</h2>
                <div className="card">
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
                                    <th>Full Name</th>
                                    <th>Email</th>
                                    <th>Phone Number</th>
                                    <th>Is Active</th>
                                    <th width="240px">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userList.map((user, key) => {
                                    return (
                                        <tr key={key}>
                                            <td>{user.fullName}</td>
                                            <td>{user.emailId}</td>
                                            <td>{user.phoneNumber}</td>
                                            <td>{user.isActive ? 'Active' : 'Inactive'}</td>
                                            <td>

                                                {user.isActive ?
                                                    <button
                                                        onClick={() => handleActive(user._id, 'active')}
                                                        className="btn btn-outline-danger mx-1">
                                                        In Active
                                                    </button>
                                                    :
                                                    <button
                                                        onClick={() => handleActive(user._id, 'inactive')}
                                                        className="btn btn-outline-success mx-1">
                                                        Active
                                                    </button>
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

export default UserList;