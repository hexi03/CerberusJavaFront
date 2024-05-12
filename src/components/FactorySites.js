import {useNavigate, useParams} from "react-router";

import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import {Link, useSearchParams} from "react-router-dom";
import { Container, Form, Button, Row, Col, ListGroup } from 'react-bootstrap';
import {
    createFactorySiteAction, deleteFactorySiteAction,
    fetchAllFactorySiteAction, fetchOneFactorySiteAction,
    onDeleteFactorySiteAction, updateFactorySiteAction, updateFactorySiteSupplyAction
} from "../actions/factorySiteActions.js";

import {
    fetchAllWareHouseAction
} from "../actions/wareHouseActions.js";
import {FactorySiteBuilder} from "../builders/factorySiteBuilder.js";

import {FactorySiteSupplyBuilder} from "../builders/factorySiteSupplyBuilder.js";



const NotFound = () => {
  return (
    <Container className="mt-5">

        <h1>Упс, страница не найдена</h1>
        <p className="lead">Увы, производственный участок, который вы ищете, не найден.</p>
        <p>Проверьте правильность URL адреса или вернитесь на <Link to="/Home">главную страницу</Link>.</p>

    </Container>
  );
};

const CreateForm = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const departmentId = props.departmentId;
  const onSubmit = (data) => {
    console.log(data);
    dispatch(createFactorySiteAction((new FactorySiteBuilder()).setDepartmentId(data.departmentId).setName(data.name).build()));
    navigate(-1);
  };

  return (
    <Container className="mt-5">
      <h2>Форма создания производственного участка</h2>
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
            Название производственного участка
          </Form.Label>
          <Col md={10}>
            <Form.Control
              {...register("name", { required: 'Поле обязательно для заполнения' })}
              type="text"
              placeholder="Название производственного участка"
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
  const factorySiteId = props.id;

  useEffect(() => {
    dispatch(fetchOneFactorySiteAction(factorySiteId));
  }, [dispatch, factorySiteId]);

  const factorySite = useSelector(state => state.factorySite.factorySites[factorySiteId]);

  const onSubmit = (data) => {
    dispatch(updateFactorySiteAction((new FactorySiteBuilder()).setName(data.name).setId(factorySiteId).build()));
    navigate(-1);
  };

  if (!factorySite) return <NotFound />;

  return (
    <Container className="mt-5">
      <h2>Форма обновления производственного участка</h2>
      <hr />

      <Form onSubmit={handleSubmit(onSubmit)}>

        <Form.Group as={Row} controlId="formName">
          <Form.Label column md={2}>
            Название производственного участка
          </Form.Label>
          <Col md={10}>
            <Form.Control
              {...register("name", { required: 'Поле обязательно для заполнения' })}
              type="text"
              placeholder="Название производственного участка"
              defaultValue={factorySite.name}
              isInvalid={errors.name}
            />
            <Form.Control.Feedback type="invalid">{errors.name && errors.name.message}</Form.Control.Feedback>
          </Col>
        </Form.Group>

        <input type="hidden" name="factorySiteId" value={factorySiteId} />

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
  const factorySiteId = props.id;

  useEffect(() => {
    dispatch(fetchOneFactorySiteAction(factorySiteId));
  }, [dispatch, factorySiteId]);

  const factorySite = useSelector(state => state.factorySite.factorySites[factorySiteId]);

  const deleteCb = () => {
    dispatch(deleteFactorySiteAction(factorySite));
    navigate(-1);
  };

  if (!factorySite) {
    return <NotFound />;
  }

  return (
    <Container className="mt-5">
      <h2>Форма удаления производственного участка</h2>
      <hr />


        <h4>{factorySite.name}</h4>

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
  const factorySiteId = props.id;

  useEffect(() => {
    dispatch(fetchOneFactorySiteStateAction(factorySiteId));
  }, [dispatch, factorySiteId]);

  const factorySite = useSelector(state => state.factorySite.factorySites[factorySiteId]);

  if (!factorySite) return <NotFound />;

  return (
    <Container className="mt-5">
      <h2>Форма просмотра деталей производственного участка</h2>
      <hr />

      <ul>
        <li><b>Наименование: </b>{factorySite.name}</li>
      </ul>

      <FactorySiteState id={factorySiteId}/>

      <Button onClick={() => navigate(-1)} variant="secondary">
        Обратно
      </Button>
    </Container>
  );
};


const FactorySiteState = (props) => {
  const dispatch = useDispatch();
  const factorySiteId = props.id;

  useEffect(() => {
    dispatch(fetchOneFactorySiteAction(factorySiteId));
  }, [dispatch, factorySiteId]);

  const factorySite = useSelector(state => state.factorySite.factorySites[factorySiteId].state);

  if (!factorySite && !factorySite.state) return <NotFound />;

  const factorySiteState = factorySite.state;

  const renderProblems = () => {
    if (!factorySiteState.problems || factorySiteState.problems.length === 0) {
      return (<h4>Проблем не найдено</h4>);
    }

    return (
      <div>
        <h3>Проблемы:</h3>
        <ul>
          {factorySiteState.problems.map((problem, index) => (
            <li key={index}>{problem}</li>
          ))}
        </ul>
      </div>
    );
  };

  const renderWarnings = () => {
    if (!factorySiteState.warnings || factorySiteState.warnings.length === 0) {
      return (<h4>Ошибок не найдено</h4>);
    }

    return (
      <div>
        <h3>Предупреждения:</h3>
        <ul>
          {factorySiteState.warnings.map((warning, index) => (
            <li key={index}>{warning}</li>
          ))}
        </ul>
      </div>
    );
  };

  const renderReports = () => {
    if (!factorySiteState.reports || factorySiteState.reports.length === 0) {
      return (<h4>Отчетов не найдено</h4>);
    }

    return (
      <div>
        <h3>Список отчетов:</h3>
        <ul>
          {factorySiteState.reports.map((report, index) => (
            <li key={index}>{report}</li>
          ))}
        </ul>
      </div>
    );
  };



  return (
    <Container className="mt-5">
      <h2>Состояние производственного участка</h2>
      {renderProblems()}
      {renderWarnings()}
      {renderReports()}
    </Container>
  );
};

const Index = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllFactorySiteAction());
  }, [dispatch]);
  const departmentId = props.departmentId;
  const { factorySites } = useSelector(state => state.factorySite);
  const { departments } = useSelector(state => state.department);

  return (
    <Container className="mt-5">


      <h2>Список производственных участоков</h2>
      <hr />
      <div className="d-flex flex-row-reverse">
        <Link to={{ pathname: "/FactorySites/create", search: `?id=${departmentId}` }}>
              <Button variant="primary">Создание производственного участка</Button>
          </Link>
      </div>
      <hr />

      {Object.keys(factorySites).filter((factorySiteId) => factorySites[factorySiteId].departmentId === departmentId).map(id => (
        <Row key={id} className="mb-2">
          <Col>
            <Link to={{ pathname: "/FactorySites/details", search: `?id=${factorySites[id].id}` }}>
              {factorySites[id].name}
            </Link>{" "}
            |{" "}
            <Link to={{ pathname: "/FactorySites/update", search: `?id=${factorySites[id].id}` }}>
              Изменение
            </Link>{" "}
            |{" "}
            <Link to={{ pathname: "/FactorySites/delete", search: `?id=${factorySites[id].id}` }}>
              Удаление
            </Link>{" "}
            |{" "}
            <Link to={{ pathname: "/FactorySites/supplyManage", search: `?id=${factorySites[id].id}` }}>
                Управление снабжением
            </Link>
          </Col>
        </Row>
      ))}
    </Container>
  );
};


