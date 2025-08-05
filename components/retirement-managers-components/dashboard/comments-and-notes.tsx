"use client";

import CommentsTab from "@/ui/comments-tab";


export default function CommentsAndNotes() {
  const comments = [
    {
      name: "John Doe",
      date: "Mar 15, 2025",
      time: "10:20PM",
      comment:
        "The marketing campaign exceeded our expectations in terms of reach, but we need to improve conversion rates in the next quarter.",
    },
    {
      name: "Jane Doe",
      date: "Mar 15, 2025",
      time: "10:20PM",
      comment:
        "The marketing campaign exceeded our expectations in terms of reach, but we need to improve conversion rates in the next quarter.",
    },
  ];
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-[#1D2739] font-bold text-xl">Comments & Notes</h3>
        <button className="cursor-pointer primary font-medium text-lg leading-8">
          Add Comment
        </button>
      </div>
      <div className="space-y-3 h-full custom-scrollbar">
        {comments.map((c, i) => (
          <CommentsTab
            key={i}
            name={c.name}
            date={c.date}
            time={c.time}
            comment={c.comment}
          />
        ))}
      </div>
    </div>
  );
}
