import React, { useState } from "react";
import "./App.css";
import AddData from "./Components/AddData/AddData";
import ShowData from "./Components/ShowData/ShowData";
import axiosURL from "./Components/Axios";
import { notification } from "antd";

const App = () => {
  const [editMode, setEditMode] = useState(false);
  const [id, setId] = useState();
  const [title, setTitle] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [path, setPath] = useState("");
  const [count, setCount] = useState(0);
  const [dataArray, setDataArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  //this function show the success notification
  const openNotification = (placement) => {
    api.error({
      message: `خطا`,
      description: Text,
      placement,
    });
  };

  const fillInputEdit = async (setTxt, setFiles) => {
    const obj = [
      {
        accept: "image/*",
        path: path,
        preview: imageURL,
      },
    ];
    try {
       setFiles(obj);
       setTxt(title);
    } catch (error) {
      // openNotification("top", `خطا ${error}`);
      console.log(error);
    }
  };

  const usedHandler = async () => {
    setLoading(true);
    try {
      let data = await axiosURL.get();
      setDataArray(data.data);
    } catch (error) {
      openNotification("top", `بارگذاری داده ها با خطا مواجه شد ${error}`);
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      {contextHolder}
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
