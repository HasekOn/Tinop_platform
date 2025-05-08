import { motion, AnimatePresence } from "framer-motion";
import { Routes, Route, useLocation } from "react-router-dom";
import Login from "../components/login/Login.jsx";
import Registration from "../components/register/Register.jsx";

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
            >
                <Routes location={location} key={location.pathname}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Registration />} />
                </Routes>
            </motion.div>
        </AnimatePresence>
    );
}

export default AnimatedRoutes;
