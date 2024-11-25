import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import Swal from 'sweetalert2'
import Layout from "../components/Layout"
import axiosInstance from './../axiosInstance';
function Registration() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [phoneNumber, setPhoneNumber] = useState()
    const [userType, setUserType] = useState('user');
    const [errors, setErrors] = useState({});
    const handleSave = () => {
        setIsSaving(true);
        axiosInstance.post('/users', {
            fullName: name,
            emailId: email,
            password: password,
            phoneNumber: Number(phoneNumber),
            userType: userType
        })
            .then(function (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'User created successfully!',
                    showConfirmButton: false,
                    timer: 1500
                })
                setIsSaving(false);
                setName('')
                setEmail('')
                setPassword('')
                setPhoneNumber()
                setPasswordConfirmation('')
            })
            .catch(function (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'An Error Occured!',
                    showConfirmButton: false,
                    timer: 1500
                })
                setIsSaving(false)
            });
    }

    const validatePhoneNumber = (number) => {
        const errors = {};
        if (!/^\d{10}$/.test(number)) {
            errors.phoneNumber = 'Phone number must be exactly 10 digits.';
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handlePhoneNumberChange = (event) => {
        const value = event.target.value;
        setPhoneNumber(value);
        validatePhoneNumber(value);
    };

    const validatePassword = (password) => {
        const errors = {};
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            errors.password = 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one special character, and one number.';
        }
        if (password !== passwordConfirmation) {
            errors.passwordConfirmation = 'Passwords do not match.';
        } else {
            errors.passwordConfirmation = '';
        }
        console.log(password, passwordConfirmation, errors)
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handlePasswordChange = (event) => {
        const value = event.target.value;
        setPassword(value);
        validatePassword(value);
    };

    const handlePasswordConfirmationChange = (event) => {
        const value = event.target.value;

        // validatePassword(password); // Validate both password and confirmation
        setPasswordConfirmation(value);

        if (password !== value) {
            errors.passwordConfirmation = 'Passwords do not match.';
        } else {
            errors.passwordConfirmation = '';
        }
    };

    return (
        <Layout>
            <div className="container">
                <div className="row">
                    <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                        <div className="card border-0 shadow rounded-3 my-5">
                            <div className="card-body p-4 p-sm-5">
                                <h5 className="card-title text-center mb-5 fw-light fs-5">Create new account</h5>
                                <form>
                                    <div className="form-floating mb-3">
                                        <input
                                            value={name}
                                            onChange={(event) => { setName(event.target.value) }}
                                            type="text"
                                            className="form-control"
                                            id="floatingInput"
                                            placeholder="Jhon Joe"
                                        />
                                        <label htmlFor="floatingInput">Name</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input
                                            value={email}
                                            onChange={(event) => { setEmail(event.target.value) }}
                                            type="email"
                                            className="form-control"
                                            id="floatingemail"
                                            placeholder="name@example.com" />
                                        <label htmlFor="floatingemail">Email address</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input
                                            value={phoneNumber}
                                            onChange={handlePhoneNumberChange}
                                            type="text"
                                            className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
                                            id="floatingPhoneNumber"
                                            placeholder="9998338081" />
                                        <label htmlFor="floatingPhoneNumber">Phone Number</label>
                                        {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input
                                            value={password}
                                            onChange={handlePasswordChange}
                                            type="password"
                                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                            id="floatingPassword"
                                            placeholder="Password" />
                                        <label htmlFor="floatingPassword">Password</label>
                                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input
                                            value={passwordConfirmation}
                                            onChange={handlePasswordConfirmationChange}
                                            type="password"
                                            className={`form-control ${errors.passwordConfirmation ? 'is-invalid' : ''}`}
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            placeholder="Password Confirmation"
                                        />
                                        <label htmlFor="password_confirmation">Password Confirmation</label>
                                        {errors.passwordConfirmation && <div className="invalid-feedback">{errors.passwordConfirmation}</div>}
                                    </div>

                                    <div className="form-floating mb-3">
                                        <select
                                            value={userType}
                                            onChange={(event) => setUserType(event.target.value)}
                                            className="form-control"
                                            id="floatingSelect"
                                            aria-label="User Type"
                                        >
                                            <option value="" disabled>Select user type</option>
                                            <option value="admin">Admin</option>
                                            <option value="user" selected>User</option>
                                        </select>
                                        <label htmlFor="floatingSelect">User Type</label>
                                    </div>

                                    <div className="d-grid">
                                        <button
                                            disabled={isSaving}
                                            onClick={handleSave}
                                            className="btn btn-primary btn-login text-uppercase fw-bold"
                                            type="button">
                                            Sign Up
                                        </button>
                                    </div>
                                    <hr className="my-4"></hr>

                                    <div className="d-grid">
                                        <Link className="btn btn-outline-primary btn-login text-uppercase fw-bold" to="/">Log in</Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Registration;