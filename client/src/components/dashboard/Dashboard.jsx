import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button, Carousel } from "flowbite-react";
import Cookies from "js-cookie";

export default function Dashboard() {
  const nav = useNavigate();
  const [studentScores, setStudentScores] = useState();
  let [dataFetched, setDataFetched] = useState(false);
  // const [firstQuizToShow, setFirstQuizToShow] = useState(0);
  const [lastScoreToShow, setLastScoreToShow] = useState(4);
  const token = Cookies.get("token");
  let userData = Cookies.get("userData");

  const authRoute = async () => {
    try {
      await axios
        .get(`http://localhost:5000/dashboard`, {
          params: { role: JSON.parse(userData).role },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          // console.log(res);
        });
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log("Fetch canceled");
      }
      console.error("Error fetching data:", err);
    }
  };

  const fetchStatis = async () => {
    if (dataFetched) return;
    if (userData) {
      try {
        await axios
          .get(`http://localhost:5000/stats`, {
            params: {
              role: JSON.parse(userData).role,
              ID: JSON.parse(userData).userID,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setStudentScores(res.data);
            setDataFetched(true);
          });
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }
  };
  const next4Quizess = () => {
    setLastScoreToShow((prev) => prev + 4);
    console.log(lastScoreToShow);
  };
  useEffect(() => {
    if (token) {
      authRoute();
      fetchStatis();
    } else {
      nav("/signin");
    }
  }, [authRoute]);

  return (
    <div className="text-white">
      {JSON.parse(userData).role && (
        <>
          accessed to UR dashboard as
          {JSON.parse(userData).role}
        </>
      )}
      {JSON.parse(userData).role === "admin" ? (
        <Button
          onClick={() => {
            nav("/manageQuizess");
          }}
        >
          Manage Quizess
        </Button>
      ) : (
        <>
          {studentScores && (
            <div className="flex flex-col justify-center m-auto">
              <div>
                {studentScores.length !== 0 ? (
                  <ul
                    className="
                          w-9/12
                          m-auto
                          flex  flex-wrap gap-2
                          "
                  >
                    {studentScores.slice(0, lastScoreToShow).map((s, idx) => (
                      <li className="border-2 border-red-500 w-[49%] m-auto mt-2">
                        <h1 className="text-2xl font-extrabold">{s.id}</h1>
                        <h1 className="text-2xl font-extrabold">
                          {s.score.date}
                        </h1>
                        <p>{s.score.quizz}</p>
                        <p>{s.score.score}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <>no scores</>
                )}
              </div>
              <Button onClick={next4Quizess}>Load More...</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
