import React, { useState, useContext } from "react";
import axios from "axios";
import "./UploadForm.css";
import ProgressBar from "./ProgressBar.js";
import { toast } from "react-toastify";
import { ImageContext } from "../context/ImageContext";

const UploadForm = () => {
  const defaultFileNm = "이미지 파일을 업로드해주세요!";
  const [images, setImages] = useContext(ImageContext);

  // file 변경 필요 시 setFile 함수 호출
  const [file, setFile] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [fileNm, setFileNm] = useState(defaultFileNm);
  const [percent, setPercent] = useState(0);

  const handleImgInpChange = (e) => {
    const imgFile = e.target.files[0];
    setFile(imgFile);
    setFileNm(imgFile.name || "");

    const fileReader = new FileReader();
    fileReader.readAsDataURL(imgFile);
    fileReader.onload = (e) => setImgSrc(e.target.result);
  };

  const handleSubmit = async (e) => {
    // button submit 후 새로고침 방지
    e.preventDefault();

    const formData = new FormData();
    formData.append("imageTest", file);
    try {
      const res = await axios.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          setPercent(Math.round((100 * e.loaded) / e.total));
        },
      });

      // 조회 이미지 목록에 업로드한 이미지 바로 추가
      setImages([...images, res.data]);

      toast.success("이미지 업로드 성공!");
      setTimeout(() => {
        initForm();
      }, 3000);
    } catch (err) {
      initForm();
      toast.error(err.message);
    }
  };

  const initForm = () => {
    setFileNm(defaultFileNm);
    setPercent(0);
    setImgSrc(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <img
        src={imgSrc}
        className={`image-preview ${imgSrc && "image-preview-show"}`}
      />
      <ProgressBar percent={percent} />
      <div className="file-dropper">
        {fileNm}
        <input
          id="imageInput"
          type="file"
          accept="image/*"
          onChange={handleImgInpChange}
        />
      </div>
      <button type="submit" className="btn-style">
        제출
      </button>
    </form>
  );
};

export default UploadForm;
