import { createContext, useState } from "react";

export const QuizAppContext = createContext();

// export const QuizzAppProvider = (props) => {
//   const [username, setUsername] = useState("Initial Value");

//   return (
//     <QuizzAppProvider.Provider value={{ username, setUsername }}>
//       {props.children}
//     </QuizzAppProvider.Provider>
//   );
// };
