import { useState, useEffect, useRef, useContext } from "react";
import { SignupForm } from "./SignupForm.jsx";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "flowbite-react";
import { QuizAppContext } from "../quizAppContext.js";
import Cookies from "js-cookie";

export function SigninForm() {
  const [userRole, setUserRole] = useState("student");
  const [formValues, setFromValues] = useState({
    userID: "",
    password: "",
    role: "",
  });
  const IDInputRef = useRef(null);
  const navigate = useNavigate();
  const { setToken } = useContext(QuizAppContext);
  // ..............................................

  const handleInputs = (e) => {
    setFromValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    console.log(formValues);
  };

  const handleSubmit = async (e) => {
    let checkInputs = Object.values(formValues).every((i) => {
      return i;
    });

    // if (checkInputs) {
    try {
      await axios
        .post(`http://localhost:5000/signin`, formValues)
        .then((res) => {
          Cookies.set("token", res.data.token, { expires: 1 / 24 });
          Cookies.set(
            "userData",
            JSON.stringify({
              userID: res.data.signinData.userID,
              role: res.data.signinData.role,
              username: res.data.signinData.username,
            }),
            { expires: 1 / 24 }
          );
          setToken(res.data.token);
          // setUserData(Cookies.get("userData"));
          navigate("/dashboard");
        });
    } catch (err) {
      console.error("Error fetching data:", err);
    }

    // } else {
    //   alert("Fill this");
    //   e.preventDefault();
    // }
  };

  const handleAccType = (e) => {
    if (e.target.value === "student") {
      setUserRole("student");
      IDInputRef.current.placeholder = "Student ID";
    }
    if (e.target.value === "admin") {
      setUserRole("admin");
      IDInputRef.current.placeholder = "Admin ID";
    }
  };

  return (
    <div
      className={`
      flex flex-col 
      items-center 
      w-[250px] 
      mx-auto 
      bg-gray-900 
      p-4 
      text-white
      `}
    >
      <h1>Sign in</h1>
      <Button
        onClick={() => {
          navigate("/signup");
        }}
      >
        Sign up
      </Button>

      <form>
        <label>
          <label>
            Student
            <input
              type="radio"
              name="role"
              value="student"
              onChange={(e) => {
                handleAccType(e);
                handleInputs(e);
              }}
            />
          </label>
          <label>
            Admin
            <input
              type="radio"
              name="role"
              value="admin"
              onChange={(e) => {
                handleAccType(e);
                handleInputs(e);
              }}
            />
          </label>
        </label>

        <input
          ref={IDInputRef}
          className="block text-[#000]"
          type="text"
          placeholder="Student ID"
          name="userID"
          value={formValues.userID}
          onChange={handleInputs}
        />

        <input
          className="text-[#000]"
          type={"password"}
          placeholder="Password"
          name="password"
          value={formValues.password}
          onChange={handleInputs}
        />
        <input
          className="
          py-2 px-4 
          bg-blue-500 
          text-white 
          rounded-md 
          shadow-md 
          cursor-pointer 
          hover:bg-blue-600 
          focus:outline-none 
          focus:ring-2 
          focus:ring-blue-500 
          focus:ring-opacity-50
          "
          type="button"
          value={"Sign in"}
          onClick={handleSubmit}
        />
      </form>
    </div>
  );
}
