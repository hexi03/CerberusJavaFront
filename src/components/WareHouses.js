import {useNavigate, useParams} from "react-router";

import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useForm} from 'react-hook-form';
import {Link, useSearchParams} from "react-router-dom";
import {
    createWareHouseAction,
    deleteWareHouseAction,
    fetchAllWareHouseAction,
    fetchOneWareHouseAction,
    fetchOneWareHouseStateAction,
    updateWareHouseAction
} from "../actions/wareHouseActions.js";
import {WareHouseBuilder} from "../builders/wareHouseBuilder.js";

import {
    Accordion,
    Button,
    Card,
    Col,
    Container,
    Form,
    ListGroup,
    ListGroupItem,
    Pagination,
    Row,
    Spinner
} from 'react-bootstrap';
import {fetchAllItemsAction} from "../actions/itemActions.js";
import {ReportList, ReportSelector} from "./Reports.js";
import {ReportType} from "../builders/reportTypes.js";
import {ProblemType} from "../builders/problemTypes.js";
import {WarningTypes} from "../builders/warningTypes.js";

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
      <ReportSelector reportTypes={[ReportType.WH_INVENTARISATION, ReportType.WH_RELEASE, ReportType.WH_REPLENISHMENT, ReportType.WH_SHIPMENT, ReportType.WH_WS_REPLENISHMENT]} operation={"create"} params = {{locationSpecificId: wareHouseId}}/>
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

  const renderReportList = (reportIds, label) => {
    console.log("reportIds")
    console.log(reportIds)
    return <>
          <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>{label}</Accordion.Header>
          <Accordion.Body>
          {reportIds.length > 0 ?
                <Card>
                  <ListGroup>
                  {reportIds.map((repId) => {
                      return (<ListGroupItem><Link to={{pathname: "/Reports/details", search: `?id=${repId.id}`}}>Отчет {repId.id}</Link></ListGroupItem>)
                  })}
                  </ListGroup>
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

      switch (pr.type){
        case ProblemType.InvalidStorageStateProblem:
          return (
            <div>
                <h6>Вычисление состояния из представленых отчетов приводит к невозможному результату. Рекомендуется проверить предоставленные отчеты.</h6>
                {renderItemList(pr.invalidStorageStatePositions,"Список проблемных позиций")}
            </div>

          )
        case ProblemType.InventarisationReportProblem:
          return (
            <div>
                <h6>Вычисленное состояние не совпало со списком инвентаризованного из <Link to={{pathname: "/Reports/details", search: `?id=${pr.rep.id}`}}>ОТЧЕТА ОБ ИНВЕНТАРИЗАЦИИ</Link>. Рекомендуется проверить отчет об инвентаризации и более ранние отчеты!</h6>
                {renderItemList(pr.differrence,"Список проблемных позиций")}
            </div>
          )

        case ProblemType.ReleasedTooMuchReportProblemDTO:
          return (
            <div>
                <h6>Согласно совокупности отчетов о снабжении для <Link to={{pathname: "/Reports/details", search: `?id=${pr.rep.id}`}}>ОТЧЕТА О ЗАПРОСЕ РМ</Link> было отпущено больше расходных материалов, чем было запрошено. Рекомендуется проверить отчет о снабжении!</h6>
                {renderItemList(pr.differrence,"Список проблемных позиций")}
                {renderReportList(pr.affectedReportIds,"Список связанных отчетов")}
            </div>
          )

          case ProblemType.WorkShiftReplenishedTooMuchReportProblem:
            return (
              <div>
                  <h6>Согласно совокупности отчетов о принятии ПП/Невостребованных РМ для <Link to={{pathname: "/Reports/details", search: `?id=${pr.rep.id}`}}>ОТЧЕТА О РАБОЧЕЙ СМЕНЕ</Link> на склад было принято больше, чем предоставлено (связано со {pr.by == "Produced" ? "списком ПП": "списком невостребованных РМ"}). Рекомендуется проверить отчет о принятии ПП/Невостребованных РМ!</h6>
                  {renderItemList(pr.differrence,"Список проблемных позиций")}
                  {renderReportList(pr.affectedReportIds,"Список связанных отчетов")}
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
        case WarningTypes.UnsatisfiedSupplyRequirementReportWarning:
            return (
              <div>
                  <h6>В системе присутствует <Link to={{pathname: "/Reports/details", search: `?id=${warn.rep.id}`}}>ОТЧЕТ О ЗАПРОСЕ СНАБЖЕНИЯ</Link>, включающий этот склад как целевой склад снабжения</h6>
                  {renderItemList(warn.items,"Список проблемных позиций")}
              </div>
            )
        case WarningTypes.UnsatisfiedWorkShiftReportWarning:
            return (
              <div>
                  <h6>В системе присутствует <Link to={{pathname: "/Reports/details", search: `?id=${warn.rep.id}`}}>ОТЧЕТ ОБ ОКОНЧАНИИ РАБОЧЕЙ СМЕНЫ</Link>, включающий этот склад как целевой склад приемки ПП</h6>
                  {renderItemList(warn.items,"Список проблемных позиций")}
              </div>
            )
      }
  }


   const renderProblems = () => {
     if (!wareHouseState.problems || wareHouseState.problems.length === 0) {
      return (<h4>Ошибок не найдено</h4>);
    }

    return (
      <div>
        <h3>Проблемы:</h3>
        <ul>
          {wareHouseState.problems.map((problem, index) => (
            <li key={index}>{renderProblem(problem)}</li>
          ))}
        </ul>
      </div>
    );
  };

  const renderWarnings = () => {
    if (!wareHouseState.warnings || wareHouseState.warnings.length === 0) {
      return (<h4>Предупреждений нет</h4>);
    }

    return (
      <div>
        <h3>Предупреждения:</h3>
        <ul>
          {wareHouseState.warnings.map((warning, index) => (
            <li key={index}>{renderWarning(warning)}</li>
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
