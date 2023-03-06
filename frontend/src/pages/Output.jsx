import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import axios from 'axios'
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function Output() {
	const [show, setShow] = useState(true)
	const [paste, setPaste] = useState({})
	const [pass, setPass] = useState('')
	const params = useParams()

	let priv = true

	const handleClose = () => setShow(false);

	const getVis = async () => {
		try {
			const {data} = await axios.get(`http://localhost:3002/gobin/checkvis/${params.id}`)
			if(data==="true"){
				//private
				priv = true

			}else{
				//public
				setPaste(getData())
			}
		}catch (err){
			console.log(err)
		}
	}

	const getData = async () => {
		try {
			const { data } = await axios.get(`http://localhost:3002/gobin/${params.id}`)
			console.log("logging in ", data)
			return(data)
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		getVis();
	   }, []);
	 
	useEffect(() => {
		console.log("Updated data: ", [paste]);
	 }, [paste]);

	if(priv){
		const handleSubmit = async (e) => {
			e.preventDefault()
			try {
				const head = { 'Content-Type': 'application/json' }
				const {data} = await axios.get(`http://localhost:3002/gobin/checkpass/${params.id}`, {password:pass}, head)
				if(data==="true"){
					//password is right
					setShow(false)
					await setPaste(getData())
					console.log("data is ", paste)
				}else{
					//password is false
				}
				}catch (err){
					console.log(err)
			}			
		}
		return(
			<>


				<Modal show={show} >
				<Modal.Header closeButton>
					<Modal.Title>Paste Authentication</Modal.Title>
				</Modal.Header>
				<Modal.Body>

				<Form className='mx-3' onSubmit={handleSubmit}>
					<Form.Group className="mb-3" controlId="password">
						<Form.Label>Enter Password</Form.Label>
						<Form.Control type="password" placeholder="Password" value={pass} onChange={(e) => setPass(e.target.value)}/>
					</Form.Group>	
					<Button variant="primary" type="submit" >
						Submit
					</Button>	
				</Form>

				</Modal.Body>
				</Modal>

				{!show && 
					<h3>sneed</h3>
				}


			</>
		)
	}

	return(
		<>
		<h3>feed</h3>
		<p>title: {paste.title}</p>
		<p>body: {paste.body}</p>
		<p>url: {paste.url}</p>
		</>
	)
	

}

export default Output