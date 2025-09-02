import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts } from "@/redux/postSlice";

export default function Post({ post }) {
  const [text, setText] = useState();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const dispatch = useDispatch();
  const {
    image,
    caption,
    likes,
    author: { username, profilePicture },
  } = post;
  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };
  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `http://localhost:8001/api/v1/post/${post._id}/${action}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);
        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8001/api/v1/post/delete/${post?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatePostData = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );
        dispatch(setPosts(updatePostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage className="object-cover" src={profilePicture} alt="" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1>{username}</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            <Button
              variant="ghost"
              className="cursor-pointer w-fit text-[#ED4956] font-bold"
            >
              Unfollow
            </Button>
            <Button variant="ghost" className="cursor-pointer w-fit">
              Add to favarites
            </Button>
            {user && user?._id === post?.author._id && (
              <Button
                onClick={deletePostHandler}
                variant="ghost"
                className="cursor-pointer w-fit text-[#ED4956] font-bold"
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="rounded-lg my-2 w-full aspect-square object-cover"
        src={image}
        alt=""
      />
      {/* like cmt send bookmart */}
      <div className="flex items-center justify-between my-2">
        <div className="flex items-center justify-between gap-3">
          {liked ? (
            <FaHeart
              onClick={likeOrDislikeHandler}
              size={"24px"}
              className="cursor-pointer text-red-600"
            />
          ) : (
            <FaRegHeart
              onClick={likeOrDislikeHandler}
              className="cursor-pointer hover:text-gray-600"
              size={"24px"}
            />
          )}
          <MessageCircle
            onClick={() => setOpen(true)}
            className="cursor-pointer hover:text-gray-600"
          />
          <Send
            onClick={() => setOpen(true)}
            className="cursor-pointer hover:text-gray-600"
          />
        </div>
        <Bookmark className="cursor-pointer hover:text-gray-600" />
      </div>
      <span className="font-medium block mb-2">
        {postLike} like{postLike > 1 ? "s" : ""}
      </span>
      <p>
        <span className="font-medium mr-2">{username}</span>
        {caption}
      </p>
      <span
        className="cursor-pointer text-sm text-gray-400"
        onClick={() => setOpen(true)}
      >
        View all 10 comments
      </span>
      <CommentDialog open={open} setOpen={setOpen} />
      <div className="flex justify-between">
        <input
          type="text"
          value={text}
          onChange={changeEventHandler}
          placeholder="Add a comment..."
          className="outline-none text-sm w-full"
        />
        {text ? <span className="text-[#3BADF8]">Post</span> : ""}
      </div>
    </div>
  );
}
