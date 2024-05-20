import {useNavigate, useParams} from "react-router";

import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import {Link, useSearchParams} from "react-router-dom";
import {
    createWareHouseAction, deleteWareHouseAction,
    fetchAllWareHouseAction, fetchOneWareHouseAction,
    fetchOneWareHouseStateAction,
    updateWareHouseAction
} from "../actions/wareHouseActions.js";
import {WareHouseBuilder} from "../builders/wareHouseBuilder.js";

import { Container, Form, Button, Row, Col, Accordion, Card, Pagination, Spinner, ListGroup } from 'react-bootstrap';
import { fetchAllItemsAction } from "../actions/itemActions.js";
import { ReportList } from "./Reports.js";
import { ReportType } from "../builders/reportTypes.js";

const itemsPerStorageListPage = 5;

const NotFound = () => {
  return (
    <Container className="mt-5">

        <h1>Упс, страница не найдена</h1>
        <p className="lead">Увы, склад, который вы ищете, не найден.</p>
        <p>Проверьте правильность URL адреса или вернитесь на <Link to="/Home">главную страницу</Link>.</p>

    </Container>
  );
};

const CreateForm = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const departmentId = props.departmentId;
  console.log("departmentId");
  console.log(departmentId);
  const onSubmit = (data) => {
    console.log(data);
    dispatch(createWareHouseAction((new WareHouseBuilder()).setDepartmentId(data.departmentId).setName(data.name).build()));
    navigate(-1);
  };

  return (
    <Container className="mt-5">
      <h2>Форма создания склада</h2>
      <hr />

      <Form onSubmit={handleSubmit(onSubmit)}>

        <Form.Control
              {...register("departmentId", { required: '' })}
              type="hidden"
              placeholder="departmentId"
              isInvalid={errors.name}
              value={departmentId}
            />
        <Form.Group as={Row} controlId="formName">
          <Form.Label column md={2}>
            Название склада
          </Form.Label>
          <Col md={10}>
            <Form.Control
              {...register("name", { required: 'Поле обязательно для заполнения' })}
              type="text"
              placeholder="Название склада"
              isInvalid={errors.name}
            />
            <Form.Control.Feedback type="invalid">{errors.name && errors.name.message}</Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Col md={{ span: 10, offset: 2 }}>
            <Button type="submit" variant="primary">
              Создать
            </Button> | <Button type="button" onClick={() => navigate(-1)} variant="secondary">
              Отменить
            </Button>
          </Col>
        </Form.Group>

      </Form>
    </Container>
  );
};


function UpdateForm(props) {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const wareHouseId = props.id;

  useEffect(() => {
    dispatch(fetchOneWareHouseAction(wareHouseId));
  }, [dispatch, wareHouseId]);

  const wareHouse = useSelector(state => state.wareHouse.wareHouses[wareHouseId]);

  const onSubmit = (data) => {
    dispatch(updateWareHouseAction((new WareHouseBuilder()).setName(data.name).setId(wareHouseId).build()));
    navigate(-1);
  };

  if (!wareHouse) return <NotFound />;

  return (
    <Container className="mt-5">
      <h2>Форма обновления склада</h2>
      <hr />

      <Form onSubmit={handleSubmit(onSubmit)}>

        <Form.Group as={Row} controlId="formName">
          <Form.Label column md={2}>
            Название склада
          </Form.Label>
          <Col md={10}>
            <Form.Control
              {...register("name", { required: 'Поле обязательно для заполнения' })}
              type="text"
              placeholder="Название склада"
              defaultValue={wareHouse.name}
              isInvalid={errors.name}
            />
            <Form.Control.Feedback type="invalid">{errors.name && errors.name.message}</Form.Control.Feedback>
          </Col>
        </Form.Group>

        <input type="hidden" name="wareHouseId" value={wareHouseId} />

        <Form.Group as={Row}>
          <Col md={{ span: 10, offset: 2 }}>
            <Button type="submit" variant="primary">
              Обновить
            </Button> | <Button type="button" onClick={() => navigate(-1)} variant="secondary">
              Отменить
            </Button>
          </Col>
        </Form.Group>

      </Form>
    </Container>
  );
}


