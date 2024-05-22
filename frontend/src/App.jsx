import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import PrivateNavbar from "./components/Navbar/PrivateNavbar";
import PublicNavbar from "./components/Navbar/PublicNavbar";
import HomePage from "./components/Home/HomePage";
import LoginForm from "./components/Users/Login";
import RegistrationForm from "./components/Users/Register";
import AddCategory from "./components/Category/AddCategory";
import CategoriesList from "./components/Category/CategoriesList";
import UpdateCategory from "./components/Category/UpdateCategory";
import TransactionForm from "./components/Transactions/TransactionForm";
import Dashboard from "./components/Users/Dashboard";
import UserProfile from "./components/Users/UserProfile";
import AuthRoute from "./components/Auth/AuthRoute";
import NotFound from "./components/NotFound/NotFound";

const App = () => {
    const user = useSelector((state) => state?.auth?.user);

    return (
        <BrowserRouter>
            {user ? <PrivateNavbar /> : <PublicNavbar />}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegistrationForm />} />
                <Route
                    path="/add-category"
                    element={
                        <AuthRoute>
                            <AddCategory />
                        </AuthRoute>
                    }
                />
                <Route
                    path="/categories"
                    element={
                        <AuthRoute>
                            <CategoriesList />
                        </AuthRoute>
                    }
                />
                <Route
                    path="/update-category/:categoryId"
                    element={
                        <AuthRoute>
                            <UpdateCategory />
                        </AuthRoute>
                    }
                />
                <Route
                    path="/add-transaction"
                    element={
                        <AuthRoute>
                            <TransactionForm />
                        </AuthRoute>
                    }
                />
                <Route
                    path="/update-transaction/:transactionId"
                    element={
                        <AuthRoute>
                            <TransactionForm />
                        </AuthRoute>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <AuthRoute>
                            <Dashboard />
                        </AuthRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <AuthRoute>
                            <UserProfile user={user} />
                        </AuthRoute>
                    }
                />

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
