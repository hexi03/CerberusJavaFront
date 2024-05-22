

import {useNavigate, useParams} from "react-router";

import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, useFieldArray } from 'react-hook-form';
import {Link, useSearchParams} from "react-router-dom";
import { Container, Form, Button, Row, Col, ListGroup, Modal, Table, Accordion } from 'react-bootstrap';

import {ItemBuilder} from "../builders/itemBuilder.js";
import {ProductBuilder} from "../builders/productBuilder.js";

import { createItemAction, fetchOneItemAction, updateItemAction, fetchAllItemsAction } from '../actions/itemActions.js';

import { createProductAction, fetchOneProductAction, updateProductAction, fetchAllProductAction } from '../actions/productActions.js';

export const RegistriesPanel = (props) => {
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

    const RenderItemsPanel = () => {
        const RenderItemCreateForm = () => {
            const { register, handleSubmit, formState: { errors } } = useForm();
            const onSubmit = (data) => {
                dispatch(createItemAction((new ItemBuilder()).setName(data.name).setUnits(data.units).build()));
                navigate(-1);
            };

            return (
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group controlId="formBasicName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" {...register('name')} />
                        <Form.Label>Units</Form.Label>
                        <Form.Control type="text" {...register('units')} />
                    </Form.Group>
                    <Button variant="primary" type="submit">Submit</Button>
                </Form>
            );
        }

        const RenderItemUpdateForm = () => {
            const { register, handleSubmit, formState: { errors } } = useForm();
            useEffect(() => {
                dispatch(fetchOneItemAction(id));
            }, [dispatch, id]);

            const item = useSelector(state => state.item.items[id]);

            const onSubmit = (data) => {
                dispatch(updateItemAction((new ItemBuilder()).setName(data.name).setUnits(data.units).setId(id).build()));
                navigate(-1);
            };

            return (
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group controlId="formBasicName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" defaultValue={item.name} {...register('name')} />

                        <Form.Label>Units</Form.Label>
                        <Form.Control type="text" defaultValue={item.units} {...register('units')} />
                    </Form.Group>
                    <Button variant="primary" type="submit">Submit</Button>
                </Form>
            );
        }

        const RenderItemList = () => {
            useEffect(() => {
                dispatch(fetchAllItemsAction());
            }, [dispatch]);

            const items = useSelector(state => state.item.items);

            return (
                <div>
                <div style = {{"display": "flex", "justify-content": "flex-end"}}><Link to={{pathname: "/Registries/item/create"}}><Button variant="primary">Создать</Button></Link></div>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(items).map(key => (
                            <tr key={key}>
                                <td>{items[key].name}</td>
                                <td>
                                    <Link to={{pathname: "/Registries/item/update", search: `?id=${key}`}}>Изменить</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                </div>
            );
        }

        let content;
        switch (operation) {
            case 'create':
                content = <RenderItemCreateForm/>;
                break;
            case 'update':
                content = <RenderItemUpdateForm/>;
                break;
            default:
                content = <RenderItemList/>;
                break;
        }
        return (content);
    }

    const RenderProductPanel = () => {

        const RenderProductCreateForm = () => {
        const { register, handleSubmit, control } = useForm();
        const { fields, append, remove } = useFieldArray({
            control,
            name: 'requirements'
        });
        const dispatch = useDispatch();
        const navigate = useNavigate();

        useEffect(() => {
            dispatch(fetchAllItemsAction());
        }, [dispatch]);

        const items = useSelector(state => state.item.items);

        const onSubmit = (data) => {
            const requirementEntries = data.requirements.reduce((acc,req) => {
                acc[req.itemId] = req.amount;
                return acc;
            }, {});
            dispatch(createProductAction((new ProductBuilder()).setProducedItemId(data.producedItemId).setRequirementIds(requirementEntries).build()));
            navigate(-1);
        };

        return (
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group controlId="formProducedItem">
                    <Form.Label>Produced Item</Form.Label>
                    <Form.Control as="select" {...register('producedItemId')}>
                        {Object.keys(items).map(key => (
                            <option key={key} value={key}>{items[key].name}</option>
                        ))}
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="formRequirements">
                    <Form.Label>Requirements</Form.Label>
                    {fields.map((field, index) => (
                        <div key={field.itemId} className="d-flex mb-2">
                            <Form.Control as="select" {...register(`requirements.${index}.itemId`)} className="me-2">
                                {Object.keys(items).map(key => (
                                    <option key={key} value={key}>{items[key].name}</option>
                                ))}
                            </Form.Control>
                            <Form.Control type="number" {...register(`requirements.${index}.amount`)} className="me-2" placeholder="Amount" />
                            <Button variant="danger" onClick={() => remove(index)}>Remove</Button>
                        </div>
                    ))}
                    <Button variant="secondary" onClick={() => append({ itemId: '', amount: 1 })}>Add Requirement</Button>
                </Form.Group>
                <Button variant="primary" type="submit">Submit</Button>
            </Form>
        );
    }
    const RenderProductUpdateForm = () => {
        const { register, handleSubmit, control, formState: { errors } } = useForm();
        const { fields, append, remove } = useFieldArray({
            control,
            name: "requirements"
        });
        const dispatch = useDispatch();
        const navigate = useNavigate();

        const product = useSelector(state => state.product.products[id]);
        const items = useSelector(state => state.item.items);

        const onSubmit = (data) => {
            const requirementEntries = data.requirements.reduce((acc,req) => {
                acc[req.itemId] = req.amount;
                return acc;
            }, {});
            dispatch(updateProductAction((new ProductBuilder()).setProducedItemId(data.producedItemId).setRequirementIds(requirementEntries).setId(id).build()));
            navigate(-1);
        };

        useEffect(() => {
            dispatch(fetchOneProductAction(id));
            dispatch(fetchAllItemsAction());
        }, [dispatch, id]);

        useEffect(() => {
            if (product) {
                const requirements = Object.keys(product.requirementIds).map(key => ({ itemId: key, amount: product.requirementIds[key] }));
                requirements.forEach(req => append(req));
            }
        }, [product]);
        console.log(product);

        if(!product) return (<></>)

        return (
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group controlId="formProducedItem">
                    <Form.Label>Produced Item</Form.Label>
                    <Form.Control as="select" value={product.producedItemId} {...register('producedItemId')}>
                        {Object.keys(items).map(key => (
                            <option key={key} value={key}>{items[key].name}</option>
                        ))}
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="formRequirements">
                    <Form.Label>Requirements</Form.Label>
                    {fields.map((item, index) => (
                        <div key={item.itemId} className="d-flex mb-2">
                            <Form.Control as="select" {...register(`requirements.${index}.itemId`)}>
                                {Object.keys(items).map(key => (
                                    <option key={key} value={key}>{items[key].name}</option>
                                ))}
                            </Form.Control>
                            <Form.Control type="number" placeholder="Amount" defaultValue={item.amount} {...register(`requirements.${index}.amount`)} />
                            <Button variant="danger" onClick={() => remove(index)}>Remove</Button>
                        </div>
                    ))}
                    <Button variant="secondary" onClick={() => append({ itemId: "", amount: 1 })}>Add Requirement</Button>
                </Form.Group>
                <Button variant="primary" type="submit">Submit</Button>
            </Form>
        );
    }

        const RenderProductList = () => {
            useEffect(() => {
                dispatch(fetchAllProductAction());
                dispatch(fetchAllItemsAction());
            }, [dispatch]);

            const products = useSelector(state => state.product.products);
            const items = useSelector(state => state.item.items);

            return (
                <div>
                <div style = {{"display": "flex", "justify-content": "flex-end"}}><Link to={{pathname: "/Registries/product/create"}}><Button variant="primary">Создать</Button></Link></div>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Requirements</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(products).map(key => (
                           <>
                            { items && products && products[key] && products[key].producedItemId && items[products[key].producedItemId] ? <>
                            <tr key={products[key].id}>

                                <td>{items[products[key].producedItemId].name}</td>
                                <td>
                                    <Accordion>
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header>Requirements</Accordion.Header>
                                            <Accordion.Body>
                                                <ul>
                                                    {Object.keys(products[key].requirementIds).map(reqId => (
                                                        <li key={reqId}>{items[reqId].name} : {products[key].requirementIds[reqId]}</li>
                                                    ))}
                                                </ul>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                </td>
                                <td>
                                    <Link to={{pathname: "/Registries/product/update", search: `?id=${key}`}}>Изменить</Link>
                                </td>
                            </tr>
                            </> : <></>}</>
                        ))}
                    </tbody>
                </Table>
                </div>
            );
        };



        let content;
        switch (operation) {
            case 'create':
                content = <RenderProductCreateForm/>;
                break;
            case 'update':
                content = <RenderProductUpdateForm/>;
                break;
            default:
                content = <RenderProductList/>;
                break;
        }
        return (content);

    };



    switch (name) {
        case 'item':
            content = <RenderItemsPanel/>
            break;
        case 'product':
            content = <RenderProductPanel/>
            break;
        default:
            content = <div>Invalid registry name</div>;
            break;
    }

    return (content);
};




export default RegistriesPanel;
