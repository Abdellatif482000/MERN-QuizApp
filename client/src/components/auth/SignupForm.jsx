import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tooltip } from "flowbite-react";

// import { addData, InintDB } from "./storeData";

import axios from "axios";

export function SignupForm() {
  const [userID, setUserID] = useState("");
  const [formValues, setFromValues] = useState({
    userID: "",
    username: "",
    email: "",
    password: "",
    role: "",
  });
  const [inputValidity, setInputValidity] = useState(false);
  const [formValidity, setFormValidity] = useState({
    username: false,
    email: false,
    password: false,
  });

  const handleInput = (e) => {
    // e.preventDefault();

    setFromValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    console.log(formValues);
    if (e.target.dataset.rgx) {
      const inputRGX = new RegExp(e.target.dataset.rgx);
      const inputValidMSG = e.target.nextSibling;

      if (e.target.value.match(inputRGX)) {
        setInputValidity(true);
        setFormValidity({
          ...formValidity,
          [e.target.name]: true,
        });
        inputValidMSG.classList.remove("fa-warning", true);
        inputValidMSG.classList.add("fa-check", true);
        inputValidMSG.setAttribute("data-tooltip-content", "valid");
      } else {
        setInputValidity(false);
        setFormValidity({
          ...formValidity,
          [e.target.name]: false,
        });
        inputValidMSG.classList.remove("fa-check", true);
        inputValidMSG.classList.add("fa-warning", true);
        inputValidMSG.setAttribute(
          "data-tooltip-content",
          e.target.dataset.validityriquires
        );
      }
    }
  };
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let checkFormValidity = Object.values(formValidity).every((i) => {
      return i;
    });

    console.log(checkFormValidity);
    // if (checkFormValidity === true) {
    try {
      const res = await axios.post("http://localhost:5000/signup/", formValues);
      console.log(res.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
    // if (formValues.role === "student") navigate("/studentPanel");
    // if (formValues.role === "admin") navigate("/adminPanel");
    // } else if (checkFormValidity === false) {
    //   alert("Not Valid Values");
    // }
  };

  return (
    <form
      id="form"
      className={`flex flex-col 
      items-center 
      w-[250px] 
      mx-auto 
      mt-5 
      bg-gray-900 
      p-4 
      text-white
      `}
    >
      <h3>Sign up</h3>

      <label>
        <input
          className={`filed text-[#000]`}
          id={"name"}
          placeholder="Name"
          name="username"
          value={formValues.username}
          data-rgx="^[a-zA-Z]+$"
          data-valid={inputValidity}
          data-validityriquires="Can not be empty and can not include numbers"
          onChange={handleInput}
        />

        <i
          className={"fa fa-warning icon"}
          id={"validityMSG"}
          data-tooltip-id="my-tooltip"
        >
          <Tooltip id="my-tooltip" />
        </i>
      </label>

      <label className="">
        <input
          className={`filed text-[#000]`}
          type={"email"}
          id={"field email"}
          placeholder="Email"
          value={formValues.email}
          name="email"
          data-rgx="^[a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$"
          data-valid={inputValidity}
          data-validityriquires="Should be include @ and .com"
          onChange={handleInput}
        />
        <i
          className={"fa fa-warning icon"}
          id={"validityMSG"}
          data-tooltip-id="my-tooltip"
        >
          <Tooltip id="my-tooltip" />
        </i>
      </label>

      <label className="">
        <input
          className={`filed text-[#000]`}
          type={"password"}
          id={"field password"}
          placeholder="Password"
          value={formValues.password}
          name="password"
          data-rgx="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
          data-valid={inputValidity}
          data-validityriquires="Should be include 1 uppercase, 1 lowercase, 1 number and 1 special character"
          onChange={handleInput}
        />
        <i
          className={"fa fa-warning icon"}
          id={"validityMSG"}
          data-tooltip-id="my-tooltip"
        >
          <Tooltip id="my-tooltip" />
        </i>
      </label>
      <label>
        <label>
          Student
          <input
            type="radio"
            value="student"
            name="role"
            onChange={handleInput}
          />
        </label>
        <label>
          Admin
          <input
            type="radio"
            value="admin"
            name="role"
            onChange={handleInput}
          />
        </label>
      </label>
      <input
        type={"submit"}
        value="Submit"
        className="py-2 px-4 bg-blue-500 text-white rounded-md shadow-md cursor-pointer hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        onClick={handleSubmit}
        // disabled={submitState}
      />
    </form>
  );
}
