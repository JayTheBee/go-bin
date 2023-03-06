import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';



function FormDetails() {
	const [valid, setValid] =  useState(true);
	const navigate = useNavigate()
	const [expire, setExpire] = useState(false)
	const [form, setForm] = useState({
		title:"",
		body:'',
		private:false,
		password:'',
		expiry:-1
	})
	
	const setBody = (value) => {
		setForm({
		  ...form,  body: value})
		setValid(true)
	   }
	 

	const checkErrors = () => {
		const { body } = form
		const priv = form.private 
		if(!priv){
			form.password = ""
		}
		if(!expire) {
			form.expiry = -1
		}

		if(!body) return false
		else return true
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		const errs = checkErrors()
		if(!errs){
			setValid(errs)
		}
		else{
			console.log("logging in")
			const head = { 'Content-Type': 'application/json' }
			console.log("payload form is ", form)
			const res = await axios.post('http://localhost:3002/gobin', form, head).catch((error) => console.log(error))
			
			console.log("res is ", res)
			console.log("res.data is ", res.data)
			setForm({
				title:"",
				body:'',
				private:false,
				password:'',
				expiry:-1
			})
			
			navigate('/' + res.data.url)
		}
	   }
	
  return (
    <Form noValidate className='mx-3' onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="title">
        <Form.Label>Title</Form.Label>
        <Form.Control type="email" placeholder="Optional title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})}/>
      </Form.Group>


	 <Form.Group className="mb-3" controlId="body" >
        <Form.Label>Body</Form.Label>
        <Form.Control isInvalid={!valid} as="textarea" rows={5} placeholder="Enter text" value={form.body} onChange={(e) => setBody(e.target.value)}/>
	   <Form.Control.Feedback type="invalid">
		Please enter text before submitting.
     	</Form.Control.Feedback>
      </Form.Group>

	 <Form.Group className="mb-3" controlId="privacy">
		<Form.Label>Private:</Form.Label>
		<Form.Control as="select"  value={form.private} 
		onChange={(e) => setForm({...form, private: (e.target.value==="true")})}>
			<option value="true">Yes</option>
			<option value="false">No</option>
		</Form.Control>
	</Form.Group>
	
	{form.private &&
		<Form.Group className="mb-3" controlId="password">
		 <Form.Label>Password</Form.Label>
		 <Form.Control type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})}/>
	    	</Form.Group>
	}

	<Form.Group className="mb-3" controlId="expire">
		<Form.Label>Expire:</Form.Label>
		<Form.Control as="select"  value={expire} onChange={e => setExpire(e.target.value==="true")}>
			<option value="true">Yes</option>
			<option value="false">No</option>
		</Form.Control>
	</Form.Group>

	{expire &&
		<Form.Group className="mb-3" controlId="expiry">
			<Form.Label>Expires by:</Form.Label>
			<Form.Control
				type="date"
				name="expiry"
				placeholder="Expires by"
				value={form.expiry}
				onChange={(e) => setForm({...form, expiry: e.target.value})}
			/>
		</Form.Group>	
	}


      <Button variant="primary" type="submit" >
        Submit
      </Button>
    </Form>
  );
}

export default FormDetails;