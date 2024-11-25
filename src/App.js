import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import ProjectList from "./pages/product/list"
import ProjectCreate from "./pages/product/create"
import ProjectEdit from "./pages/product/edit"
import ProjectShow from "./pages/product/show"
import Login from "./pages/Login"
import Registration from "./pages/Registration"
import UserList from "./pages/user/list"

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/signup" element={<Registration />} />
        <Route exact path="/dashboard" element={<ProjectList />} />
        <Route path="/create" element={<ProjectCreate />} />
        <Route path="/edit/:id" element={<ProjectEdit />} />
        <Route path="/show/:id" element={<ProjectShow />} />
        <Route exact path="/user" element={<UserList />} />
      </Routes>
    </Router>
  );
}

export default App;