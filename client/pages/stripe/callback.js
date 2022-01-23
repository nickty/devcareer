import React, { useContext, useEffect } from "react";
import { context } from "../../context";
import { SyncOutlined } from "@ant-design/icons";
import axios from "axios";

const callback = () => {
  const {
    state: { user },
    dispatch,
  } = useContext(context);

  useEffect(() => {
    if (user) {
      axios.post("/api/get-account-status").then((res) => {
        dispatch({
          type: "LOGIN",
          payload: res.data,
        });
        window.localStorage.setItem("user", JSON.stringify(res.data));
        window.location.href = "/instructor";
      });
    }
  }, [user]);
  return (
    <div>
      <SyncOutlined
        spin
        className="d-flex justify-contect-center diplay-1 text-danger p-5"
      />
    </div>
  );
};

export default callback;
