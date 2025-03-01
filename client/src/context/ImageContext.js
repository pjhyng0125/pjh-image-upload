import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const ImageContext = createContext();

export const ImageProvider = (prop) => {
  const [images, setImages] = useState([]);
  useEffect(() => {
    // 최초 1회만 실행
    axios
      .get("/images")
      .then((res) => setImages(res.data))
      .catch((err) => console.log(err));
  }, []);
  return (
    <ImageContext.Provider value={[images, setImages]}>
      {prop.children}
    </ImageContext.Provider>
  );
};
