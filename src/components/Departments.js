import {useNavigate, useParams} from "react-router";

import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import {Link, useSearchParams} from "react-router-dom";
import {
    createDepartmentAction, deleteDepartmentAction,
    fetchAllDepartmentAction, fetchOneDepartmentAction,
    updateDepartmentAction
} from "../actions/departmentActions.js";
import {DepartmentBuilder} from "../builders/departmentBuilder.js";

import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { fetchAllFactorySiteAction } from "../actions/factorySiteActions.js";
import { fetchAllWareHouseAction } from "../actions/wareHouseActions.js";

const NotFound = () => {
  return (
    <Container className="mt-5">

        <h1>Упс, страница не найдена</h1>
        <p className="lead">Увы, отдел, который вы ищете, не найден.</p>
        <p>Проверьте правильность URL адреса или вернитесь на <Link to="/Home">главную страницу</Link>.</p>

    </Container>
  );
};

const CreateForm = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    dispatch(createDepartmentAction((new DepartmentBuilder()).setName(data.name).build()));
    navigate(-1);
  };

  return (
    <Container className="mt-5">
      <h2>Форма создания отдела</h2>
      <hr />

      <Form onSubmit={handleSubmit(onSubmit)}>

        <Form.Group as={Row} controlId="formName">
          <Form.Label column md={2}>
            Название отдела
          </Form.Label>
          <Col md={10}>
            <Form.Control
              {...register("name", { required: 'Поле обязательно для заполнения' })}
              type="text"
              placeholder="Название отдела"
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
  const departmentId = props.id;

  useEffect(() => {
    dispatch(fetchOneDepartmentAction(departmentId));
  }, [dispatch, departmentId]);

  const department = useSelector(state => state.department.departments[departmentId]);

  const onSubmit = (data) => {
    dispatch(updateDepartmentAction((new DepartmentBuilder()).setName(data.name).setId(departmentId).build()));
    navigate(-1);
  };

  if (!department) return <NotFound />;

  return (
    <Container className="mt-5">
      <h2>Форма обновления отдела</h2>
      <hr />

      <Form onSubmit={handleSubmit(onSubmit)}>

        <Form.Group as={Row} controlId="formName">
          <Form.Label column md={2}>
            Название отдела
          </Form.Label>
          <Col md={10}>
            <Form.Control
              {...register("name", { required: 'Поле обязательно для заполнения' })}
              type="text"
              placeholder="Название отдела"
              defaultValue={department.name}
              isInvalid={errors.name}
            />
            <Form.Control.Feedback type="invalid">{errors.name && errors.name.message}</Form.Control.Feedback>
          </Col>
        </Form.Group>

        <input type="hidden" name="department_id" value={departmentId} />

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
  const departmentId = props.id;

  useEffect(() => {
    dispatch(fetchOneDepartmentAction(departmentId));
  }, [dispatch, departmentId]);

  const department = useSelector(state => state.department.departments[departmentId]);

  const deleteCb = () => {
    dispatch(deleteDepartmentAction(department));
    navigate(-1);
  };

  if (!department) {
    return <NotFound />;
  }

  return (
    <Container className="mt-5">
      <h2>Форма удаления отдела</h2>
      <hr />


        <h4>{department.name}</h4>

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
  const departmentId = props.id;

  useEffect(() => {
    dispatch(fetchOneDepartmentAction(departmentId));
    dispatch(fetchAllFactorySiteAction());
    dispatch(fetchAllWareHouseAction());
  }, [dispatch, departmentId]);

  const department = useSelector(state => state.department.departments[departmentId]);
  const {factorySites} = useSelector(state => {return state.factorySite});
    const {wareHouses} = useSelector(state => {return state.wareHouse});

  if (!department) return <NotFound />;

  return (
    <Container className="mt-5">
      <h2>Форма просмотра деталей подразделения</h2>
      <hr />

      <ul>
        <li><b>Наименование: </b>{department.name}</li>

        <li>

            <details onClick={()=>{}}>
                <summary>
                    <Link to={{pathname: "/FactorySites/index", search: `?id=${departmentId}`}}>Производственные участки</Link>
                </summary>
                <ul>


                    {Object.keys(factorySites).filter((factorySiteId) => factorySites[factorySiteId].departmentId === departmentId).map(factorySite_id => (

                        <li>
                            <Link to={{pathname: "/FactorySites/details", search: `?id=${factorySite_id}`}}>{factorySites[factorySite_id].name.replace(/\s/g, '') ? factorySites[factorySite_id].name : "Без названия"}</Link>

                        </li>
                    ))}
                </ul>
            </details>
        </li>
        <li>
            <details>
                <summary>
                    <Link to={{pathname: "/WareHouses/index", search: `?id=${departmentId}`}}>Склады</Link>
                </summary>
                <ul>


                    {Object.keys(wareHouses).filter((wareHouseId) => wareHouses[wareHouseId].departmentId === departmentId).map(wareHouse_id => (

                        <li>
                            <Link to={{pathname: "/WareHouses/details", search: `?id=${wareHouses[wareHouse_id].id}`}}>{wareHouses[wareHouse_id].name.replace(/\s/g, '') ? wareHouses[wareHouse_id].name : "Без названия"}</Link>

                        </li>
                    ))}
                </ul>
            </details>
        </li>
    </ul>

      <Button onClick={() => navigate(-1)} variant="secondary">
        Обратно
      </Button>
    </Container>
  );
};


const Index = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllDepartmentAction());
  }, [dispatch]);

  const { departments } = useSelector(state => state.department);

  return (
    <Container className="mt-5">


      <h2>Список отделов</h2>
      <hr />
      <div className="d-flex flex-row-reverse">
        <Link to="/Departments/create">
            <Button variant="primary">Создание отдела</Button>
        </Link>
      </div>
      <hr />

      {Object.keys(departments).map(id => (
        <Row key={id} className="mb-2">
          <Col>
            <Link to={{ pathname: "/Departments/details", search: `?id=${departments[id].id}` }}>
              {departments[id].name}
            </Link>{" "}
            |{" "}
            <Link to={{ pathname: "/Departments/update", search: `?id=${departments[id].id}` }}>
              Изменить
            </Link>{" "}
            |{" "}
            <Link to={{ pathname: "/Departments/delete", search: `?id=${departments[id].id}` }}>
              Удалить
            </Link>
          </Col>
        </Row>
      ))}
    </Container>
  );
};


export const Departments = () => {
    const {operation} = useParams();
    const [queryParameters] = useSearchParams();
    const id = queryParameters.get("id");
    let content;
    console.log("operation:");
    console.log(operation);
    console.log(id);
    switch (operation) {
        case 'index':
            content = <Index />;
            break;
        case 'details':
            content = <Details id = {id} />;
            break;
        case 'create':
            content = <CreateForm />;
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
