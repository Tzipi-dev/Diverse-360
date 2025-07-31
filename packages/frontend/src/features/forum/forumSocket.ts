import { useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import socket from "../../app/socket";
import  forumApi  from "../forum/fourmApi";  
import {Forum} from "../forum/forumTypes";
const ForumSocket = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleForumCreated = () => {
      dispatch(forumApi.util.invalidateTags(["Forum"]));
    };

    const handleForumUpdated = () => {
      dispatch(forumApi.util.invalidateTags(["Forum"]));
    };

    const handleForumDeleted = ({ id,userId,userRole }: { id: string , userId:string, userRole:string}) => {
      dispatch(
        forumApi.util.updateQueryData(
          "getAllForums",
          { limit: 99999, offset: 0 , userId: userId,userRole: userRole},
          (draft) => {
            draft.data = draft.data.filter((forum: Forum) => forum.id !== id);
          }
        )
      );
    };


    socket.on("forumCreated", handleForumCreated);
    socket.on("forumUpdated", handleForumUpdated);
    socket.on("forumDeleted", handleForumDeleted);

    return () => {
      socket.off("forumCreated", handleForumCreated);
      socket.off("forumUpdated", handleForumUpdated);
      socket.off("forumDeleted", handleForumDeleted);
    };
  }, [dispatch]);

  return null;
};

export default ForumSocket;
