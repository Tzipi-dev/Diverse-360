import React from "react";
import { useParams } from "react-router-dom";
import { useGetForumByIdQuery } from "../fourmApi";

const ForumDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: forum, isLoading, error } = useGetForumByIdQuery(id!);

  if (isLoading) return <p>טוען פרטי פורום...</p>;
  if (error || !forum) return <p>שגיאה בטעינת פרטי הפורום</p>;

  return (
    <div style={{ padding: "2rem", direction: "rtl" }}>
      <h2>{forum.title}</h2>
      <p><strong>תיאור:</strong> {forum.description}</p>
      <p><strong>נוצר ע״י:</strong> {forum.created_by_user_id}</p>
      <p><strong>נוצר בתאריך:</strong> {new Date(forum.created_at).toLocaleString()}</p>
      <p><strong>עודכן לאחרונה:</strong> {new Date(forum.updated_at).toLocaleString()}</p>
    </div>
  );
};

export default ForumDetailsPage;
