import React, { useState } from "react";
import "./App.css";
import AddData from "./Components/AddData/AddData";
import ShowData from "./Components/ShowData/ShowData";
import axios from "axios";

const App = () => {
  const [editMode, setEditMode] = useState(false);
  const [id, setId] = useState();
  const [title, setTitle] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [path, setPath] = useState("");
  const [count, setCount] = useState(0);
  const [dataArray, setDataArray] = useState([]);
  const [loading, setLoading] = useState(false);

  const fillInputEdit = (setTxt, setFiles, setInUse) => {
    const obj = [
      {
        accept: "image/*",
        path: path,
        preview: imageURL,
      },
    ];
    setFiles(obj);
    setTxt(title);
  };

  const usedHandler = async () => {
    setLoading(true);
    try {
      let data = await axios.get(
        "https://64649d75043c103502be02f0.mockapi.io/crudData"
      );
      setDataArray(data.data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
    // setEditMode(false);
  };

  return (
    <div className="container">
      <AddData
        editMode={editMode}
        setLoading={setLoading}
        usedHandler={usedHandler}
        fillInputEdit={fillInputEdit}
        count={count}
        setEditMode={setEditMode}
        id={id}
      />
      <ShowData
        setEditMode={setEditMode}
        count={count}
        setPath={setPath}
        setId={setId}
        setTitle={setTitle}
        setImageURL={setImageURL}
        usedHandler={usedHandler}
        setLoading={setLoading}
        loading={loading}
        dataArray={dataArray}
        setCount={setCount}
      />
    </div>
  );
};

export default App;
