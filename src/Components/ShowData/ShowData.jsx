import React, { useEffect, useState } from "react";
import "./ShowData.css";
import { notification } from "antd";
import axiosURL from "../Axios";

const ShowData = (props) => {
  const [api, contextHolder] = notification.useNotification();
  const [apiData, setApiData] = useState("");

  useEffect(() => {
    if (apiData !== "") {
      props.setTitle(apiData.title);
      props.setPath(apiData.imageInfo.path);
      props.setImageURL(apiData.imageURL);
      props.setCount(props.count + 1);
    }
  }, [apiData]);

  //this function show the success notification
  const openNotification = (placement, Text) => {
    api.success({
      message: `موفق`,
      description: Text,
      placement,
    });
  };

  //this function delete the item from API according to given ID
  const deleteItem = async (e) => {
    props.setLoading(true);
    try {
      await axiosURL.delete(`/${e.target.parentElement.id}`);
      props.usedHandler();
      openNotification("top", "داده با موفقیت حذف شد");
    } catch (error) {
      console.log(error);
    }
    props.setLoading(true);
  };

  const getEditItemInfo = async (e) => {
    props.setEditMode(true);
    try {
      const data = await axiosURL.get(`/${e.target.parentElement.id}`);
      setApiData(data.data);
    } catch (error) {
      console.log(error);
    }
    props.setId(e.target.parentElement.id);
    // deleteItem(e);
  };

  return (
    <div className="showContent">
      {contextHolder}
      {props.dataArray.length > 0 ? (
        props.loading ? (
          <div className="spinner"></div>
        ) : (
          props.dataArray.map((i) => (
            <div id={i.id} key={i.id} className="dataCard">
              <img src={i.imageURL} alt="" />
              <p>عنوان عکس :{i.title}</p>
              <div className="url">
                <a href={i.imageURL}>لینک عکس</a>
              </div>
              <button
                onClick={(e) => deleteItem(e)}
                className="opBtn deleteBtn"
              >
                حذف
              </button>
              <button
                onClick={(e) => getEditItemInfo(e)}
                className="opBtn editBtn"
              >
                ویرایش
              </button>
            </div>
          ))
        )
      ) : props.loading ? (
        <div className="spinner"></div>
      ) : (
        <>چیزی پیدا نشد....</>
      )}
    </div>
  );
};

export default ShowData;
