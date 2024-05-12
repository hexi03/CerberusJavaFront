import {useNavigate, useParams} from "react-router";

import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import {Link, useSearchParams} from "react-router-dom";
import {
    createWareHouseAction, deleteWareHouseAction,
    fetchAllWareHouseAction, fetchOneWareHouseAction,
    onDeleteWareHouseAction, updateWareHouseAction
} from "../actions/wareHouseActions.js";
import {WareHouseBuilder} from "../builders/wareHouseBuilder.js";

import { Container, Form, Button, Row, Col, Accordion, Card, Pagination, Spinner } from 'react-bootstrap';

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

      <ul>
        <li><b>Наименование: </b>{wareHouse.name}</li>
      </ul>

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
  }, [dispatch, wareHouseId]);

  const wareHouse = useSelector(state => state.wareHouse.wareHouses[wareHouseId].state);

  if (!wareHouse && !wareHouse.state) return <NotFound />;

  const wareHouseState = wareHouse.state;

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
    if (!wareHouseState.reports || wareHouseState.reports.length === 0) {
      return (<h4>Отчетов не найдено</h4>);
    }

    return (
      <div>
        <h3>Список отчетов:</h3>

          {wareHouseState.reports.map((report, index) => (
            <Row>
              <Col key={index}>
                <Link to={{ pathname: "/Report/details", search: `?id=${wareHouses[id].id}` }}>
                    {report.name}
                </Link>{" "}
              </Col>
              <Col key={index}>
                    {report.createdAt}
              </Col>
            </Row>
          ))}

      </div>
    );
  };



  const warehouseStorageState = () => {
    const [currentPage, setCurrentPage] = useState(1);

    const wareHouseStorageState = wareHouseState.storage;

    // Вычисление индексов начала и конца текущей страницы
    const indexOfLastItem = currentPage * itemsPerStorageListPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerStorageListPage;
    const currentItems = wareHouseStorageState.slice(indexOfFirstItem, indexOfLastItem);

    // Массив страниц
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(wareHouseStorageState.length / itemsPerStorageListPage); i++) {
      pageNumbers.push(i);
    }

    const handlePaginationClick = (pageNumber) => {
      setCurrentPage(pageNumber);
    };

    return (
      <div className="mt-5">
        <h2>Складированное</h2>
        {wareHouseStorageState.length === 0 ? (
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        ) : (
          <>
            <Accordion defaultActiveKey="0">
              {currentItems.map((item, index) => (
                <Card key={index}>
                  <Accordion.Toggle as={Card.Header} eventKey={index.toString()}>
                    {item.name}
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey={index.toString()}>
                    <Card.Body>{item.amount}</Card.Body>
                  </Accordion.Collapse>
                </Card>
              ))}
            </Accordion>
            <Pagination>
              {pageNumbers.map(number => (
                <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePaginationClick(number)}>
                  {number}
                </Pagination.Item>
              ))}
            </Pagination>
          </>
        )}
      </div>
    );
  };

  return (
    <Container className="mt-5">
      <h2>Состояние склада</h2>
      {renderProblems()}
      {renderWarnings()}
      {renderReports()}
      {warehouseStorageState()}
    </Container>
  );
};




export default WarehouseState;

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
