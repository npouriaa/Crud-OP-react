//imports
import React, { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

import { notification } from "antd";
import "./AddData.css";
import axiosURL from "../Axios";

const AddData = (props) => {
  //refs
  const frmRef = useRef();
  const fileInput = useRef();

  //states
  const [api, contextHolder] = notification.useNotification();
  const [inUse, setInUse] = useState(false);
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  //this function create a url for each image
  const handleOnDrop = (accptedFiles) => {
    const file = accptedFiles[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setFileUrl(reader.result);
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  };

  //dropzone component
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
            accept: "image/*",
          })
        )
      );
      handleOnDrop(acceptedFiles);
      setInUse(true);
    },
  });

  //this function show the error notification
  const openNotificationError = (placement, errorText) => {
    api.error({
      message: `خطا`,
      description: errorText,
      placement,
    });
  };

  //this function show the success notification
  const openNotificationSuccess = (placement, errorText) => {
    api.success({
      message: `موفق`,
      description: errorText,
      placement,
    });
  };

  //this function post data to the given API
  const postData = async (e) => {
    e.preventDefault();
    if (title === "") {
      openNotificationError("top", "لطفا عنوان عکس را وارد کنید");
    }
    if (files[0].preview === "") {
      openNotificationError("top", "لطفا یک عکس انتخاب کنید");
    }
    if (title !== "" && files[0].preview !== "") {
      props.setLoading(true);
      const obj = {
        title: title,
        imageURL: fileUrl,
        imageInfo: files[0],
      };
      try {
        await axios.post(axiosURL.defaults.baseURL, obj);
        props.usedHandler();
        openNotificationSuccess("top", "داده با موفقیت اضافه شد");
      } catch (error) {
        console.log(error);
        openNotificationError("top", `عملیات با خطا مواجع شذ ${error}`);
      }
      props.setLoading(false);
      setTitle("");
      setFiles([]);
      setInUse(false);
      frmRef.current.reset();
    }
  };

  //this function edit data from the given API (put operator)
  const editItem = async (e) => {
    e.preventDefault();
    props.setLoading(true);
    const obj = {
      title: title,
      imageURL: files[0].preview,
      imageInfo: files[0],
    };
    try {
      await axiosURL.put(`/${props.id}`, obj);
      props.usedHandler();
      openNotificationSuccess("top", "داده با موفقیت ویرایش شد");
    } catch (error) {
      openNotificationError("top", `عملیات با خطا مواجع شد ${error}`);
      console.log(error);
    }
    setTitle("");
    setFiles([]);
    setInUse(false);
    props.setLoading(false);
    props.setEditMode(false);
  };

  //useeffects
  useEffect(() => {
    props.usedHandler();
  }, []);

  useEffect(() => {
    setInUse(true);
    props.fillInputEdit(setTitle, setFiles, setInUse);
  }, [props.count]);

  return (
    <>
      {contextHolder}
      <form ref={frmRef} action="">
        <div className="title-con">
          <label htmlFor="">عنوان عکس : </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="عنوان عکس را اینجا وارد کنید ...."
            type="text"
          />
        </div>
        <div className="dragCon">
          <div
            onDrop={() => handleOnDrop()}
            {...getRootProps()}
            className="uploadImgArea"
          >
            {inUse ? (
              <div className="draggedImage">
                {files.length > 0 ? (
                  files.map((file) =>
                    file.preview === "" ? (
                      <svg
                        className="dragSvg"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                        />
                      </svg>
                    ) : (
                      <div key={file.path} className="">
                        <img src={file.preview} alt="" />
                        <p className="fileNameText">{file.path}</p>
                      </div>
                    )
                  )
                ) : (
                  <></>
                )}
              </div>
            ) : (
              <svg
                className="dragSvg"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
            )}

            <input
              ref={fileInput}
              onChange={() => console.log("first")}
              {...getInputProps()}
            />
            {isDragActive ? (
              <p className="dragText">رها کنید</p>
            ) : (
              <p className="dragText">
                عکس را بکشید و رها کنید یا اینجا کلیک کنید
              </p>
            )}
          </div>
        </div>
        {props.editMode ? (
          <button
            onClick={(e) => editItem(e)}
            className="submitBtn"
            type="submit"
          >
            ویرایش
          </button>
        ) : (
          <button
            onClick={(e) => postData(e)}
            className="submitBtn"
            type="submit"
          >
            افزودن
          </button>
        )}
      </form>
    </>
  );
};

export default AddData;
