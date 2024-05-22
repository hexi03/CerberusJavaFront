import {useNavigate, useParams} from "react-router";
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import React, {useEffect, useState} from 'react';
import { login } from "../actions/authActions.js";
import {Link, useSearchParams} from "react-router-dom";
import {AuthStatus} from "../authStatus.js"


export const Login = (props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const navigate = useNavigate()
  const [queryParameters] = useSearchParams()

  const onSuccessCb = () => {
        navigate("/");
    }
  const onButtonClick = () => {
    login({email : email, password : password}, onSuccessCb)
  }

  var msg = "";
  switch(queryParameters.get("status")){
    case AuthStatus.UNAUTHORIZED:
      msg = "Вы не авторизованы"
      break;
    case AuthStatus.SESSION_DEAD:
      msg = "Время жизни сессии истекло. Авторизируйтесь заново"
      break;
    case AuthStatus.BAD_CREDENTIALS:
      msg = "Вы ввели неверные учетные данные"
      break;
    default:
      msg = ""
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center text-danger">
        {msg}
      </Row>
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 className="text-center">Login</h2>
          <Form>
            <Form.Group controlId="formBasicEmail" className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email here"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                isInvalid={!!emailError}
              />
              <Form.Control.Feedback type="invalid">
                {emailError}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formBasicPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password here"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                isInvalid={!!passwordError}
              />
              <Form.Control.Feedback type="invalid">
                {passwordError}
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" onClick={onButtonClick} className="w-100">
              Log in
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
