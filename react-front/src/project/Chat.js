import TextField from "@material-ui/core/TextField"
import React, { useEffect, useRef, useState } from "react"
import io from "socket.io-client";
import { getCurrentUser } from "./../user/apiUser";
import { updateChat } from "./apiProject";
import { Row,Col} from "react-bootstrap";
import SendIcon from '@material-ui/icons/Send';
import "./Chat.css";

var options = {
    rememberUpgrade: true,
    transports: ["websocket"],
    secure: true,
    rejectUnauthorized: false,
};

function Chat(props) {

	const project_id = props.projectId;
	const status = props.status;
	const [ state, setState ] = useState({ message: "", name: getCurrentUser().name })
	const [ chat, setChat ] = useState([])
	const socketRef = useRef()

	useEffect(()=>{
		socketRef.current = socketRef.current = io.connect("http://localhost:8081",options)
		socketRef.current.emit("getChat",({project_id, client_chat_length : chat.length}));
		socketRef.current.on("chat",(data)=>{
			setChat(data);
		})
	},[])
	useEffect(
		() => {
			socketRef.current = socketRef.current = io.connect("http://localhost:8081",options)
			socketRef.current.emit("getChat",({project_id, client_chat_length : chat.length}));
			socketRef.current.on("chat"+project_id,(data)=>{
				setChat(data);
			})
			socketRef.current.on("message" + project_id, ({ name, message }) => {
				console.log(chat);
				setChat([ ...chat, { name, message } ])
			})
			return () => socketRef.current.disconnect()
		},
		[ chat ]
	)

	const onTextChange = (e) => {
		setState({ ...state, [e.target.name]: e.target.value })
	}

	const onMessageSubmit = (e) => {
		const { name, message } = state;
		if(message.trim() !== "")
		{
			socketRef.current.emit("message", { name, message, project_id})
			let chat_msg = {name,message}
			updateChat(chat_msg,project_id).then((data) => {
				if (data.error) {
					console.log(data.error);
				} else {
					console.log(data.message);
				}
			});
		}
		e.preventDefault()
		setState({ message: "", name })
	}

	const renderChat = () => {
		return chat.map(({ name, message }, index) => (
			<div key={index}>
				<h4>
					{name}: <span>{message}</span>
				</h4>
			</div>
		))
	}

	return (
		<div className="card">
				<div className="render-chat">
					<h3>Chat Room</h3>
					{renderChat()}
				</div>
				{ status !== "Completed" ? (
					<form onSubmit={onMessageSubmit}>
					<Row >
						<Col>
							<TextField
								name="message"
								onChange={(e) => onTextChange(e)}
								value={state.message}
								id="outlined-multiline-static"
								variant="outlined"
								label="Message"
							/>
						</Col>
						<Col>
							<button class="btn btn-primary">Send Message <SendIcon /></button>
						</Col>
					</Row>
				</form>
				) : (<div> Chat has been disabled</div>)
				}
		</div>
	)
}

export default Chat;



// import TextField from "@material-ui/core/TextField"
// import React, { useEffect, useRef, useState } from "react"
// import io from "socket.io-client";
// import { getCurrentUser } from "./../user/apiUser";
// import "./Chat.css";

// var options = {
//     rememberUpgrade: true,
//     transports: ["websocket"],
//     secure: true,
//     rejectUnauthorized: false,
// };

// const socketio = io("http://localhost:8081", options);

// function Chat() {
// 	const [ state, setState ] = useState({ message: "", name: getCurrentUser().name })
// 	const [ chat, setChat ] = useState([])

	
// 	// const socketRef = useRef()

// 	// useEffect(
// 	// 	() => {
// 	// 		socketRef.current = socketio;
// 	// 		socketRef.current.on("message", ({ name, message }) => {
// 	// 			setChat([ ...chat, { name, message } ])
// 	// 		})
// 	// 		return () => socketRef.current.disconnect()
// 	// 	},
// 	// 	[ chat ]
// 	// )

// 	socketio.on("message", ({ name, message }) => {
// 		setChat([ ...chat, { name, message } ])
// 	})

// 	const onTextChange = (e) => {
// 		setState({ ...state, [e.target.name]: e.target.value })
// 	}

// 	const onMessageSubmit = (e) => {
// 		const { name, message } = state
// 		socketio.emit("message", { name, message })
		
// 		e.preventDefault()
// 		setState({ message: "", name })
// 		// console.log(chat)
// 	}

// 	const renderChat = () => {
//         // console.log(chat);
// 		return chat.map(({ name, message }, index) => (
// 			<div key={index}>
// 				<h4>
// 					{name}: <span>{message}</span>
// 				</h4>
// 			</div>
// 		))
// 	}

// 	return (
// 		<div className="card">
// 			<div className="row">
// 				<form onSubmit={onMessageSubmit}>
// 					<div>
// 						<TextField
// 							name="message"
// 							onChange={(e) => onTextChange(e)}
// 							value={state.message}
// 							id="outlined-multiline-static"
// 							variant="outlined"
// 							label="Message"
// 						/>
// 					</div>
// 					<button>Send Message</button>
// 				</form>
// 				<div className="render-chat">
// 					<h3>Chat Log</h3>
// 					{renderChat()}
// 				</div>
// 			</div>
// 		</div>
// 	)
// }

// export default Chat;