function SupplyManage(props) {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const factorySiteId = props.id;

  useEffect(() => {
    dispatch(fetchOneFactorySiteAction(factorySiteId));
    dispatch(fetchAllWareHouseAction());
  }, [dispatch, factorySiteId]);



  const factorySite = useSelector(state => state.factorySite.factorySites[factorySiteId]);
  const {wareHouses} = useSelector(state => {return state.wareHouse});



  // Состояние для отслеживания выбранных поставщиков
  const [selectedSuppliers, setSelectedSuppliers] = useState(factorySite?.suppliers || []);

  const [selectedWareHouses, setSelectedWareHouses] = useState([]);
  const [deSelectedWareHouses, setDeSelectedWareHouses] = useState([]);

  useEffect(() => {
    console.log(selectedSuppliers);
    console.log(wareHouses);
    setSelectedWareHouses(Object.keys(wareHouses).filter((id) => (selectedSuppliers.includes(wareHouses[id].id))).map((id) => wareHouses[id]));
    setDeSelectedWareHouses(Object.keys(wareHouses).filter((id) => !(selectedSuppliers.includes(wareHouses[id].id))).map((id) => wareHouses[id]));
  }, [wareHouses, selectedSuppliers]);

    useEffect(() => {
    console.log("selectedWareHouses");
    console.log(selectedWareHouses);
    console.log("deSelectedWareHouses");
    console.log(deSelectedWareHouses);
  }, [selectedWareHouses, deSelectedWareHouses]);



  const handleSupplierChange = (deselect, selectedSupplierId) => {
    console.log(deselect);
    console.log(selectedSupplierId);
    setSelectedSuppliers((prevSuppliers) => {

      if (deselect) {
        // Удаляем поставщика, если он уже выбран
        return prevSuppliers.filter((supplierId) => supplierId !== selectedSupplierId);
      } else {
        // Добавляем нового поставщика
        return [...prevSuppliers, selectedSupplierId];
      }
    });
  };

  const onSubmit = () => {
    dispatch(updateFactorySiteSupplyAction(factorySiteId, selectedSuppliers.reduce((sup, whId) => sup.addSupplier(whId).build(), new FactorySiteSupplyBuilder())));
    navigate(-1);
  };

  if (!factorySite) return <NotFound />;

  return (
    <Container className="mt-5">
      <h2>Форма управления снабжением участка</h2>
      <hr />


          <h3>
          Управление поставщиками
          </h3>
          Возможные
          <ListGroup>
            {deSelectedWareHouses.map((warehouse) => (
                <ListGroup.Item
                  onClick={(e) => handleSupplierChange(false, warehouse.id)}
                  id = {warehouse.id}
                >
                {warehouse.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
          Выбранные
          <ListGroup>
            {selectedWareHouses.map((warehouse) => (
                <ListGroup.Item
                  id = {warehouse.id}
                  onClick={(e) => handleSupplierChange(true, warehouse.id)}

                >
                {warehouse.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
            <Button type="button" variant="primary" onClick={onSubmit}>
              Обновить
            </Button> | <Button type="button" onClick={() => navigate(-1)} variant="secondary">
              Отменить
            </Button>
    </Container>
  );
}


export const FactorySites = () => {
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
        case 'supplyManage':
            content = <SupplyManage id = {id} />;
            break;
        default:
            content = <div>Invalid operation</div>;
            break;
    }
    return (content);
};
