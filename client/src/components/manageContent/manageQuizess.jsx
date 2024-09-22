import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Button, Dropdown } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { QuizAppContext } from "../quizAppContext";
import Cookies from "js-cookie";

export default function ManageQuizess() {
  const nav = useNavigate();
  const { setEditQuizz } = useContext(QuizAppContext);

  const [quizzesFetched, setQuizzesFetched] = useState(false);
  const [availableQuizzes, setAvailableQuizzes] = useState([]);

  const [selectedQuizz, setSelectedQuizz] = useState("");
  let userData = Cookies.get("userData");
  const token = Cookies.get("token");

  const getAvaliableQuizzes = async () => {
    if (quizzesFetched) return;

    try {
      await axios.get(`http://localhost:5000/availableQuizzes`).then((res) => {
        setQuizzesFetched(true);
        setAvailableQuizzes(res.data);
      });
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log("Fetch canceled");
      }
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    getAvaliableQuizzes();
  }, [getAvaliableQuizzes]);

  const deleteQuiz = async (quizTitle) => {
    try {
      await axios
        .delete(`http://localhost:5000/deleteQuiz`, {
          params: {
            quizTitle: quizTitle,
            role: JSON.parse(userData).role,
            ID: JSON.parse(userData).userID,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          window.location.reload();
        });
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log("Fetch canceled");
      }
      console.error("Error fetching data:", err);
    }
  };

  const editPage = (quizTitle) => {
    nav(`/editQuiz/${quizTitle}`);
    sessionStorage.setItem("currentQuiz", quizTitle);
  };

  return (
    <form>
      <Button
        onClick={() => {
          nav("/createQuiz");
        }}
      >
        Create Quiz
      </Button>

      {availableQuizzes && (
        <Dropdown label="Edit Quiz">
          {availableQuizzes.map((q) => (
            <Dropdown.Item onClick={() => editPage(q)}>{q}</Dropdown.Item>
          ))}
        </Dropdown>
      )}

      {availableQuizzes && (
        <Dropdown
          label="Delete Quiz"
          style={{
            backgroundColor: "red",
          }}
        >
          {availableQuizzes.map((q) => (
            <Dropdown.Item>
              {q}
              <Button onClick={() => deleteQuiz(q)}>
                <svg
                  class="w-6 h-6 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </Button>
            </Dropdown.Item>
          ))}
        </Dropdown>
      )}
    </form>
  );
}
