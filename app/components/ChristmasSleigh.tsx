// "use client";

// import { useEffect, useState } from "react";

// const SLEIGH_SHOWN_KEY = "threads-of-calm-christmas-sleigh-shown";

// export default function ChristmasSleigh() {
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     const navigation = window.performance.getEntriesByType(
//       "navigation",
//     )[0] as PerformanceNavigationTiming | undefined;

//     if (navigation?.type === "reload") {
//       window.sessionStorage.removeItem(SLEIGH_SHOWN_KEY);
//     }

//     if (window.sessionStorage.getItem(SLEIGH_SHOWN_KEY)) {
//       return;
//     }

//     window.sessionStorage.setItem(SLEIGH_SHOWN_KEY, "true");
//     setIsVisible(true);
//   }, []);

//   if (!isVisible) {
//     return null;
//   }

//   return (
//     <div
//       className="christmas-flyby"
//       aria-hidden="true"
//       onAnimationEnd={() => setIsVisible(false)}
//     >
//       <img
//         src="https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2a/Patro_Kristnasko.svg/1280px-Patro_Kristnasko.svg.png"
//         alt=""
//       />
//     </div>
//   );
// }
