import React, {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter, Navigate, Outlet, Route, Routes} from 'react-router-dom'
import './index.css'
import Login from './components/login/Login.jsx'
import Register from "./components/register/Register.jsx";
import Tasks from "./components/tasks/TaskPages.jsx";
import Projects from "./components/projects/ProjectPages.jsx";
import Ideas from "./components/ideas/IdeaPages.jsx";
import Timesheet from "./components/timeSheets/TimeSheetPages.jsx";
import {isAuthenticated} from "./utils/tokenAuth.js";
import App from "./App.jsx";

const ProtectedRoute = ({isAuthenticated, redirectPath = '/login'}) => {
    if (!isAuthenticated) {
        return <Navigate to={redirectPath} replace/>;
    }
    return <Outlet/>;
};

function AppRouter({isAuthenticated}) {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>

                <Route element={<ProtectedRoute isAuthenticated={isAuthenticated}/>}>
                    <Route path="/tasks" element={<Tasks/>}/>
                    <Route path="/projects" element={<Projects/>}/>
                    <Route path="/ideas" element={<Ideas/>}/>
                    <Route path="/timesheet" element={<Timesheet/>}/>
                    <Route path="/" element={<App/>}/>
                </Route>

                <Route
                    path="*"
                    element={
                        isAuthenticated
                            ? <Navigate to="/tasks" replace/>
                            : <Navigate to="/login" replace/>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AppRouter isAuthenticated={isAuthenticated()}/>
    </StrictMode>,
);