const DeleteConfirmation = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wareHouseId = props.id;

  useEffect(() => {
    dispatch(fetchOneWareHouseAction(wareHouseId));
  }, [dispatch, wareHouseId]);

  const wareHouse = useSelector(state => state.wareHouse.wareHouses[wareHouseId]);

  const deleteCb = () => {
    dispatch(deleteWareHouseAction(wareHouse));
    navigate(-1);
  };

  if (!wareHouse) {
    return <NotFound />;
  }

  return (
    <Container className="mt-5">
      <h2>Форма удаления склада</h2>
      <hr />


        <h4>{wareHouse.name}</h4>

      <Button variant="danger" onClick={deleteCb} className="mr-2">
        Удалить
      </Button> | <Button variant="secondary" onClick={() => navigate(-1)}>
        Отменить
      </Button>
    </Container>
  );
};


const Details = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wareHouseId = props.id;

  useEffect(() => {
    dispatch(fetchOneWareHouseAction(wareHouseId));
  }, [dispatch, wareHouseId]);

  const wareHouse = useSelector(state => state.wareHouse.wareHouses[wareHouseId]);

  if (!wareHouse) return <NotFound />;

  return (
    <Container className="mt-5">
      <h2>Форма просмотра деталей склада</h2>
      <hr />

      <h4>
        <b>Наименование: </b>{wareHouse.name}
      </h4>

      <WareHouseState id={wareHouseId}/>

      <Button onClick={() => navigate(-1)} variant="secondary">
        Обратно
      </Button>
    </Container>
  );
};


const WareHouseState = (props) => {
  const dispatch = useDispatch();
  const wareHouseId = props.id;

  useEffect(() => {
    dispatch(fetchOneWareHouseStateAction(wareHouseId));
    dispatch(fetchAllItemsAction());

  }, [dispatch, wareHouseId]);


  const [currentPage, setCurrentPage] = useState(1);

  const wareHouseState = useSelector(state => state.wareHouseState.states[wareHouseId]);

  const items = useSelector(state => state.item.items);
    console.log("Айтемы: ");
  console.log(items);
  if (!wareHouseState) {
    return <NotFound />;
  }

  const renderProblems = () => {
    if (!wareHouseState.problems || wareHouseState.problems.length === 0) {
      return (<h4>Проблем не найдено</h4>);
    }

    return (
      <div>
        <h3>Проблемы:</h3>
        <ul>
          {wareHouseState.problems.map((problem, index) => (
            <li key={index}>{problem}</li>
          ))}
        </ul>
      </div>
    );
  };

  const renderWarnings = () => {
    if (!wareHouseState.warnings || wareHouseState.warnings.length === 0) {
      return (<h4>Ошибок не найдено</h4>);
    }

    return (
      <div>
        <h3>Предупреждения:</h3>
        <ul>
          {wareHouseState.warnings.map((warning, index) => (
            <li key={index}>{warning}</li>
          ))}
        </ul>
      </div>
    );
  };

  const renderReports = () => {

    const queryParams = {
      typeCriteria: ReportType.WH_GENERIC,
      locationSpecificId: wareHouseState.id
    }

    return (
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Список отчетов:</Accordion.Header>
          <Accordion.Body>
            <Card>
              <ReportList queryParams = {queryParams}/>
            </Card>
        </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  };

  const renderStorageState = () => {


    const wareHouseStorageState = wareHouseState.storageState;
    console.log("Состояние хранилища: ")
    console.log(wareHouseStorageState);
    const indexOfLastItem = currentPage * itemsPerStorageListPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerStorageListPage;
    const currentWHStorageStateKeys = Object.keys(wareHouseStorageState).slice(indexOfFirstItem, indexOfLastItem);
    console.log("набор ключей страницы состояния хранилища склада: ");
    console.log(currentWHStorageStateKeys);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(wareHouseStorageState.length / itemsPerStorageListPage); i++) {
      pageNumbers.push(i);
    }

    const handlePaginationClick = (pageNumber) => {
      setCurrentPage(pageNumber);
    };

    return (
      <div className="mt-5">
        <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Складированное:</Accordion.Header>
          <Accordion.Body>
        {wareHouseStorageState.length === 0 ? (
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        ) : (
          <>

          <table>
          <thead>
          <tr>
              <th>Наименование</th>
              <th>Количество</th>
          </tr>
          </thead>
          <tbody>
          {Object.keys(currentWHStorageStateKeys).map((index) => {
                        const whStorageStateKey = currentWHStorageStateKeys[index];
                        const amount = wareHouseStorageState[whStorageStateKey];
                        const item = items[whStorageStateKey];
                        console.log("Ключ: " + whStorageStateKey);
                        console.log("Количество: " + amount);
                        console.log("Айтем: ");
                        console.log(item);
                        return (
                          <tr key={whStorageStateKey}>
                            <td>{item.name}</td>
                            <td>{amount}</td>
                          </tr>
                      )})}
          </tbody>
          </table>

            <Pagination>
              {pageNumbers.map(number => (
                <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePaginationClick(number)}>
                  {number}
                </Pagination.Item>
              ))}
            </Pagination>
          </>
        )}
        </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      </div>
    );
  };

  return (
    <Container className="mt-5">
      <h2>Состояние склада</h2>
      {renderProblems()}
      {renderWarnings()}
      {renderReports()}
      {renderStorageState()}
    </Container>
  );
};





