import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Users from "../../components/Users/Users";
import Footer from "../../components/Footer/Footer";

const UsersPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-28 px-4">
        <Users />
      </main>
    </div>
  );
};

export default UsersPage;
