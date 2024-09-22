import React, { useContext } from "react";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Button, Label, Modal } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { QuizAppContext } from "../quizAppContext";

export default function QuizzesMenu() {
  const { setSelectedQuizz } = useContext(QuizAppContext);
  const [availableQuizzes, setAvailableQuizzes] = useState([]);
  let [quizzesFetched, setQuizzesFetched] = useState(false);
  const nav = useNavigate();

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

  return (
    <div>
      {quizzesFetched && (
        <ul>
          {availableQuizzes.map((quiz, idx) => (
            <li key={idx}>
              {quiz}
              <input
                type="radio"
                name="selectedQuizz"
                value={quiz}
                onChange={(e) => setSelectedQuizz(e.target.value)}
              />
            </li>
          ))}
        </ul>
      )}

      <input
        type="submit"
        className="py-2 px-4 bg-blue-500 text-white rounded-md shadow-md cursor-pointer hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        onClick={() => {
          nav("/quizUI");
        }}
      />
    </div>
  );
}
