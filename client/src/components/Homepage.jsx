import React from "react";
import axios from "axios";

import { useNavigate, Link, json } from "react-router-dom";
import { Button } from "flowbite-react";
import Cookies from "js-cookie";

function Homepage() {
  let nav = useNavigate();
  const token = Cookies.get("token");
  let userData = Cookies.get("userData");
  const fetchStatis = async () => {
    // if (dataFetched) return;
    if (userData) {
      try {
        await axios
          .get(`http://localhost:5000/stats/`, {
            params: { role: JSON.parse(userData).role },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            // setStudentScores(res.data.scores);
            // setDataFetched(true);
            console.log(res);
          });
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }
  };

  let arr = [1, 2, 3, 5, 6];
  const unOrderQuiestions = () => {
    for (let i in arr) {
      console.log(arr[Math.floor(Math.random() * arr.length)]);
    }
  };
  unOrderQuiestions();

  return (
    <h1 className="w-full m-auto">Home</h1>
  );
}

export default Homepage;
