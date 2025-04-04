import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Subject from "../../components/Subject/Subject";

const SubjectPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-28 px-4">
        <Subject />
      </main>
    </div>
  );
};

export default SubjectPage;
