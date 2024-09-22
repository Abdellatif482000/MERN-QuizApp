import React, { useState, useEffect, useContext } from "react";
import { Button, Modal, ListGroup, Popover, Dropdown } from "flowbite-react";
import { QuizAppContext } from "../quizAppContext";
import axios from "axios";
import Cookies from "js-cookie";
import { useLocation, useNavigate } from "react-router-dom";

export default function EditQuizess() {
  const [editModal, setEditModal] = useState(false);
  const [questions, setQuestions] = useState([]);

  const token = Cookies.get("token");
  const userData = Cookies.get("userData");
  let [dataFetched, setDataFetched] = useState(false);

  const [quizzesFetched, setQuizzesFetched] = useState(false);
  const [availableQuizzes, setAvailableQuizzes] = useState([]);
  // const { selectedQuizz } = useContext(QuizAppContext);

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

  const selectedQuizz = sessionStorage.getItem("currentQuiz");
  console.log(selectedQuizz);
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
            setQuestions(res.data.questions);
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

  useEffect(() => {
    if (selectedQuizz === undefined) nav("/manageQuizess");

    fetchQuizzData();
    console.log(questions);
  }, [fetchQuizzData, selectedQuizz]);
  const acceptEdit = async () => {
    if (token) {
      try {
        await axios.put(
          `http://localhost:5000/editQuiz`,
          { quizTitle: selectedQuizz, newArray: questions },
          {
            params: {
              role: JSON.parse(userData).role,
              ID: JSON.parse(userData).userID,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Fetch canceled");
        }
        console.error("Error fetching data:", err);
      }
    }
  };

  const deleteQuestion = (id) => {
    setQuestions(questions.filter((ques, idx) => idx !== id));
  };

  return (
    <div>
      {questions.length !== 0 ? (
        <ListGroup>
          <Button onClick={() => acceptEdit()}>Submit</Button>
          <h3>{selectedQuizz}</h3>

          <Dropdown label=" New Question">
            <Dropdown.Item
              onClick={() =>
                setQuestions([
                  { question: "", answer: "", options: [], type: "mcq" },
                  ...questions,
                ])
              }
            >
              MCQ
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() =>
                setQuestions([
                  { question: "", answer: "", options: [], type: "tf" },
                  ...questions,
                ])
              }
            >
              TF
            </Dropdown.Item>
          </Dropdown>

          {questions.map((q, qID) => (
            <ListGroup.Item key={qID}>
              <div className="flex flex-column">
                <div className="flex flex-column">
                  <h4 className="">Question {qID + 1}</h4>
                  {/* <div className=""> */}
                  <Button
                    onClick={() => {
                      deleteQuestion(qID);
                    }}
                  >
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
                  <h4>{q.type.toUpperCase()}</h4>

                  <label className="flex flex-column border-2 border-blue-500 p-2 mt-3">
                    <p>Question :{q.question}</p>
                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) => {
                        setQuestions(
                          questions.map((q, index) => {
                            if (index === qID) {
                              return { ...q, question: e.target.value };
                            }
                            return q;
                          })
                        );
                      }}
                    />
                  </label>

                  <label className="flex flex-column border-2 border-blue-500 p-2 mt-3">
                    <p>Correct Answer : {q.answer}</p>

                    <input
                      type="text"
                      value={q.answer}
                      onChange={(e) => {
                        setQuestions(
                          questions.map((q, index) => {
                            if (index === qID) {
                              return { ...q, answer: e.target.value };
                            }
                            return q;
                          })
                        );
                      }}
                    />
                  </label>
                  {q.type === "mcq" && (
                    <div>
                      <Button
                        onClick={() => {
                          setQuestions(
                            questions.map((q, index) => {
                              if (index === qID) {
                                const updatedOptions = [...q.options, ""];

                                return { ...q, options: updatedOptions };
                              }
                              return q;
                            })
                          );
                        }}
                      >
                        Add new choice
                      </Button>
                      {q.options.map((choice, choiceID) => (
                        <div className="border-2 border-red-500 flex flex-row justify-between">
                          <div className="flex flex-column">
                            <p>
                              option {choiceID + 1} : {choice}
                            </p>
                            <input
                              type="text"
                              value={choice}
                              onChange={(e) => {
                                setQuestions(
                                  questions.map((q, index) => {
                                    if (index === qID) {
                                      const updatedOptions = q.options.map(
                                        (option, i) => {
                                          if (i === choiceID) {
                                            return e.target.value;
                                          }
                                          return option;
                                        }
                                      );

                                      return { ...q, options: updatedOptions };
                                    }
                                    return q;
                                  })
                                );
                                console.log(questions);
                              }}
                            />
                          </div>
                          <div className="flex flex-row justify-between">
                            <Button
                              size="xs"
                              onClick={(e) => {
                                setQuestions(
                                  questions.map((q, index) => {
                                    if (index === qID) {
                                      const updatedOptions = q.options.filter(
                                        (_, i) => i !== choiceID
                                      );
                                      if (q.answer === choice) {
                                        return {
                                          ...q,
                                          answer: "",
                                          options: updatedOptions,
                                        };
                                      }
                                      return {
                                        ...q,
                                        options: updatedOptions,
                                      };
                                    }
                                    return q;
                                  })
                                );
                                console.log(questions);
                              }}
                            >
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
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <>load</>
      )}
    </div>
  );
}
