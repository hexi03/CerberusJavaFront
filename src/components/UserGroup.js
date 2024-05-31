import {useNavigate, useParams} from "react-router";

import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, useFieldArray } from 'react-hook-form';
import {Link, useSearchParams} from "react-router-dom";
import { Container, Form, Button, Row, Col, ListGroup, Table, Card, Accordion} from 'react-bootstrap';
import { createUserAction, fetchOneUserAction, updateUserAction, deleteUserAction, fetchAllUsersAction } from '../actions/userActions.js';
import { createGroupAction, fetchOneGroupAction, updateGroupAction, deleteGroupAction, fetchAllGroupsAction, updateGroupCompositionAction } from '../actions/groupActions.js';
import { UserBuilder } from "../builders/userBuilder.js";
import { GroupBuilder } from "../builders/groupBuilder.js";

export const UserGroupManagementPanel = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { operation, name } = useParams();
    const [queryParameters] = useSearchParams();
    const id = queryParameters.get("id");

    let content;

    const RenderUserCreateForm = () => {
        const { register, handleSubmit } = useForm();
        const onSubmit = (data) => {
            dispatch(createUserAction((new UserBuilder).setId(id).setName(data.name).setPassword(data.password).setEmail(data.email).build()));
            navigate(-1);
        };

        return (
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group controlId="formBasicName">
                    <Form.Label>Имя</Form.Label>
                    <Form.Control type="text" {...register('name')} />
                </Form.Group>

                <Form.Group controlId="email">
                    <Form.Label>Эл. почта</Form.Label>
                    <Form.Control type="email" {...register('email')} />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Пароль</Form.Label>
                    <Form.Control type="password" {...register('password')} />
                </Form.Group>



                <Button variant="primary" type="submit">Сохранить</Button>
                <Button variant="secondary" onClick={() => navigate(-1)}>Обратно</Button>
            </Form>
        );
    };

    const RenderUserUpdateForm = () => {
        const { register, handleSubmit, setValue } = useForm();

        useEffect(() => {
            dispatch(fetchOneUserAction(id));
        }, [dispatch, id]);

        const user = useSelector(state => state.user.users[id]);


        useEffect(() => {
            if (user) {
                setValue('name', user.name);
                setValue('password', user.password);
                setValue('email', user.email);
            }
        }, [user, setValue]);

        const onSubmit = (data) => {
            dispatch(updateUserAction((new UserBuilder).setId(id).setName(data.name).setPassword(data.password).setEmail(data.email).build()));
            navigate(-1);
        };

        if (!user) return <></>
        return (
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group controlId="formBasicName">
                    <Form.Label>Имя</Form.Label>
                    <Form.Control type="text" {...register('name')} />
                </Form.Group>

                <Form.Group controlId="email">
                    <Form.Label>Эл. почта</Form.Label>
                    <Form.Control type="email" {...register('email')} />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Пароль</Form.Label>
                    <Form.Control type="password" {...register('password')} />
                </Form.Group>

                <Button variant="primary" type="submit">Сохранить</Button>
                <Button variant="secondary" onClick={() => navigate(-1)}>Обратно</Button>

            </Form>
        );
    };

    const RenderUserList = () => {
        useEffect(() => {
            dispatch(fetchAllUsersAction());
        }, [dispatch]);

        const users = useSelector(state => state.user.users);

        return (
            <Card>
                <Card.Header>
                    <h3>Список поьзователей</h3>
                    <Button variant="primary" href="/UserGroup/user/create">Создать пользователя</Button>
                </Card.Header>
                <Card.Body>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Наименование</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(users).map(key => (
                                <tr key={key}>
                                    <td><a href={`/UserGroup/user/details?id=${key}`}>{users[key].name}</a></td>
                                    <td>
                                        <a href={`/UserGroup/user/update?id=${key}`}>Редактировать</a> | <a href={`/UserGroup/user/delete?id=${key}`}>Удалить</a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        );
    };

    const RenderUserDetails = () => {
        useEffect(() => {
            dispatch(fetchOneUserAction(id));
            dispatch(fetchAllGroupsAction())
        }, [dispatch, id]);

        const user = useSelector(state => state.user.users[id]);
        const groups = useSelector(state => state.group.groups);

        if (!user) return <></>

        return user ? (
            <Card>
                <Card.Header>
                    <h3>Детали пользователя</h3>
                </Card.Header>
                <Card.Body>
                    <p><strong>Имя:</strong> {user.name}</p>

                    <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="0">
                        <Accordion.Header>Группы</Accordion.Header>
                        <Accordion.Body>
                        <ul>
                        {user.groupIds && user.groupIds.length ? user.groupIds.map(groupId => (
                            <li key={groupId}>{groups[groupId]?.name}</li>
                        )) : "Ничего"}
                        </ul>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
                    <Button variant="secondary" onClick={() => navigate(-1)}>Обратно</Button>

                </Card.Body>
            </Card>
        ) : <p>Loading...</p>;
    };

    const RenderUserDeleteForm = () => {
        useEffect(() => {
            dispatch(fetchOneUserAction(id));
        }, [dispatch, id]);

        const user = useSelector(state => state.user.users[id]);

        const handleDelete = () => {
            dispatch(deleteUserAction(id));
            navigate(-1);
        };
        if (!user) return <></>

        return user ? (
            <Card>
                <Card.Header>
                    <h3>Удаление пользователя</h3>
                </Card.Header>
                <Card.Body>
                    <p>Вы действительно хотите <b>удалить</b> пользователя <strong>{user.name}</strong>?</p>
                    <Button variant="danger" onClick={handleDelete}>Удалить</Button>
                    <Button variant="secondary" onClick={() => navigate(-1)}>Отмена</Button>
                </Card.Body>
            </Card>
        ) : <p>Loading...</p>;
    };

    const RenderGroupCreateForm = () => {
        const { register, handleSubmit } = useForm();

        const onSubmit = (data) => {
            dispatch(createGroupAction((new GroupBuilder).setName(data.name).build()));
            navigate(-1);
        };

        useEffect(() => {
            dispatch(fetchAllUsersAction());
        }, [dispatch]);


        return (
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group controlId="formBasicName">
                    <Form.Label>Наименование</Form.Label>
                    <Form.Control type="text" {...register('name')} />
                </Form.Group>
                <Button variant="primary" type="submit">Сохранить</Button>
            </Form>
        );
    };

    const RenderGroupUpdateForm = () => {
        const { register, handleSubmit, setValue } = useForm();


        useEffect(() => {
            dispatch(fetchOneGroupAction(id));
            dispatch(fetchAllUsersAction());
        }, [dispatch, id]);

        const group = useSelector(state => state.group.groups[id]);

        useEffect(() => {
            if (group) {
                setValue('name', group.name);
            }
        }, [group, setValue]);

        const onSubmit = (data) => {
            dispatch(updateGroupAction((new GroupBuilder).setId(id).setName(data.name).build()))
            navigate(-1);
        };

        if (!group) return <p>Loading...</p>

        return (
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group controlId="formBasicName">
                    <Form.Label>Наименование</Form.Label>
                    <Form.Control type="text" {...register('name')} />
                </Form.Group>
                <Button variant="primary" type="submit">Сохранить</Button>
            </Form>
        );
    };

    const RenderGroupList = () => {
        useEffect(() => {
            dispatch(fetchAllGroupsAction());
        }, [dispatch]);

        const groups = useSelector(state => state.group.groups);

        return (
            <Card>
                <Card.Header>
                    <h3>Список групп</h3>
                    <Button variant="primary" href="/UserGroup/group/create">Создать группу</Button>
                </Card.Header>
                <Card.Body>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Наименование</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(groups).map(key => (
                                <tr key={key}>

                                    <td><a href={`/UserGroup/group/details?id=${key}`}>{groups[key].name}</a></td>
                                    <td>
                                        <a href={`/UserGroup/group/update?id=${key}`}>Редактировать</a> | <a href={`/UserGroup/group/updateComposition?id=${key}`}>Редактировать состав</a> | <a href={`/UserGroup/group/delete?id=${key}`}>Удалить</a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        );
    };

    const RenderGroupDetails = () => {
        useEffect(() => {
            dispatch(fetchOneGroupAction(id));
            dispatch(fetchAllUsersAction());
        }, [dispatch, id]);

        const group = useSelector(state => state.group.groups[id]);
        return group ? (
            <Card>
                <Card.Header>
                    <h3>Детали группы</h3>
                </Card.Header>
                <Card.Body>
                    <p><strong>Name:</strong> {group.name}</p>
                    <Button variant="secondary" onClick={() => navigate(-1)}>Обратно</Button>
                </Card.Body>
            </Card>
        ) : <p>Loading...</p>;
    };

    const RenderGroupDeleteForm = () => {
        useEffect(() => {
            dispatch(fetchOneGroupAction(id));
        }, [dispatch, id]);

        const group = useSelector(state => state.group.groups[id]);

        const handleDelete = () => {
            dispatch(deleteGroupAction(id));
            navigate(-1);
        };


        return group ? (
            <Card>
                <Card.Header>
                    <h3>Удалить группу</h3>
                </Card.Header>
                <Card.Body>
                    <p>Вы уверены, что хотите <b>удалить</b> <strong>{group.name}</strong>?</p>
                    <Button variant="danger" onClick={handleDelete}>Delete</Button>
                    <Button variant="secondary" onClick={() => navigate(-1)}>Отмена</Button>
                </Card.Body>
            </Card>
        ) : <p>Loading...</p>;
    };


    const RenderGroupUpdateCompositionForm = () => {
        const { register, handleSubmit, control } = useForm();
        const { fields, append, remove } = useFieldArray({
            control,
            name: "users"
        });

        useEffect(() => {
            dispatch(fetchOneGroupAction(id));
            dispatch(fetchAllUsersAction());
        }, [dispatch, id]);

        const group = useSelector(state => state.group.groups[id]);
        const users = useSelector(state => state.user.users);

        useEffect(() => {
            if (group) {
                group.userIds.forEach(user => append({ id: user }));
            }
        }, [group, append]);

        const onSubmit = (data) => {
            dispatch(updateGroupCompositionAction({
                id: id,
                userIds: data.users.map((u) => u.id)
            }))
            navigate(-1);
        };

        if (!group) return <></>
        return (
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group controlId="formUsers">
                    <Form.Label>Пользователи</Form.Label>
                    {fields.map((field, index) => (
                        <div key={field.id} className="d-flex mb-2">
                            <Form.Control as="select" {...register(`users.${index}.id`)}>
                                <option value="">Выбрать пользователя</option>
                                {Object.keys(users).map(key => (
                                    <option key={key} value={key}>{users[key].name}</option>
                                ))}
                            </Form.Control>
                            <Button variant="danger" onClick={() => remove(index)}>Удалить</Button>
                        </div>
                    ))}
                    <Button variant="secondary" onClick={() => append({ id: "" })}>Добавить пользователя</Button>
                </Form.Group>
                <Button variant="primary" type="submit">Сохранить</Button>
                <Button variant="secondary" onClick={() => navigate(-1)}>Обратно</Button>
            </Form>
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
                case 'updateComposition':
                    content = RenderGroupUpdateCompositionForm();
                    break;
                case 'delete':
                    content = RenderGroupDeleteForm();
                    break;
                default:
                    content = <div>Invalid operation</div>;
                    break;
            }
            break;
        default:
            content = <div>Invalid registry name</div>;
            break;
    }

    return content;
};

