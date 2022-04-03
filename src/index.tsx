import ReactDOM from "react-dom";
import Root from "./Root";
import './style.css'

if (process.env.NODE_ENV !== "development")
    console.log = () => {};
    
ReactDOM.render(<Root />, document.getElementById("root"));