const Index = (props) => {
  const dispatch = useDispatch();
    const departmentId = props.departmentId;
  useEffect(() => {
    dispatch(fetchAllWareHouseAction());
  }, [dispatch]);

  const { wareHouses } = useSelector(state => state.wareHouse);
  const { departments } = useSelector(state => state.department);
  return (
    <Container className="mt-5">


      <h2>Список складов</h2>
      <hr />
      <div className="d-flex flex-row-reverse">
        <Link to="">

        </Link>
          <Link to={{ pathname: "/WareHouses/create", search: `?id=${departmentId}` }}>
              <Button variant="primary">Создание склада</Button>
          </Link>
      </div>
      <hr />

      {Object.keys(wareHouses).filter((wareHouseId) => wareHouses[wareHouseId].departmentId === departmentId).map(id => (
        <Row key={id} className="mb-2">
          <Col>
            <Link to={{ pathname: "/WareHouses/details", search: `?id=${wareHouses[id].id}` }}>
              {wareHouses[id].name}
            </Link>{" "}
            |{" "}
            <Link to={{ pathname: "/WareHouses/update", search: `?id=${wareHouses[id].id}` }}>
              Изменить
            </Link>{" "}
            |{" "}
            <Link to={{ pathname: "/WareHouses/delete", search: `?id=${wareHouses[id].id}` }}>
              Удалить
            </Link>
          </Col>
        </Row>
      ))}
    </Container>
  );
};


export const WareHouses = () => {
    const {operation} = useParams();
    const [queryParameters] = useSearchParams();
    const id = queryParameters.get("id");
    let content;
    console.log("operation:");
    console.log(operation);
    console.log(id);
    switch (operation) {
        case 'index':
            content = <Index departmentId = {id}/>;
            break;
        case 'details':
            content = <Details id = {id} />;
            break;
        case 'create':
            content = <CreateForm departmentId = {id}/>;
            break;
        case 'update':
            content = <UpdateForm id = {id} />;
            break;
        case 'delete':
            content = <DeleteConfirmation id = {id} />;
            break;
        default:
            content = <div>Invalid operation</div>;
            break;
    }
    return (content);
};
