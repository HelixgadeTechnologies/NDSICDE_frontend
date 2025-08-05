"use client";

import CardComponent from "@/ui/card-wrapper";
import CommentsTab from "@/ui/comments-tab";
import Button from "@/ui/form/button";
import TextareaInput from "@/ui/form/textarea";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import { useState } from "react";
import { Icon } from "@iconify/react";

export default function CommentsAndNotes() {
  const [isAddComment, setIsAddComment] = useState(false);
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
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-[#1D2739] font-bold text-xl">Comments & Notes</h3>
          <button
            onClick={() => setIsAddComment(true)}
            className="cursor-pointer primary font-medium text-lg leading-8"
          >
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

      {isAddComment && (
        <Modal
          isOpen={isAddComment}
          onClose={() => setIsAddComment(false)}
          maxWidth="600px"
        >
          <div className="space-y-4">
            <div className="flex justify-end">
              <Icon 
              onClick={() => setIsAddComment(false)} 
              icon="ic:round-close" 
              height={24} 
              width={24} 
              className="cursor-pointer"
              />
            </div>
            <CardComponent>
              <Heading heading="Add Comment" />
              <TextareaInput
                placeholder="Type your comment here"
                value=""
                name=""
                onChange={() => {}}
              />
            </CardComponent>
            <Button content="Submit" />
          </div>
        </Modal>
      )}
    </>
  );
}
