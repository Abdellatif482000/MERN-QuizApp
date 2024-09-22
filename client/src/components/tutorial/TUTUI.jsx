import React, { useContext, useState, useEffect } from "react";
import { QuizAppContext } from "../quizAppContext";
import axios from "axios";
import { Route, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function TUTUI() {
  const { selectedTUT } = useContext(QuizAppContext);
  const [TUTData, setTUTData] = useState();
  const navigate = useNavigate();

  let [dataFetched, setDataFetched] = useState(false);

  const fetchTUTData = async () => {
    if (dataFetched) return;

    try {
      await axios.get(`http://localhost:5000/example`).then((res) => {
        // setTUTData(res.data);
        setDataFetched(true);
        console.log(res);
      });
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log("Fetch canceled");
      }
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    if (dataFetched) {
      return;
    } else {
      fetchTUTData();
    }
    // console.log(TUTData);
  }, [fetchTUTData, selectedTUT]);

  return (
    <div>
      {" "}
      <h1>{selectedTUT}</h1>
    </div>
  );
}
