interface SubmissionDetailsType {
  name: string;
  content: string;
}

export interface CommentsType {
    commentedBy: string;
    comment: string; 
    date: string; 
    time: string;
};

// export interface DetailsType {
//   id: string;
//   name: string;
//   project: string;
//   submittedBy: string;
//   date: string;
//   time: string;
//   status: string;
//   submissionDetails: Array<SubmissionDetailsType>;
//   comments?: Array<CommentsType>;
// }
