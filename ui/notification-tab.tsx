// "use client";

// // import { notifications } from "@/lib/config/notifications";
// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Icon } from "@iconify/react";

// export default function NotificationTab() {
//   const [isOpen, setIsOpen] = useState(false);

//   const handleNotifs = () => {
//     setIsOpen(!isOpen);
//   };
//   return (
//     <div className="relative">
//       <div
//         onClick={handleNotifs}
//         className="relative flex justify-center items-center h-10 w-10 rounded-md border border-[#E5E5E5] hover:cursor-pointer hover:bg-gray-50">
//         <Icon
//           icon={"streamline-sharp:bell-notification"}
//           height={20}
//           width={20}
//         />
//         <span
//           className={`${
//             notifications.length === 0 ? "hidden" : "flex"
//           } absolute -top-2 -right-2 h-5 w-5 bg-[var(--primary)] text-white justify-center items-center text-xs rounded-full`}>
//           {notifications.length}
//         </span>
//         {isOpen && (
//           <AnimatePresence>
//             <motion.div
//               initial={{ y: -10, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               exit={{ y: -10, opacity: 0 }}
//               transition={{ duration: 0.2, ease: "easeOut" }}
//               className="absolute right-0 top-16 bg-white z-30 rounded-md border border-[#E5E5E5] shadow-md h-[400px] w-[300px] p-4"></motion.div>
//           </AnimatePresence>
//         )}
//       </div>
//     </div>
//   );
// }
