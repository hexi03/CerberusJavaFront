import {useNavigate, useParams} from "react-router";

import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useForm} from 'react-hook-form';
import {Link, useSearchParams} from "react-router-dom";
import {Accordion, Button, Card, Col, Container, Form, ListGroup, Row} from 'react-bootstrap';
import {
    createFactorySiteAction,
    deleteFactorySiteAction,
    fetchAllFactorySiteAction,
    fetchOneFactorySiteAction,
    fetchOneFactorySiteStateAction,
    updateFactorySiteAction,
    updateFactorySiteSupplyAction
} from "../actions/factorySiteActions.js";

import {fetchAllWareHouseAction} from "../actions/wareHouseActions.js";
import {FactorySiteBuilder} from "../builders/factorySiteBuilder.js";

import {FactorySiteSupplyBuilder} from "../builders/factorySiteSupplyBuilder.js";
import {ReportType} from "../builders/reportTypes.js";
import {ReportList, ReportSelector} from "./Reports.js";
import {ProblemType} from "../builders/problemTypes.js";
import {WarningTypes} from "../builders/warningTypes.js";
import {fetchAllItemsAction} from "../actions/itemActions.js";


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
    dispatch(fetchOneFactorySiteAction(factorySiteId));
  }, [dispatch, factorySiteId]);

  const factorySite = useSelector(state => state.factorySite.factorySites[factorySiteId]);

  if (!factorySite) return <NotFound />;

  return (
    <Container className="mt-5">
      <h2>Форма просмотра деталей производственного участка</h2>
      <hr />
      <ReportSelector reportTypes={[ReportType.FS_SUP_REQ, ReportType.FS_WORKSHIFT]} operation={"create"} params = {{locationSpecificId: factorySiteId}}/>
      <hr />

      <h4>
        <b>Наименование: </b>{factorySite.name}
      </h4>

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
    dispatch(fetchOneFactorySiteStateAction(factorySiteId));
    dispatch(fetchAllItemsAction());
  }, [dispatch, factorySiteId]);

  const factorySiteState = useSelector(state => state.factorySiteState.states[factorySiteId]);
  const items = useSelector(state => state.item.items);

  if (!factorySiteState) {
    return <NotFound />;
  }


  const renderItemList = (list_entries, label) => {
    console.log("list_entries")
    console.log(list_entries)
    return <>
          <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>{label}</Accordion.Header>
          <Accordion.Body>
          {Object.keys(list_entries).length > 0 ?
                <Card>
            <table>
              <thead>
                <tr>
                    <th>Наименование</th>
                    <th>Количество</th>
                </tr>
              </thead>
              <tbody>
                  {Object.keys(list_entries).map((key) => {
                      return (<tr><td>{items[key]?.name}</td> <td>{list_entries[key]}</td></tr>)
                  })}
              </tbody>
            </table>
          </Card>
          : "Ничего"}
        </Accordion.Body>
        </Accordion.Item>
      </Accordion>

    </>
  }




  const renderProblem = (pr) => {
    console.log("Problem: ")
    console.log(pr)

    //, связанная с <Link to={{pathname: "/Reports/details", search: `?id=${pr.rep.id}`}}>РАБОЧЕЙ СМЕНОЙ</Link>
    //, связанная с <Link to={{pathname: "/Reports/details", search: `?id=${pr.rep.id}`}}>РАБОЧЕЙ СМЕНОЙ</Link>

      switch (pr.type){
        case ProblemType.WorkShiftConsumablesLossProblem:
          return (
            <div>
                <h6>Исходя из предоставленных отчетов была выявлена потеря РМ. Рекомендуется проверить отчет о рабочей смене и ранее предоставленные отчеты!</h6>
                {renderItemList(pr.lostedOnSiteConsumables,"Список проблемных позиций")}
            </div>
          )
         case ProblemType.WorkShiftConsumablesTooMuchProblem:
          return (
            <div>
                <h6>Исходя из предоставленных отчетов была выявлена невозможная ситуация (переучет произведенной продукции/невостребованных РМ). Рекомендуется проверить отчет о рабочей смене и ранее предоставленные отчеты!</h6>
                {renderItemList(pr.lostedOnSiteConsumablesNeg,"Список проблемных позиций")}
            </div>
          )

        default:
          return <></>
      }

  };

  const renderWarning = (warn) => {

        console.log("Problem: ")
    console.log(warn)

      switch (warn.type){
        case WarningTypes.WorkShiftLossesWarning:
          return (
              <div>
                  <h6>Согласно <Link to={{pathname: "/Reports/details", search: `?id=${warn.rep.id}`}}>ОТЧЕТУ О РАБОЧЕЙ СМЕНЕ</Link> имеются потери РМ</h6>
                  {renderItemList(warn.losses,"Список проблемных позиций")}
              </div>
            )

        case WarningTypes.WorkShiftRemainsWarning:
          return (
              <div>
                  <h6>Согласно <Link to={{pathname: "/Reports/details", search: `?id=${warn.rep.id}`}}>ОТЧЕТУ О РАБОЧЕЙ СМЕНЕ</Link> имеются остатки РМ на территории ПУ</h6>
                  {renderItemList(warn.remains,"Список проблемных позиций")}
              </div>
            )
      }
  }


   const renderProblems = () => {
     if (!factorySiteState.problems || factorySiteState.problems.length === 0) {
      return (<h4>Ошибок не найдено</h4>);
    }

    return (
      <div>
        <h3>Проблемы:</h3>
        <ul>
          {factorySiteState.problems.map((problem, index) => (
            <li key={index}>{renderProblem(problem)}</li>
          ))}
        </ul>
      </div>
    );
  };

  const renderWarnings = () => {
    if (!factorySiteState.warnings || factorySiteState.warnings.length === 0) {
      return (<h4>Предупреждений нет</h4>);
    }

    return (
      <div>
        <h3>Предупреждения:</h3>
        <ul>
          {factorySiteState.warnings.map((warning, index) => (
            <li key={index}>{renderWarning(warning)}</li>
          ))}
        </ul>
      </div>
    );
  };



  const renderReports = () => {

    const queryParams = {
      typeCriteria: ReportType.FS_GENERIC,
      locationSpecificId: factorySiteState.id
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

  return (<>
    <Container className="mt-5">
      <h2>Состояние производственного участка</h2>
      {renderProblems()}
      {renderWarnings()}
      {renderReports()}
    </Container>
      </>
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
    if (factorySite){
      const inDepartmentWareHouses = Object.values(wareHouses).filter(wh => wareHouses[wh.id]?.departmentId == factorySite.departmentId)
      console.log(selectedSuppliers);
      console.log(wareHouses);
      setSelectedWareHouses(inDepartmentWareHouses.filter((wh) => (selectedSuppliers.includes(wh.id))));
      setDeSelectedWareHouses(inDepartmentWareHouses.filter((wh) => !(selectedSuppliers.includes(wh.id))));
    }
  }, [setSelectedWareHouses, setDeSelectedWareHouses, wareHouses, factorySite, selectedSuppliers]);

    useEffect(() => {
    console.log("selectedWareHouses");
    console.log(selectedWareHouses);
    console.log("deSelectedWareHouses");
    console.log(deSelectedWareHouses);
  }, [selectedWareHouses, deSelectedWareHouses]);



  useEffect(() => {
    if(factorySite && factorySite.suppliers)
      setSelectedSuppliers(factorySite.suppliers)
  }, [factorySite, setSelectedSuppliers]);



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
    dispatch(updateFactorySiteSupplyAction(factorySiteId, selectedSuppliers.reduce((sup, whId) => sup.addSupplier(whId), new FactorySiteSupplyBuilder()).build()));
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
