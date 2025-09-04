import React from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";

export default function RightSidebar() {
  const { user } = useSelector((store) => store.auth);
  return (
    <div className="w-fit my-10 mr-32">
      <div className="flex gap-3 items-center">
        <Link to={`/profile/${user?._id}`}>
          <Avatar>
            <AvatarImage
              className="object-cover w-full h-full"
              src={user?.profilePicture}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex flex-col gap-1 font-bold text-sm">
          <h1 className="font-semibold text-sm">
            <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
          </h1>
          <span className="font-normal text-gray-600 text-sm">
            {user?.bio || "Bio here..."}
          </span>
        </div>
      </div>
      <SuggestedUsers />
    </div>
  );
}
