import React, { useState } from "react";
import TransactionList from "../Transactions/TransactionList";
import TransactionChart from "../Transactions/TransactionChart";

const Dashboard = () => {
    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        type: "",
        category: "",
    });
    return (
        <>
            <TransactionChart filters={filters} />
            <TransactionList filters={filters} setFilters={setFilters} />
        </>
    );
};

export default Dashboard;
