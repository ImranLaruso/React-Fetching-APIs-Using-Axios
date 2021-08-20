import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./styles.css";

interface UserName {
  title: string;
  first: string;
  last: string;
}
interface UserPicture {
  thumbnail: string;
}
interface UserInfo {
  name: UserName;
  picture: UserPicture;
}

const randomData = (pageNumber: number = 1) => {
  return axios
    .get(`https://randomuser.me/api?page=${pageNumber}`)
    .then(({ data }) => {
      return data;
    })
    .catch((ex) => {
      console.error(ex);
    });
};
const getUserFullName = (user: UserInfo) => {
  const {
    name: { title, first, last }
  } = user;
  return `${title} ${first} ${last}`;
};

export default function App() {
  const [nextPage, setNextPage] = useState(1);
  const [text, setText] = useState("");
  const [userInfo, setUserInfo] = useState([]);

  const getNextUser = useRef(() => {});

  getNextUser.current = () => {
    randomData(nextPage).then((data) => {
      if (data === undefined) return;
      setText(JSON.stringify(data, null, 8));
      const newUserInfos = [...userInfo, ...data.results];
      setUserInfo(newUserInfos);
      setNextPage(data.info.page + 1);
    });
  };
  useEffect(() => {
    getNextUser.current();
  }, []);

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      {userInfo.map((user: UserInfo, idx) => (
        <div>
          <pre>{getUserFullName(user)}</pre>
          <img src={user.picture.thumbnail} />
        </div>
      ))}
      <button onClick={() => {getNextUser.current();}}>Fetch Next User</button>
      {/* <pre>{text}</pre> */}
    </div>
  );
}
