import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';



function FormDetails() {
	const navigate = useNavigate()
	
	const [errors, setErrors] =  useState({})
	const [expire, setExpire] = useState(false)
	const [vis, setVis] = useState(false)
	const [dateHolder, setDateHolder] = useState('')

	const [form, setForm] = useState({
		title:"",
		body:'',
		password:'',
		expiry:-1
	})
	
	const handleBody = (value) => {
		setForm({...form,  body: value})
		if(!!errors.body) setErrors({...errors, body: null})
	}
	 
	const handleExpiry = (value) => {
		setExpire(value)
		if(!!errors.expiry) setErrors({...errors, expiry: null})
		if(!value){
			setForm({...form, expiry: -1})
		}
	}
	
	const handlePrivacy = (value) => {
		setVis(value)
		if(!!errors.password) setErrors({...errors, password: null})
		if(!value){
			setForm({...form, password: ''})
		}
	}


	const dateConverter = (timeEnd) => {
		const newEndDate= new Date(timeEnd);
		const minutes = 1000*60;
		const result = Math.ceil((newEndDate.getTime()-Date.now())/(minutes))
		console.log('date Converter result ', result)
		if (result < 0 ) {return 0}
		return result
	   }
	

	const handleExpireDate = (value) => {
		setDateHolder(value)
		const expmins = dateConverter(value)
		setForm({...form, expiry: expmins})
	}

	const checkErrors = () => {
		const { body, expiry, password } = form
		const newErrors = {}
		if(vis){
			if ( !password || password === '' ) newErrors.password = 'Password cannot be blank!'
		}
		if(expire){
			if(expiry === -1) newErrors.expiry = 'Need to set an expiration date!'
		}
		if ( !body || body === '' ) newErrors.body = 'Text cannot be blank!'
		return newErrors

	}
		

	const handleSubmit = async (e) => {
		e.preventDefault();

		const errs = checkErrors()
		console.log("errors is" , errors)
		console.log("expire is ", expire)
		console.log("form is ", form)

		if(Object.keys(errs).length > 0){
			setErrors(errs)
		}

		else{
			console.log("logging in expiry is ", form.expiry)
			console.log("payload form is ", form)
			try {
				const config = {
					headers: {
					   'Content-Type': 'application/json',
					} 
				}	
				console.log("logging in")
				console.log("payload form is ", form)		

				const res = await axios.post(`${process.env.REACT_APP_BACKEND_ADDRESS}/gobin`, form, config)

				console.log("res is ", res)
				console.log("res.data is ", res.data)
				
				navigate('/' + res.data.url)

			} catch (err) {

				console.log(err)
			}

			
		}
	   }
	
  return (

<Container fluid className="mx-auto">
	<Form noValidate className='mx-3' onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="title">
        <Form.Label>Title</Form.Label>
        <Form.Control type="email" placeholder="Optional title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})}/>
      </Form.Group>


	 <Form.Group className="mb-3" controlId="body" >
        <Form.Label>Body</Form.Label>
        <Form.Control isInvalid={!!errors.body} as="textarea" rows={5} placeholder="Enter text" value={form.body} onChange={(e) => handleBody(e.target.value)}/>
	   <Form.Control.Feedback type="invalid">
		{ errors.body }
     	</Form.Control.Feedback>
      </Form.Group>

	 <Form.Group className="mb-3" controlId="privacy">
		<Form.Label>Private:</Form.Label>
		<Form.Control as="select"  value={vis} onChange={(e) => handlePrivacy(e.target.value==="true")}>
			<option value="true">Yes</option>
			<option value="false">No</option>
		</Form.Control>
	</Form.Group>
	
	{vis &&
		<Form.Group className="mb-3" controlId="password">
		 <Form.Label>Password</Form.Label>
		 <Form.Control isInvalid={!!errors.password} type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})}/>
		 <Form.Control.Feedback type="invalid">
			{ errors.password }
		 </Form.Control.Feedback>
	    	</Form.Group>
	}

	<Form.Group className="mb-3" controlId="expire">
		<Form.Label>Expire:</Form.Label>
		<Form.Control as="select"  value={expire} onChange={e => handleExpiry(e.target.value==="true")}>
			<option value="true">Yes</option>
			<option value="false">No</option>
		</Form.Control>
	</Form.Group>

	{expire &&
		<Form.Group className="mb-3" controlId="expiry">
			<Form.Label>Expires by:</Form.Label>
			<Form.Control
				min={new Date().toISOString().slice(0, 10)}
				isInvalid={!!errors.expiry}
				type="date"
				name="expiry"
				placeholder="Expires by"
				value={dateHolder}
				onChange={(e) => handleExpireDate(e.target.value)}
			/>
			<Form.Control.Feedback type="invalid">
			{ errors.expiry }
			</Form.Control.Feedback>
		</Form.Group>	
	}

      <Button variant="primary" type="submit" >
        Submit
      </Button>
    </Form>
</Container>

    
  );
}

export default FormDetails;