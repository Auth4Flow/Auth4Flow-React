import { useContext } from "react";
import Auth4FlowContext from "./Auth4FlowContext";

const useAuth4Flow = () => useContext(Auth4FlowContext);

export default useAuth4Flow;
