import React, { useRef, useState } from "react";
import {
  Button,
  Card,
  Popover,
  Dropdown,
  Accordion,
  ListGroup,
} from "flowbite-react";
import axios from "axios";
import Cookies from "js-cookie";

import { json, Outlet, useNavigate } from "react-router-dom";

export default function CreateQuiz() {
  const [quizTitle, setQuizTitle] = useState("");
  const [Questions, setQuestions] = useState([]);

  const [question, setQuestion] = useState();
  const [correctAnswer, setCorrectAnswer] = useState();
  const [questionCount, setQuestionCount] = useState(1);
  const [questionChoices, setQuestionChoices] = useState([]);
  const [showQuestionForm, setShowQuestionForm] = useState("hidden");
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const nav = useNavigate();

  // ------ useref --------------
  const questionInputRef = useRef(null);
  const mcqOptionsRef = useRef(null);

  // --------------------
  let userData = Cookies.get("userData");
  const token = Cookies.get("token");

  const newChoice = () => {
    let currentChoice = mcqOptionsRef.current.value;
    if (currentChoice) {
      setQuestionChoices((prev) => [...prev, currentChoice]);
      mcqOptionsRef.current.value = "";
    }
  };

  const saveQuestion = () => {
    if (question && correctAnswer) {
      setQuestionCount((prev) => prev + 1);

      setQuestions([
        ...Questions,
        {
          options: questionChoices,
          question: question,
          answer: correctAnswer,
          type: selectedQuestion,
        },
      ]);
      console.log(questionChoices);
      setShowQuestionForm(!showQuestionForm);
      setQuestionChoices([]);
      setCorrectAnswer("");
      setQuestion("");
      setQuestionChoices([]);
    } else {
      if (!question) alert("question input empty");

      if (!correctAnswer) alert("correctAnswer input empty");
    }
  };

  const cancelCurrent = () => {
    setShowQuestionForm(!showQuestionForm);
    setQuestionChoices([]);
    setCorrectAnswer("");
    setQuestion("");
    setQuestionChoices([]);
  };

  const addNewQuestion = (value) => {
    setSelectedQuestion(value);
    if (value === "tf") setQuestionChoices(["true", "false"]);
    console.log(questionChoices);
    setShowQuestionForm(!showQuestionForm);
  };

  const postQuiz = async () => {
    console.log(Questions.length);
    if (Questions.length === 0 || !quizTitle) {
      if (!quizTitle) alert("Title requried");
      if (Questions.length === 0) alert("NO Questions");
      return;
    }

    try {
      await axios
        .post(
          "http://localhost:5000/createQuiz/",
          { CRUD: "create", quizTitle: quizTitle, questions: Questions },
          {
            params: {
              role: JSON.parse(userData).role,
              ID: JSON.parse(userData).userID,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          console.log(res.data);

          window.location.reload();
        });
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const deleteQuestion = (id) => {
    setQuestions(Questions.filter((ques, idx) => idx !== id));
  };

  return (
    <div className="bg-custom_teal min-h-screen flex flex-row justify-around">
      <form className="bg-beige flex flex-column h-50 w-width-40">
        <Button onClick={postQuiz}>Create Quiz</Button>
        <input
          type="text"
          placeholder="Quiz Title"
          onChange={(e) => setQuizTitle(e.target.value)}
        />

        {showQuestionForm && (
          <Dropdown label=" New Question">
            <Dropdown.Item onClick={() => addNewQuestion("mcq")}>
              MCQ
            </Dropdown.Item>
            <Dropdown.Item onClick={() => addNewQuestion("tf")}>
              TF
            </Dropdown.Item>
          </Dropdown>
        )}

        <div className={`${showQuestionForm ? "hidden" : ""}`}>
          <div className="flex flex-row">
            <Button onClick={saveQuestion} className="">
              Save Question
            </Button>
            <Button onClick={cancelCurrent} className="">
              Delete
            </Button>
          </div>
          <div className="flex flex-column">
            <label className="mb-3 ml-3">
              <h3>New Question</h3>
              <input
                ref={questionInputRef}
                className="w-100"
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </label>
            <label>
              {questionChoices && (
                <>
                  {correctAnswer ? (
                    <label>Correct Answer:{correctAnswer}</label>
                  ) : (
                    <>No Asnwer</>
                  )}
                </>
              )}
            </label>
          </div>
          {selectedQuestion === "mcq" && (
            <div className="m-2 ">
              <label className="flex flex-column w-100">
                <input
                  type="text"
                  ref={mcqOptionsRef}
                  placeholder={`Add New Choice `}
                />

                <Button onClick={newChoice}>Save option</Button>
              </label>
              <ListGroup label="Manage Choices" className="w-75">
                {questionChoices.length !== 0 && (
                  <>
                    {questionChoices.map((op, idx) => (
                      <ListGroup.Item className="flex flex-row justify-between">
                        <p>
                          {idx + 1}
                          {")"}
                          {op}
                        </p>
                        <div className="flex flex-row justify-between">
                          <Button
                            size="xs"
                            onClick={() => {
                              setCorrectAnswer(op);
                            }}
                          >
                            Select this
                          </Button>
                          <Button
                            size="xs"
                            onClick={() => {
                              if (op === correctAnswer) {
                                setCorrectAnswer("");
                              }
                              setQuestionChoices(
                                questionChoices.filter((_, i) => i !== idx)
                              );
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
                      </ListGroup.Item>
                    ))}
                  </>
                )}
              </ListGroup>
            </div>
          )}{" "}
          {selectedQuestion === "tf" && (
            <div className="flex flex-row justify-center">
              <Button
                size="xs"
                onClick={() => {
                  setCorrectAnswer("true");
                }}
              >
                true
              </Button>

              <Button
                size="xs"
                onClick={() => {
                  setCorrectAnswer("false");
                }}
              >
                false
              </Button>
            </div>
          )}
        </div>
      </form>
      <div className="w-width-40">
        <h3>Quiz</h3>
        {!Questions.question && (
          <ListGroup>
            {Questions.map((q, idx) => (
              <ListGroup.Item key={idx}>
                <div className="flex flex-column">
                  <h4 className="">Question {idx + 1}</h4>
                  {/* <div className=""> */}
                  <Button onClick={() => deleteQuestion(idx)}>
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
                  <h2>
                    Q{")"}
                    {q.question}
                  </h2>
                  <h4>{q.type.toUpperCase()}</h4>
                  <div>
                    <Popover
                      aria-labelledby="default-popover"
                      content={
                        <ListGroup className="w-64 text-sm text-gray-500 dark:text-gray-400">
                          {q.options.map((op, idx) => (
                            <ListGroup.Item className="cursor-pointer">
                              {idx + 1}
                              {") "}
                              {op}
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      }
                    >
                      <Button>Choices</Button>
                    </Popover>
                  </div>
                  <p className="text-2xl font-bold">
                    Correct Answer : {q.answer}
                  </p>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </div>
    </div>
  );
}
