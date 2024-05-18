import {useNavigate, useParams} from "react-router";

import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import {Link, useSearchParams} from "react-router-dom";
import { Container, Form, Button, Row, Col, ListGroup, Table} from 'react-bootstrap';
import { createUserAction, fetchOneUserAction, updateUserAction, fetchAllUsersAction } from '../actions/userActions.js';
import { createGroupAction, fetchOneGroupAction, updateGroupAction, fetchAllGroupsAction } from '../actions/groupActions.js';

export const UserGroupManagementPanel = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const {operation, name} = useParams();
    const [queryParameters] = useSearchParams();
    const id = queryParameters.get("id");


    let content;
    console.log("operation:");
    console.log(operation);

    console.log("name:");
    console.log(name);

    console.log(id);

  // Рендер формы для создания нового пользователя
  const RenderUserCreateForm = () => {
    const onSubmit = (data) => {
      dispatch(createUserAction(data));
      navigate(-1);
    };

    return (
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" {...register('name')} />
        </Form.Group>
        <Button variant="primary" type="submit">Submit</Button>
      </Form>
    );
  };

  // Рендер формы для обновления информации о пользователе
  const RenderUserUpdateForm = () => {
    // Здесь вы можете использовать useParams() для получения id пользователя из URL
    // Пока примерно:
    const userId = 123; // Ваш ID пользователя
    useEffect(() => {
      dispatch(fetchOneUserAction(userId));
    }, [dispatch, userId]);

    const user = useSelector(state => state.users.user[userId]);

    const onSubmit = (data) => {
      dispatch(updateUserAction(data, userId));
      navigate(-1);
    };

    return (
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" defaultValue={user.name} {...register('name')} />
        </Form.Group>
        <Button variant="primary" type="submit">Submit</Button>
      </Form>
    );
  };

  // Рендер списка пользователей
  const RenderUserList = () => {
    useEffect(() => {
      dispatch(fetchAllUsersAction());
    }, [dispatch]);

    const users = useSelector(state => state.users);

    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  // Рендер формы для создания новой группы
  const RenderGroupCreateForm = () => {
    const onSubmit = (data) => {
      dispatch(createGroupAction(data));
      navigate(-1);
    };

    return (
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" {...register('name')} />
        </Form.Group>
        <Button variant="primary" type="submit">Submit</Button>
      </Form>
    );
  };

  // Рендер формы для обновления информации о группе
  const RenderGroupUpdateForm = () => {
    // Здесь вы можете использовать useParams() для получения id группы из URL
    // Пока примерно:
    const groupId = 456; // Ваш ID группы
    useEffect(() => {
      dispatch(fetchOneGroupAction(groupId));
    }, [dispatch, groupId]);

    const group = useSelector(state => state.groups.group[groupId]);

    const onSubmit = (data) => {
      dispatch(updateGroupAction(data, groupId));
      navigate(-1);
    };

    return (
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" defaultValue={group.name} {...register('name')} />
        </Form.Group>
        <Button variant="primary" type="submit">Submit</Button>
      </Form>
    );
  };

  // Рендер списка групп
  const RenderGroupList = () => {
    useEffect(() => {
      dispatch(fetchAllGroupsAction());
    }, [dispatch]);

    const groups = useSelector(state => state.groups);

    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {groups.map(group => (
            <tr key={group.id}>
              <td>{group.name}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

switch (name) {
  case 'user':
    switch (operation) {
          case 'index':
              content = RenderUserList();
              break;
          case 'details':
              content = RenderUserDetails();
              break;
          case 'create':
              content = RenderUserCreateForm();
              break;
          case 'update':
              content = RenderUserUpdateForm();
              break;
          case 'delete':
              content = RenderUserDeleteForm();
              break;
          default:
              content = <div>Invalid operation</div>;
              break;
    }
    break;
  case 'group':
            switch (operation) {
          case 'index':
              content = RenderGroupList();
              break;
          case 'details':
              content = RenderGroupDetails();
              break;
          case 'create':
              content = RenderGroupCreateForm();
              break;
          case 'update':
              content = RenderGroupUpdateForm();
              break;
          case 'delete':
              content = RenderGroupDeleteForm();
              break;
          default:
              content = <div>Invalid operation</div>;
              break;
      }
  }
};
