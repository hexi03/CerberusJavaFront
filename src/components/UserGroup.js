import React, { useEffect } from 'react';
import { Form, Button, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { navigate } from 'react-router-dom';
import { createNewUserAction, fetchOneUserAction, updateUserAction, fetchAllUsersAction } from '../actions/userActions';
import { createNewGroupAction, fetchOneGroupAction, updateGroupAction, fetchAllGroupsAction } from '../actions/groupActions';

const UserGroupManagementPanel = () => {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();

  // Рендер формы для создания нового пользователя
  const renderUserCreateForm = () => {
    const onSubmit = (data) => {
      dispatch(createNewUserAction(data));
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
  const renderUserUpdateForm = () => {
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
  const renderUserList = () => {
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
  const renderGroupCreateForm = () => {
    const onSubmit = (data) => {
      dispatch(createNewGroupAction(data));
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
  const renderGroupUpdateForm = () => {
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
  const renderGroupList = () => {
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

  return (
    <>
      <h2>User Management</h2>
      {renderUserCreateForm()}
      {renderUserUpdateForm()}
      {renderUserList()}

      <h2>Group Management</h2>
      {renderGroupCreateForm()}
      {renderGroupUpdateForm()}
      {renderGroupList()}
    </>
  );
};
