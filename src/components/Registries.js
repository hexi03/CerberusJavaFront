
import React, { useState, useEffect } from 'react';
import { Button, Modal, Table } from 'react-bootstrap';

import {useNavigate, useParams} from "react-router";

import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import {Link, useSearchParams} from "react-router-dom";
import { Container, Form, Button, Row, Col, ListGroup } from 'react-bootstrap';

const RegistriesPanel = () => {
  const {name, operation} = useParams();
    const [queryParameters] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    let content;
    console.log("operation:");
    console.log(operation);

    console.log("name:");
    console.log(name);

    console.log(id);

    const renderItemsPanel = () => {

            const renderItemCreateForm = () => {
                const onSubmit = (data) => {
                    dispatch(createItemAction((new ItemBuilder()).setName(data.name).build()));
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
        }

        const renderItemUpdateForm = () => {
            const id = params.id;
            useEffect(() => {
                dispatch(fetchOneItemAction(id));
            }, [dispatch, id]);

            const item = useSelector(state => state.items.item[id]);

            const onSubmit = (data) => {
                dispatch(updateItemAction((new ItemBuilder()).setName(data.name).setId(id).build()));
                navigate(-1);
            };

            return (
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group controlId="formBasicName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" defaultValue={item.name} {...register('name')} />
                    </Form.Group>
                    <Button variant="primary" type="submit">Submit</Button>
                </Form>
            );
        }

        const renderItemList = () => {
            useEffect(() => {
                dispatch(fetchAllItemAction());
            }, [dispatch]);

            const items = useSelector(state => state.items);

            return (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        );
        }



        switch (operation) {
            case 'create':
                content = renderItemCreateForm();
                break;
            case 'update':
                content = renderItemUpdateForm();
                break;
            default:
                content = renderItemList();
                break;
        }
        return (content);
    }

    const renderProductPanel = () => {

        const renderProductCreateForm = () => {
            const { register, handleSubmit, formState: { errors } } = useForm();
            const onSubmit = (data) => {
                dispatch(createProductAction((new ProductBuilder()).setProducedItemId(data.producedItemId).setRequirementIds(data.requirementIds).build()));
                navigate(-1);
            };

            const items = useSelector(state => state.items);

            return (
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group controlId="formBasicName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" defaultValue={product.name} {...register('name')} />
                    </Form.Group>
                    <Button variant="primary" type="submit">Submit</Button>
                </Form>
                );

        }

        const renderProductUpdateForm = () => {
            const { register, handleSubmit, formState: { errors } } = useForm();
            const id = queryParameters.get("id");
            useEffect(() => {
                dispatch(fetchOneProductAction(id));
            }, [dispatch]);

            const product = useSelector(state => state.products.product[id]);

            const items = useSelector(state => state.items);

            const onSubmit = (data) => {
                dispatch(updateProductAction((new ProductBuilder()).setProducedItemId(data.producedItemId).setRequirementIds(data.requirementIds).setId(id).build()));
                navigate(-1);
            };

            return (
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group controlId="formBasicName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" defaultValue={product.name} {...register('name')} />
                    </Form.Group>
                    <Button variant="primary" type="submit">Submit</Button>
                </Form>
                );

        }

        const renderProductList = () => {
            useEffect(() => {
                dispatch(fetchAllProductAction());
            }, [dispatch]);

            const products = useSelector(state => state.products);

            return (
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Name</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                        <td>{product.producedItem.name}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                );
            };
        }

        switch (operation) {
            case 'create':
                content = renderProductCreateForm();
                break;
            case 'update':
                content = renderProductUpdateForm();
                break;
            default:
                content = renderProductList();
                break;
        }
        return (content);
    }

    switch (name) {
        case 'item':
            content = renderItemsPanel()
            break;
        case 'product':
            content = renderProductPanel()
            break;
        default:
            content = <div>Invalid registry name</div>;
            break;
        }

    return (content);
};




export default RegistriesPanel;
