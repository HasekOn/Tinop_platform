import React, {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter, Navigate, Outlet, Route, Routes} from 'react-router-dom'
import './index.css'
import Login from './components/auth/Login.jsx'
import Register from "./components/auth/Register.jsx";
import Tasks from "./components/tasks/TaskPages.jsx";
import Projects from "./components/projects/ProjectPages.jsx";
import Ideas from "./components/ideas/IdeaPages.jsx";
import Timesheet from "./components/timeSheets/TimeSheetPages.jsx";
import {isAuthenticated} from "./utils/tokenAuth.js";
import ProfilePages from "./components/profile/ProfilePages.jsx";

const ProtectedRoute = ({redirectPath = '/login'}) => {
    if (!isAuthenticated()) {
        return <Navigate to={redirectPath} replace/>;
    }
    return <Outlet/>;
};

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>

                <Route element={<ProtectedRoute redirectPath="/login"/>}>
                    <Route path="/tasks" element={<Tasks/>}/>
                    <Route path="/projects" element={<Projects/>}/>
                    <Route path="/ideas" element={<Ideas/>}/>
                    <Route path="/timesheet" element={<Timesheet/>}/>
                    <Route path="/profile" element={<ProfilePages/>}/>
                    <Route path="/" element={<Tasks/>}/>
                </Route>

                <Route
                    path="*"
                    element={
                        isAuthenticated() ?
                            <Navigate to="/tasks" replace/> :
                            <Navigate to="/login" replace/>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}


export default AppRouter;

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AppRouter/>
    </StrictMode>,
);