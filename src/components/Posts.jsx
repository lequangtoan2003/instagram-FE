import React from "react";
import Post from "./Post";

export default function Posts() {
  return (
    <div>
      {[1, 2, 3, 4].map((item, index) => {
        return <Post key={index} />;
      })}
    </div>
  );
}
