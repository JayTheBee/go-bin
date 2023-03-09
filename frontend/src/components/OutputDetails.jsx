import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import axios from 'axios'
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { CalendarDate, EyeFill } from 'react-bootstrap-icons';
import Container from 'react-bootstrap/Container';

function Details ({paste}) {
	console.log("paste in det is ", paste)
	const createdAt = new Date(paste.created);
	const createdDate = createdAt.toLocaleDateString();
	const createdTime = createdAt.toLocaleTimeString();
	const expireDate = new Date(createdAt.getTime() + (paste.expiry*1000*60))
	
	return(
		<>
		<Container fluid="md" className="mx-5 mt-5">
		<h3>{paste.title}</h3>
			<CalendarDate color="royalblue" size={20} /> {createdDate} {createdTime}
			<EyeFill color="royalblue" size={20} className="ms-3"/> {paste.views}
			<Card className="mt-3" >
				<ListGroup variant="flush">
				<ListGroup.Item style={{ fontFamily: 'Courier New' }}>{paste.body}</ListGroup.Item>
				</ListGroup>
				{!(paste.expiry === -1) && <Card.Footer className="text-muted">Expires by: {expireDate.toLocaleDateString()} </Card.Footer>}
			</Card>
		</Container>

		</>
	)
}

function PrivateOutput({getData, paste}) {
	const [passAlert, setPassAlert] = useState() //alert
	const [err, setErr] = useState()		// password is empty, show warning
	const [show, setShow] = useState(true) 		//show Modals, inverse with details
	const [pass, setPass] = useState('')

	const params = useParams()

	const handleSubmit = async (e) => {
		e.preventDefault()

		if(pass === ""){
			setErr(true)

		}
		else{
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

					// password is correct
					setPassAlert(false)

					// close down modal
					setShow(false)

					//get Data
					getData()
				}else{

					//wrong password
					setPassAlert(true)

					// open modal
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

				{passAlert && 
				<>
					<Alert variant="danger" onClose={() => setPassAlert(false)} dismissible>
						<Alert.Heading>Incorrect Password!</Alert.Heading>
					</Alert>
				</>
				
				}
				<Form noValidate className='mx-3' onSubmit={handleSubmit}>
					<Form.Group className="mb-3" controlId="password">
						<Form.Label>Enter Password</Form.Label>
						<Form.Control isInvalid={err} type="password" placeholder="Password" value={pass} onChange={(e) => {setPass(e.target.value); setErr(false)}}/>
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
	
}



function OutputDetails() {
	const [priv, setPriv] = useState()
	const params = useParams()

	const [paste, setPaste] = useState({
		body: "",
		created: "",
		expiry: -1,
		title: "",
		url: "",
		views: 0
	})




	const getVis = async () => {
		try {
			const { data } = await axios.get(`http://localhost:3002/gobin/checkvis/${params.id}`)
			
			if(data) {
				setPriv(true)
			}else{
				setPriv(false)
				getData()
			}
		} catch (error) {
			console.log("error is ", error)
		}
	};	

	const getData = async () => {
		try {
			const { data } = await axios.get(`http://localhost:3002/gobin/${params.id}`)
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
		return (
			<>
			{console.log("i am inside priv") }
			<PrivateOutput getData={getData} paste={paste}/>
			</>
		)
	}

	return(
		<>
			{console.log("i am inside pub")}
			<Details paste={paste}/>
		</>
	)


	

}

export default OutputDetails