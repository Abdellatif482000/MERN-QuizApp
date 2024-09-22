import React, { useRef, useState } from "react";
import {
  Button,
  Card,
  Popover,
  Dropdown,
  Accordion,
  ListGroup,
  Modal,
} from "flowbite-react";
import axios from "axios";
import Cookies from "js-cookie";
import { loremIpsum } from "react-lorem-ipsum";
import { compareSync } from "bcryptjs";

export default function ManageTutorial() {
  const [TUTTitle, setTUTTitle] = useState();

  const [showNewHeadForm, setShowNewHeadForm] = useState("hidden");
  const [newSubHeadFrom, setNewSubHeadFrom] = useState("hidden");

  const [heads, setHeads] = useState([]);
  const [subHeads, setSubHeads] = useState([]);

  const [headTitle, setHeadTitle] = useState();
  const [headIntro, setHeadIntro] = useState();

  const [subHeadTitle, setSubHeadTitle] = useState();
  const [subHeadText, setSubHeadText] = useState();
  const [subHeadFigures, setSubHeadsFigures] = useState([]);

  const [figureData, setFigureData] = useState();
  const [figureName, setFigureName] = useState();

  const inputFileRef = useRef(null);

  let userData = Cookies.get("userData");
  const token = Cookies.get("token");

  const addHead = () => {
    setShowNewHeadForm(!showNewHeadForm);
  };

  const saveHead = () => {
    if (headTitle && headIntro && subHeads.length !== 0) {
      // countWord();

      setSubHeadTitle("");
      setHeadTitle("");
      setSubHeadText("");
      setHeadIntro("");
      setSubHeads([]);
      setSubHeadsFigures([]);

      setHeads([
        ...heads,
        {
          headTitle: headTitle,
          intro: headIntro,
          subHeads: subHeads,
        },
      ]);
    } else {
      if (!headTitle) alert("headTitle empty");
      if (!headIntro) alert("headIntro empty");
      if (subHeads.length === 0) alert("no subheads");
    }
  };

  const saveSubHead = () => {
    if (subHeadTitle && subHeadText) {
      setSubHeads((prev) => [
        ...prev,
        { title: subHeadTitle, text: subHeadText, figures: subHeadFigures },
      ]);
      setSubHeadTitle("");
      setSubHeadText("");
      setSubHeadsFigures([]);

      // console.log(subHeads);
      // setNewSubHeadFrom(!newSubHeadFrom);
    } else {
      if (!subHeadTitle) alert("Sub-Head title empty");
      if (!subHeadText) alert("Sub-Head text empty");
    }
  };

  const postTUT = async () => {
    if (heads.length === 0 || !TUTTitle) {
      if (!TUTTitle) alert("Title requried");
      if (!heads.length === 0) alert("No Heads");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/manageContent/",
        { contentType: "tutorials", title: TUTTitle, content: heads },
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
      console.log(res.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const countWord = (str) => {
    const cleanStr = str.replace(/[.,!?;:'"(){}[\]<>@#$%^&*+=_`~|\\\/-]/g, " ");

    return cleanStr
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  const uploadImg = (e) => {
    if (e.target.files[0] && e.target.files[0].name) {
      setSubHeadsFigures((prev) => [
        ...prev,
        {
          figure: e.target.files[0],
          figureName: e.target.files[0].name,
        },
      ]);
    } else {
      console.log(subHeadFigures);
    }
    // inputFileRef.current.value = "";
  };

  // const handleUpload = async () => {
  //   const formData = new FormData();
  //   formData.append("imgName", imgName);
  //   formData.append("img_Data", img);
  //   try {
  //     await axios
  //       .post("http://localhost:5000/upload", formData, {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       })
  //       .then((res) => {
  //         // console.log(res);
  //         axios
  //           .get(`http://localhost:5000/getImg/${res.data.insertedId}`, {
  //             headers: {
  //               "Content-Type": "multipart/form-data",
  //             },
  //           })
  //           .then((res) => {
  //             // setImgURL(res.data.imgData);
  //             console.log(res.data);
  //           });
  //       });
  //   } catch (err) {
  //     console.error("Error fetching data:", err);
  //   }
  // };

  return (
    <div className="bg-custom_teal min-h-screen flex flex-row justify-between">
      <form className="bg-beige flex flex-column h-50 w-width-40 p-2 mt-3 ml-3">
        <Button onClick={postTUT}>Create Tutorial</Button>
        <input
          type="text"
          placeholder="Tutorial Title"
          value={TUTTitle}
          onChange={(e) => setTUTTitle(e.target.value)}
        />
        {showNewHeadForm && <Button onClick={addHead}>New Head</Button>}

        <div className={`${showNewHeadForm ? "hidden" : ""}`}>
          <div className="flex flex-row justify-center">
            <Button onClick={saveHead} className="">
              Save Head
            </Button>
            <Button
              onClick={() => {
                setSubHeadTitle("");
                setHeadTitle("");
                setSubHeadText("");
                setHeadIntro("");
                setSubHeads([]);
                setSubHeadsFigures([]);
                // setShowNewHeadForm(!showNewHeadForm);
              }}
              className=""
            >
              Delete
            </Button>
          </div>
          <div className="flex flex-column">
            <label className="">
              <h3>New Head</h3>
              <input
                className="w-100"
                type="text"
                value={headTitle}
                onChange={(e) => setHeadTitle(e.target.value)}
              />
              <textarea
                placeholder="Intro about this Head"
                value={headIntro}
                onChange={(e) => setHeadIntro(e.target.value)}
                className="w-full h-36 py-3 px-5 border-2 border-gray-300 rounded-md bg-gray-100 text-base resize-none"
              ></textarea>
            </label>
          </div>

          <div className="m-2 ">
            {!newSubHeadFrom && (
              <Button onClick={() => setNewSubHeadFrom(!newSubHeadFrom)}>
                Add SubHead
              </Button>
            )}
            {newSubHeadFrom && (
              <div className="flex flex-column w-100">
                <div className="flex flex-row">
                  <Button onClick={saveSubHead}>Save SubHead</Button>
                  <Button
                    onClick={() => {
                      setSubHeadText("");
                      setSubHeadTitle("");
                      // setNewSubHeadFrom(!newSubHeadFrom);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
                <input
                  type="text"
                  value={subHeadTitle}
                  onChange={(e) => setSubHeadTitle(e.target.value)}
                  placeholder={`Add New SubHead`}
                />
                <input
                  type="file"
                  ref={inputFileRef}
                  onChange={(e) => {
                    uploadImg(e);
                  }}
                />
                {subHeadFigures.length !== 0 && (
                  <>
                    {subHeadFigures.map((f, idx) => (
                      <>
                        <p>{idx + 1}</p>

                        <img
                          src={`${process.env.PUBLIC_URL}/${f.figureName}`}
                          style={{ width: "150px", height: "150px" }}
                        />

                        <Button
                          onClick={() => {
                            setSubHeadsFigures(
                              subHeadFigures.filter((_, i) => i !== idx)
                            );
                          }}
                        >
                          Delete this Sub-Head
                        </Button>
                      </>
                    ))}
                  </>
                )}
                <textarea
                  placeholder="SubHead Content"
                  value={subHeadText}
                  onChange={(e) => setSubHeadText(e.target.value)}
                  className="w-full h-36 py-3 px-5 border-2 border-gray-300 rounded-md bg-gray-100 text-base resize-none"
                ></textarea>
              </div>
            )}
            {subHeads.length !== 0 && (
              <Accordion>
                {subHeads.map((op, idx) => (
                  <Accordion.Panel className=" flex flex-row justify-between">
                    <Accordion.Title className="bg-teal-500 text-dark-500">
                      <h3>
                        {idx + 1}
                        {")"}
                        {op.title}
                      </h3>
                    </Accordion.Title>
                    <Accordion.Content>
                      <div className="border-2 border-red-500">
                        <p>{op.text}</p>

                        {op.figures.length !== 0 && (
                          <>
                            {op.figures.map((f) => (
                              <>
                                <p>{f.figureName}</p>

                                <img
                                  src={`${process.env.PUBLIC_URL}/${f.figureName}`}
                                  style={{ width: "150px", height: "150px" }}
                                />
                              </>
                            ))}
                          </>
                        )}
                      </div>
                      <Button
                        onClick={() => {
                          setSubHeads(subHeads.filter((_, i) => i !== idx));
                        }}
                      >
                        Delete this Sub-Head
                      </Button>
                    </Accordion.Content>
                  </Accordion.Panel>
                ))}
              </Accordion>
            )}
          </div>
        </div>
      </form>
      <div className="bg-beige flex flex-column h-50 w-width-40 p-2 mt-3 mr-3">
        <h2>Heads</h2>
        {heads.length !== 0 && (
          <div className="flex flex-column">
            {heads.map((h, idx) => (
              <div className="flex flex-column m-2 border-2 border-red-500">
                <Button
                  onClick={() => {
                    setHeads(heads.filter((_, i) => i !== idx));
                    console.log(heads);
                  }}
                >
                  Delete this Head
                </Button>

                <div>
                  <p>
                    <span className="text-3xl font-bold text-blue-500">
                      Head{")"}
                      {idx + 1}:
                    </span>
                    {h.headTitle}
                  </p>
                  <p>
                    <span className="text-3xl font-bold text-green-500">
                      Intro:
                    </span>
                    {h.intro}
                  </p>
                </div>

                <div className="border-2 border-green-500 m-2">
                  <span className="text-3xl font-bold text-red-500">
                    Sub-Heads:
                  </span>
                  {h.subHeads.map((sub, idx) => (
                    <div className="border-2 border-blue-500 m-3">
                      <span className="text-3xl font-bold text-yellow-500">
                        Sub-Heads {idx + 1}:
                      </span>
                      <h3>
                        {" "}
                        <span className="text-3xl font-bold text-green-500">
                          Sub-Heads Title :
                        </span>
                        {sub.title}
                      </h3>
                      <div>
                        <span className="text-3xl font-bold text-green-500">
                          Sub-Heads Text:
                        </span>
                        {sub.text}
                        {sub.figures.map((f) => (
                          <>
                            <img
                              src={`${process.env.PUBLIC_URL}/${f.figureName}`}
                              style={{ width: "150px", height: "150px" }}
                            />
                          </>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
