import React, {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Login from './components/login/Login.jsx'
import Register from "./components/register/Register.jsx";
import Tasks from "./components/tasks/TaskPages.jsx";
import Projects from "./components/projects/ProjectPages.jsx";
import Ideas from "./components/ideas/IdeaPages.jsx";

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/tasks" element={<Tasks/>}/>
                <Route path="/projects" element={<Projects/>}/>
                <Route path="/ideas" element={<Ideas/>}/>
                <Route path="/" element={
                    <App/>
                }/>
            </Routes>
        </BrowserRouter>
    );
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AppRouter/>
    </StrictMode>,
);