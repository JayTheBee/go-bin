import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import axios from 'axios'
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

function Details ({paste}) {
	console.log("paste in det is ", paste)
	return(
		<>
			<h3>feed</h3>
			<p>title: {paste.title}</p>
			<p>body: {paste.body}</p>
			<p>url: {paste.url}</p>
		</>
	)
}


function Output() {
	const [correct, setCorrect] = useState(true)
	const [valid, setValid] = useState(true)

	const [show, setShow] = useState(true)
	const [paste, setPaste] = useState({
		body: "",
		created: "",
		expiry: -1,
		private: false,
		title: "",
		url: "",
		views: 0
	})
	const [pass, setPass] = useState('')
	const params = useParams()

	let priv = true

	const getVis = async () => {
		try {
			const { data } = await axios.get(`http://localhost:3002/gobin/checkvis/${params.id}`)
			console.log("vis is ", data)
			
			if(data === "true") {
				priv = true
			}else{
				priv = false
				getData()
			}

		} catch (error) {
			console.log("error is ", error)
		}
	};	

	const getData = async () => {
		try {
			const { data } = await axios.get(`http://localhost:3002/gobin/${params.id}`)
			console.log("data is ", data)
			setPaste(data)
		} catch (error) {
			console.log("error is ", error)
		}
	}


	
	useEffect(() => {
		getVis()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	 
	if(priv){
		const handleSubmit = async (e) => {
			e.preventDefault()
			if(pass === ""){
				setValid(false)

			}else{
				const config = {
					headers: {
					   'Content-Type': 'application/json',
					} 
				}	
				axios.post(`http://localhost:3002/gobin/checkpass/${params.id}`, { password: pass }, config)
				.then( (response) => {
					setPass('')
					console.log("resp data is ", response.data)
					if(response.data){
						setCorrect(true)
						setShow(false)
						getData()
					}else{
						setCorrect(false)
						setShow(true)
					}
				}).catch((err) => console.log(err))
			}




		}
		return(
			<>
				<Modal show={show} >
				<Modal.Header >
					<Modal.Title>Paste Authentication</Modal.Title>
				</Modal.Header>
				<Modal.Body>

				{!correct && 
				<>
				     <Alert variant="danger" onClose={() => setCorrect(true)} dismissible>
						<Alert.Heading>Incorrect Password!</Alert.Heading>
					</Alert>
				</>
				
				}
				<Form noValidate className='mx-3' onSubmit={handleSubmit}>
					<Form.Group className="mb-3" controlId="password">
						<Form.Label>Enter Password</Form.Label>
						<Form.Control isInvalid={!valid} type="password" placeholder="Password" value={pass} onChange={(e) => {setPass(e.target.value); setValid(true)}}/>
						<Form.Control.Feedback type="invalid">
							Please enter password before submitting.
						</Form.Control.Feedback>
					</Form.Group>	
					
					<Button variant="primary" type="submit" >
						Submit
					</Button>	
				</Form>

				</Modal.Body>
				</Modal>

				{!show && <Details paste={paste}/>}
			</>
		)
	}else{

		return(<Details paste={paste}/>)
}

	

}

export default Output