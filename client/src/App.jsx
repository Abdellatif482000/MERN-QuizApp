import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { SignupForm } from "./components/auth/SignupForm";
import { SigninForm } from "./components/auth/SigninForm";

import Homepage from "./components/Homepage";
import Layout from "./components/layout/Layout";

import Dashboard from "./components/dashboard/Dashboard";
// import AdDashboard from "./components/dashboard/AdDashboard";

import ManageQuizess from "./components/manageContent/manageQuizess";
import CreateQuiz from "./components/manageContent/createQuiz";
import EditQuizess from "./components/manageContent/editQuizess";

import QuizUI from "./components/quiz/QuizUI";
import QuizzesMenu from "./components/quiz/QuizzesMenu";

import { QuizAppContext } from "./components/quizAppContext";
import Cookies from "js-cookie";

function App() {
  const [selectedQuizz, setSelectedQuizz] = useState();
  const [editQuizz, setEditQuizz] = useState();

  const [newToken, setToken] = useState();

  let userData = Cookies.get("userData");
  let isAuthorized = Cookies.get("token");

  return (
    <BrowserRouter>
      <QuizAppContext.Provider
        value={{
          setToken,
          selectedQuizz,
          setSelectedQuizz,
          editQuizz,
          setEditQuizz,
        }}
      >
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Homepage />} />
            <Route path="/signin" element={<SigninForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route
              path="/quizUI"
              element={
                newToken || isAuthorized ? (
                  <QuizUI />
                ) : (
                  <Navigate to="/signin" />
                )
              }
            />
            <Route path="/quizess" element={<QuizzesMenu />} />
            <Route
              path="/dashboard"
              element={
                newToken || isAuthorized ? (
                  <Dashboard />
                ) : (
                  <Navigate to="/signin" />
                )
              }
            />
            <Route
              path="/manageQuizess"
              element={
                (newToken || isAuthorized) &&
                JSON.parse(userData).role === "admin" ? (
                  <ManageQuizess />
                ) : (
                  <>no access</>
                )
              }
            />{" "}
            <Route
              path="/createQuiz"
              element={
                (newToken || isAuthorized) &&
                JSON.parse(userData).role === "admin" ? (
                  <CreateQuiz />
                ) : (
                  <>no access</>
                )
              }
            />
            <Route
              path="/editQuiz/:quizTitle"
              element={
                (newToken || isAuthorized) &&
                JSON.parse(userData).role === "admin" ? (
                  <EditQuizess />
                ) : (
                  <>no access</>
                )
              }
            />
          </Route>
        </Routes>
      </QuizAppContext.Provider>
    </BrowserRouter>
  );
}

export default App;