import React from "react";
import { Dropdown, Button } from "flowbite-react";
import Cookies from "js-cookie";

import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const nav = useNavigate();
  let userData = Cookies.get("userData");

  const navPages = ["Dashboard", "Quizess"];
  const logout = () => {
    Cookies.remove("userData");
    Cookies.remove("token");
    nav("/");
    window.location.reload();
  };
  return (
    <nav
      className="
        bg-white 
        dark:bg-white
          border-b-2 border-[#000]
          w-full
          fixed
          top-0
          z-20
        
        "
    >
      <div
        className="     
          flex flex-row
          justify-between
          items-center
          ml-2
          "
      >
        {/* nav pages */}
        <ul
          className="
          border border-blue-700
                flex flex-row 
                space-x-8
                "
        >
          {/* dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700 */}
          {navPages.map((page) => (
            <li
              className="
                    text-dark-text 
                    hover:text-mint-green-primary
                    duration-200 
                    cursor-pointer
                    font-acumin
                    text-12-bold
                    "
              onClick={() => {
                nav(
                  `/${
                    page.charAt(0).toLocaleLowerCase() +
                    page.slice(1).replace(/\s/g, "")
                  }`
                );
              }}
            >
              {page}
            </li>
          ))}
        </ul>
        {/* ------- */}

        {/* logo */}
        <h1
          onClick={() => nav("/")}
          className="
            text-5xl
            
            flex justify-center items-center
            my-3
            cursor-pointer
            "
        >
          Quiz App
        </h1>

        {/* -------- */}

        {/* Sign in btn */}

        {userData ? (
          <div className="mr-4">
            <Dropdown
              label={JSON.parse(userData).username}
              dismissOnClick={false}
            >
              <Dropdown.Item>{JSON.parse(userData).userID}</Dropdown.Item>
              <Dropdown.Item>
                <Button onClick={logout} className="bg-red-500">
                  Log out
                </Button>{" "}
              </Dropdown.Item>
            </Dropdown>
          </div>
        ) : (
          <Button
            className="mr-4"
            onClick={() => {
              nav("/signin");
            }}
          >
            Sign in
          </Button>
        )}

        {/* ------- */}
      </div>
    </nav>
  );
}
