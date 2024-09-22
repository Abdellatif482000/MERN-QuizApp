import React, { version } from "react";
import axios from "axios";
import { useState, useEffect, useRef, useContext, useCallback } from "react";
import { Button, Label, Modal } from "flowbite-react";
import { Route, useNavigate } from "react-router-dom";
import { QuizAppContext } from "../quizAppContext";
import Cookies from "js-cookie";

export default function QuizUI() {
  const navigate = useNavigate();
  const [quizzQuestions, setQuizzQuestions] = useState([]);
  const [currentQues, setCurrentQues] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState();

  const { selectedQuizz } = useContext(QuizAppContext);

  let [dataFetched, setDataFetched] = useState(false);

  const token = Cookies.get("token");
  const userData = Cookies.get("userData");

  const fetchQuizzData = async () => {
    if (dataFetched) return;
    if (token) {
      try {
        await axios
          .get(`http://localhost:5000/getQuizData/${selectedQuizz}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            const shuffledQuestions = res.data.questions.sort(
              () => Math.random() - 0.5
            );

            setQuizzQuestions(shuffledQuestions);
            setDataFetched(true);
          });
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Fetch canceled");
        }
        console.error("Error fetching data:", err);
      }
    }
  };

  const postScore = async (scoreData) => {
    try {
      if (userData) {
        await axios.put(`http://localhost:5000/updateScore`, {
          userID: JSON.parse(userData).userID,
          score: scoreData,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedQuizz === undefined) navigate("/quizzesMenu");
    if (dataFetched) {
      return;
    } else {
      fetchQuizzData();
    }
    console.log(quizzQuestions);
  }, [fetchQuizzData, selectedQuizz]);

  const quizDate = () => {
    const weekday = ["Sun", "Mon", "Tues", "Wednes", "Thu", "Fri", "Saturday"];
    const months = [
      "JAN.",
      "FEB.",
      "MAR.",
      "APR.",
      "MAY.",
      "JUN.",
      "JUL.",
      "AUG.",
      "SEP.",
      "OCT.",
      "NOV.",
      "DEC.",
    ];

    const dayName = weekday[new Date().getDay()];
    const dayNum = new Date().getDate();
    // const month = new Date().getMonth();
    const monthNUm = months[new Date().getMonth()];
    const year = new Date().getFullYear();
    const hour = new Date().getHours();
    const min = new Date().getMinutes();
    // console.log(day);
    return `${dayName},${dayNum} ${monthNUm}${year} in ${hour}:${min}`;
  };

  const handleChoices = (id, question, answer, correctAnswer) => {
    let isCorrent;
    if (answer === quizzQuestions[id].answer) {
      isCorrent = "correct";
    } else if (answer !== quizzQuestions[id].answer || "") {
      isCorrent = "wrong";
    }
    setSelectedChoices((prev) => ({
      ...prev,
      [id]: {
        question: question,
        answer: answer,
        answerState: isCorrent,
        correctAnswer: correctAnswer,
      },
    }));
  };
  const handleNextQuestion = () => {
    if (!currentAnswer) {
      return;
    } else {
      setCurrentAnswer("");
      setCurrentQues((prev) => prev + 1);
    }
  };
  const calculatScore = () => {
    let count = 0;
    for (let c in selectedChoices) {
      if (selectedChoices[c].answerState === "correct") count += 10;

      console.log(count + "  " + selectedChoices[c].answerState);
    }
    return count;
  };

  const handleSubmit = () => {
    if (!currentAnswer) {
      return;
    } else {
      calculatScore();

      postScore({
        date: quizDate(),
        quizz: selectedQuizz,
        score: calculatScore(),
        answers: selectedChoices,
      });
      navigate("/dashboard");
    }
  };

  return (
    <div className="container border-2 border-red-500 w-50">
      <h1>{selectedQuizz}</h1>

      {dataFetched && quizzQuestions ? (
        <form>
          {currentQues !== quizzQuestions.length - 1 && (
            <Button onClick={handleNextQuestion}>Next</Button>
          )}{" "}
          {currentQues === quizzQuestions.length - 1 && (
            <Button onClick={handleSubmit}>Finish</Button>
          )}
          <div key={currentQues}>
            <h3>{quizzQuestions[currentQues].type.toUpperCase()}</h3>
            <h3>
              Q:{currentQues + 1}
              {") "}
              {quizzQuestions[currentQues].question}
            </h3>
            {quizzQuestions[currentQues].options.map((choice) => (
              <label>
                <Button
                  key={currentQues}
                  onClick={() => {
                    setCurrentAnswer(choice);
                    handleChoices(
                      currentQues,
                      quizzQuestions[currentQues].question,
                      choice,
                      quizzQuestions[currentQues].answer
                    );
                  }}
                  style={{
                    backgroundColor:
                      selectedChoices[currentQues]?.answer === choice
                        ? "green"
                        : "gray",
                  }}
                >
                  {choice}
                </Button>
              </label>
            ))}
          </div>
        </form>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
