import React, { useContext } from "react";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Button, Label, Modal } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { QuizAppContext } from "../quizAppContext";

export default function TUTMenu() {
  const { setSelectedTUT } = useContext(QuizAppContext);
  const [availableTUT, setAvailableTUT] = useState([]);
  let [TUTFetched, setTUTFetched] = useState(false);
  const nav = useNavigate();

  const getAvaliableQuizzes = async () => {
    if (TUTFetched) return;

    try {
      await axios
        .get(`http://localhost:5000/availableTutorials`)
        .then((res) => {
          setTUTFetched(true);
          setAvailableTUT(res.data);
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
      {TUTFetched && (
        <ul>
          {availableTUT.map((quiz, idx) => (
            <li key={idx}>
              {quiz}
              <input
                type="radio"
                name="selectedQuizz"
                value={quiz}
                onChange={(e) => setSelectedTUT(e.target.value)}
              />
            </li>
          ))}
        </ul>
      )}

      <input
        type="submit"
        className="py-2 px-4 bg-blue-500 text-white rounded-md shadow-md cursor-pointer hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        onClick={() => {
          nav("/tutorialUI");
        }}
      />
    </div>
  );
}
