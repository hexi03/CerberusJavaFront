import {useNavigate, useParams} from "react-router";
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Link, useSearchParams} from "react-router-dom";
import { Container, Form, Button, Row, Col, Card, ListGroup, Table, Accordion} from 'react-bootstrap';
import { createReportAction, fetchOneReportAction, updateReportAction, fetchAllReportsAction, fetchReportsByQuery } from '../actions/reportActions.js';
import {ReportBuilder, ReportType} from '../builders/reportBuilder.js';
import {reportDescriptions} from '../builders/reportDescriptions.js';
import { ReportFieldType } from "../builders/reportTypes.js";
import { reportFilter } from "../query/reportQuery.js";
import { fetchAllUsersAction } from "../actions/userActions.js";








const getFieldViewComponent = (field, store, report) => {
    console.log("View: " + field.type)
    console.log("Label: " + field.label)
    //create -> name = fieldName -> onSubmit -> calling description.set(builder,formdata['fieldName'])
    switch (field.type) {

      case ReportFieldType.REP_SELECT:
        //console.log(reportDescriptions[field.get(store, report).type].name)
        console.log("REP_SELECT");
        const rep = field.get(store, report);
        if(!rep) return <></>

        return (
          <div>
            <b>{field.label}</b>: <p><Link to={{pathname: "/Reports/details", search: `?id=${rep.id}`}}>{rep.id}</Link></p>
          </div>
        );

      case ReportFieldType.WAREHOUSE_SELECT:

        console.log("WAREHOUSE_SELECT");

        const wh = field.get(store, report);
        if(!wh) return <></>
        return (
          <div>
            <b>{field.label}</b>: <p><Link to={{pathname: "/WareHouses/details", search: `?id=${wh.id}`}}>{wh.name}</Link></p>
          </div>
        );

      case ReportFieldType.WAREHOUSE_LIST:

        console.log("WAREHOUSE_SELECT");

        const whs = field.get(store, report);
        console.log(whs);
        if(!whs) return (<></>)
        return (
          <>
          <b>{field.label}</b>:
          {whs.map((wh1)=>{return (
            <div>
              <p><Link to={{pathname: "/WareHouses/details", search: `?id=${wh1.id}`}}>{wh1.name}</Link></p>
            </div>
          )})}
          </>

        );
      case ReportFieldType.ITEMS_LIST:
        const list_entries = field.get(store, report) || {};
        console.log("View ITEMS_LIST")
        console.log(list_entries)



        return (

          <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>{field.label}</Accordion.Header>
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
                      return (<tr><td>{list_entries[key].item.name}</td> <td>{list_entries[key].amount}</td></tr>)
                  })}
              </tbody>
            </table>
          </Card>
           : "Ничего"}
        </Accordion.Body>
        </Accordion.Item>
      </Accordion>

        );
      case ReportFieldType.PRODUCTS_LIST:
        const product_entries = field.get(store, report) || {};
        return (

          <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>{field.label}</Accordion.Header>
          <Accordion.Body>
          {Object.keys(product_entries).length > 0 ?
                <Card>
            <table>
              <thead>
                <tr>
                    <th>Наименование</th>
                    <th>Количество</th>
                </tr>
              </thead>
              <tbody>
                  {Object.keys(product_entries).map((key) => {
                      return (<tr><td>{store.item.items[product_entries[key].product.producedItemId].name}</td> <td>{product_entries[key].amount}</td></tr>)
                  })}
              </tbody>
            </table>
          </Card>
          : "Ничего"}
        </Accordion.Body>
        </Accordion.Item>
      </Accordion>

        );
      case ReportFieldType.ITEMS_LIST_LIMITED:
      case ReportFieldType.PRODUCTS_LIST_LIMITED:
        return (
          <></>
        );
      case ReportFieldType.DATETIME:
        const dt = field.get(store, report);
        if(!dt) return <></>
        return (
          <div>
            <b>{field.label}</b>: <p>{dt}</p>
          </div>
        );
      case ReportFieldType.DELETED_DATETIME:
        const dtd = field.get(store, report);
        if(!dtd) return <></>
          return (
            <div>
              <b>{field.label}</b>: <p>{dtd}</p>
            </div>
          );
      // Добавь другие типы полей по мере необходимости
      default:
        return (<></>);
    }
  };



const ReportView = ({reportId }) => {
  const dispatch = useDispatch();

  const departments = useSelector(state => state.department.departments);
  const factorySites = useSelector(state => state.factorySite.factorySites);
  const wareHouses = useSelector(state => state.wareHouse.wareHouses);

  const reports = useSelector(state => state.report.reports);
  const items = useSelector(state => state.item.items);
  const products = useSelector(state => state.product.products);

  const users = useSelector(state => state.user.users);
  const groups = useSelector(state => state.group.groups);

  const factorySiteState = useSelector(state => state.factorySiteState.states);
  const wareHouseState = useSelector(state => state.wareHouseState.states);


  const store = {
      department: {departments:departments},
      factorySite: {factorySites:factorySites},
      wareHouse: {wareHouses:wareHouses},
      item: {items: items},
      product: {products: products},
      user: {users:users},
      group: {groups:groups},
      report: {reports: reports},
      factorySiteState: {states:factorySiteState},
      wareHouseState: {states:wareHouseState}
  };


  const report = reports[reportId];


  console.log("ID формы отчета: ");
  console.log(reportId);
  console.log("Отчетик: ");
  console.log(report);




  useEffect(() => {
      if (reportId)
      dispatch(fetchOneReportAction(reportId));

  }, [reportId, dispatch]);

  useEffect(() => {
    console.log("fetch called effect")
    console.log(report)
    console.log("report111")
    if (report){
      console.log("fetch called condition")
      reportDescriptions[report.type].fetch(report).forEach(dispatch);
    }

  }, [report, dispatch]); // Выполняем только при изменении типа отчета


  if (!report) return <NotFound/>

  return (
    <div>
      <h2>{'Details of: '}  {reportDescriptions[report.type].name}</h2>
      <h6>{reportId}</h6>


        {Object.entries(reportDescriptions[report.type].fields).map(([fieldName, field]) => (

          <div key={fieldName}>
            {getFieldViewComponent(field, store, report)}
          </div>
        ))}

    </div>
  );
};




const GetFieldEditComponent = ({field, store, report, fieldName}) => {
    const { register } = useFormContext();

    switch (field.type) {
        case ReportFieldType.REP_SELECT:
            const repOptions = field.getVariants(store) || [];
            return (
                <Form.Group>
                    <Form.Label>{field.label}</Form.Label>
                    <Form.Control as="select" {...register(fieldName)} defaultValue={reportDescriptions[report.type].get(store, report)}>
                        {repOptions.map(rep => (
                            <option key={rep.id} value={rep.id}>{rep.id}</option>
                        ))}
                    </Form.Control>
                </Form.Group>
            );

        case ReportFieldType.WAREHOUSE_SELECT:
            const whOptions = field.getVariants(store) || [];
            return (
                <Form.Group>
                    <Form.Label>{field.label}</Form.Label>
                    <Form.Control as="select" {...register(fieldName)} defaultValue={reportDescriptions[report.type].get(store, report)}>
                        {whOptions.map(wh => (
                            <option key={wh.id} value={wh.id}>{wh.name}</option>
                        ))}
                    </Form.Control>
                </Form.Group>
            );

        case ReportFieldType.WAREHOUSE_LIST:
            const whListOptions = field.getVariants(store) || [];
            return (
                <Form.Group>
                    <Form.Label>{field.label}</Form.Label>
                    <Form.Control as="select" multiple {...register(fieldName)} defaultValue={reportDescriptions[report.type].get(store, report)}>
                        {whListOptions.map(wh => (
                            <option key={wh.id} value={wh.id}>{wh.name}</option>
                        ))}
                    </Form.Control>
                </Form.Group>
            );

        case ReportFieldType.ITEMS_LIST:
            const itemListOptions = field.getVariants(store) || [];
            return (
                <Form.Group>
                    <Form.Label>{field.label}</Form.Label>
                    <Form.Control as="select" multiple {...register(fieldName)} defaultValue={reportDescriptions[report.type].get(store, report)}>
                        {itemListOptions.map(item => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                    </Form.Control>
                </Form.Group>
            );

        case ReportFieldType.PRODUCTS_LIST:
            const productListOptions = field.getVariants(store) || [];
            return (
                <Form.Group>
                    <Form.Label>{field.label}</Form.Label>
                    <Form.Control as="select" multiple {...register(fieldName)} defaultValue={reportDescriptions[report.type].get(store, report)}>
                        {productListOptions.map(product => (
                            <option key={product.id} value={product.id}>{product.name}</option>
                        ))}
                    </Form.Control>
                </Form.Group>
            );

        case ReportFieldType.DATETIME:
            return (
                <Form.Group>
                    <Form.Label>{field.label}</Form.Label>
                    <Form.Control type="datetime-local" {...register(fieldName)} defaultValue={reportDescriptions[report.type].get(store, report)} />
                </Form.Group>
            );

        case ReportFieldType.DELETED_DATETIME:
            return (
                <Form.Group>
                    <Form.Label>{field.label}</Form.Label>
                    <Form.Control type="datetime-local" {...register(fieldName)} defaultValue={reportDescriptions[report.type].get(store, report)} />
                </Form.Group>
            );

        // Добавьте другие типы полей по мере необходимости
        default:
            return <></>;
    }
};




const ReportForm = ({ reportId, isEditMode, reportType}) => {
  const dispatch = useDispatch();

  const departments = useSelector(state => state.department.departments);
  const factorySites = useSelector(state => state.factorySite.factorySites);
  const wareHouses = useSelector(state => state.wareHouse.wareHouses);
  const reports = useSelector(state => state.report.reports);
  const items = useSelector(state => state.item.items);
  const products = useSelector(state => state.product.products);
  const users = useSelector(state => state.user.users);
  const groups = useSelector(state => state.group.groups);
  const factorySiteState = useSelector(state => state.factorySiteState.states);
  const wareHouseState = useSelector(state => state.wareHouseState.states);

  const store = {
    department: {departments:departments},
    factorySite: {factorySites:factorySites},
    wareHouse: {wareHouses:wareHouses},
    item: {items: items},
    product: {products: products},
    user: {users:users},
    group: {groups:groups},
    report: {reports: reports},
    factorySiteState: {states:factorySiteState},
    wareHouseState: {states:wareHouseState}
  };

  const report = reports[reportId];

  useEffect(() => {
    if (reportId && isEditMode) {
      dispatch(fetchOneReportAction(reportId));
    }
  }, [reportId, isEditMode, dispatch]);

  useEffect(() => {
    if (report) {
      reportDescriptions[report.type].fetch(report).forEach(dispatch);
    }
  }, [report, dispatch]);

  const methods = useForm({ defaultValues: report || {} });



  if (isEditMode && !report) return <NotFound/>

  reportType = isEditMode ? report.type : reportType;
  const reportDescription = reportDescriptions[reportType];

  const onSubmit = (data) => {
    const builder = new ReportBuilder().setType(reportType);
    Object.keys(data).forEach(fieldName => {
      const fieldDescription = reportDescriptions[reportType].fields[fieldName];
      if (fieldDescription && fieldDescription.set) {
        fieldDescription.set(builder, data[fieldName]);
      }
    });
    const reportData = builder.build();

    if (isEditMode) {
      dispatch(updateReportAction(reportId, reportData));
    } else {
      dispatch(createReportAction(reportData));
    }
  };

  return (
    <FormProvider {...methods}>
      <Form onSubmit={methods.handleSubmit(onSubmit)}>
        <h2>{isEditMode ? 'Edit Report' : 'Create Report'}</h2>
        {isEditMode && <h6>{reportId}</h6>}

        {Object.keys(reportDescription.fields).map(fieldName => {
          const field = reportDescription.fields[fieldName];
          return (
            <div key={fieldName}>
              <GetFieldEditComponent field = {field} store = {store} report = {report || {}} fieldName = {fieldName}/>
            </div>
          );
        })}

        <Button type="submit">{isEditMode ? 'Save Changes' : 'Create Report'}</Button>
      </Form>
    </FormProvider>
  );
};





export const ReportList = ({queryParams}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Загружаем список отчетов при монтировании компонента
    dispatch(fetchAllUsersAction());
    dispatch(fetchReportsByQuery(queryParams));
  }, [dispatch]);


  const reports = reportFilter(queryParams, useSelector(state => state.report.reports)); // Получаем список отчетов из хранилища
  const users = useSelector(state => state.user.users);

  useEffect(() => {
    // Загружаем список отчетов при монтировании компонента
    dispatch(fetchReportsByQuery(queryParams));
  }, [dispatch]);

    if (!reports || reports.length === 0) {
      return (<h4>Отчетов не найдено</h4>);
    }

  return (
    <div>
      <table>
        <thead>
          <tr>
              <th>ID отчета</th>
              <th>Тип отчета</th>
              <th>Дата создания</th>
              <th>Ответственный</th>
          </tr>
        </thead>
        <tbody>
            {Object.keys(reports).map(id => (
              <tr key={id}>
                <td><div><Link to={{pathname: "/Reports/details", search: `?id=${reports[id].id}`}}>{reports[id].id}</Link></div></td>
                <td>{reportDescriptions[reports[id].type].name}</td>
                <td>{new Date(reports[id].createdAt).toLocaleString()}</td>
                <td><div><Link to={{pathname: "/Users/details", search: `?id=${reports[id].creatorId}`}}>🧑‍💼{users[reports[id].creatorId].name}</Link></div></td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};




const NotFound = () => {
  return (
    <Container className="mt-5">

        <h1>Упс, страница не найдена</h1>
        <p className="lead">Увы, отчет, который вы ищете, не найден.</p>
        <p>Проверьте правильность URL адреса или вернитесь на <Link to="/Home">главную страницу</Link>.</p>

    </Container>
  );
};

export const ReportManagementPanel = () => {

  const {operation} = useParams();
    const [queryParameters, setQueryParameters] = useSearchParams();


    let content;

  switch (operation) {
        case 'index':
            content = <ReportList params = {queryParameters}/>;
            break;
        case 'details':
            content = <ReportView reportId = { queryParameters.get("id") }/>;
            break;
        case 'create':
            content = <></>;//<ReportForm reportId = {id} mode = {MODE_CREATE}/>;
            break;
        case 'update':
            content = <></>;//<ReportForm reportId = {id} mode = {MODE_EDIT}/>;
            break;
        case 'delete':
            content = <></>;//<ReportDeleteForm reportId = { queryParameters.get("id")}/>;
            break;
        default:
            content = <div>Invalid operation</div>;
            break;
    }
    return (content);
};

export default ReportManagementPanel;



// export const ReportManagementPanel = () => {
//   const { register, handleSubmit } = useForm();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//
//   const {operation, name} = useParams();
//     const [queryParameters] = useSearchParams();
//     const id = queryParameters.get("id");
//
//
//     let content;
//     console.log("operation:");
//     console.log(operation);
//
//     console.log("name:");
//     console.log(name);
//
//     console.log(id);
//
//
//   // Рендер формы для создания нового отчета
//   const RenderReportCreateForm = () => {
//     const onSubmit = (data) => {
//       dispatch(createReportAction((new ReportBuilder()).setTitle(data.title).build()));
//       navigate(-1);
//     };
//
//     return (
//       <Form onSubmit={handleSubmit(onSubmit)}>
//         <Form.Group controlId="formBasicTitle">
//           <Form.Label>Title</Form.Label>
//           <Form.Control type="text" {...register('title')} />
//         </Form.Group>
//         <Button variant="primary" type="submit">Submit</Button>
//       </Form>
//     );
//   };
//
//   // Рендер формы для обновления информации об отчете
//   const RenderReportUpdateForm = () => {
//     // Здесь вы можете использовать useParams() для получения id отчета из URL
//     // Пока примерно:
//     const reportId = 123; // Ваш ID отчета
//     useEffect(() => {
//       dispatch(fetchOneReportAction(reportId));
//     }, [dispatch, reportId]);
//
//     const report = useSelector(state => state.reports.report[reportId]);
//
//     const onSubmit = (data) => {
//       dispatch(updateReportAction((new ReportBuilder()).setTitle(data.title).setId(reportId).build()));
//       navigate(-1);
//     };
//
//     return (
//       <Form onSubmit={handleSubmit(onSubmit)}>
//         <Form.Group controlId="formBasicTitle">
//           <Form.Label>Title</Form.Label>
//           <Form.Control type="text" defaultValue={report.title} {...register('title')} />
//         </Form.Group>
//         <Button variant="primary" type="submit">Submit</Button>
//       </Form>
//     );
//   };
//
//   const RenderReportDetails = () => {
//
//
//     return (
//       <></>
//     );
//   };
//
//   // Рендер списка отчетов
//   const RenderReportList = () => {
//     useEffect(() => {
//       dispatch(fetchAllReportsAction());
//     }, [dispatch]);
//
//     const reports = useSelector(state => state.reports);
//
//     return (
//       <Table striped bordered hover>
//         <thead>
//           <tr>
//             <th>Title</th>
//           </tr>
//         </thead>
//         <tbody>
//           {reports.map(report => (
//             <tr key={report.id}>
//               <td>{report.title}</td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//     );
//   };
//
//
//
//   switch (operation) {
//         case 'index':
//             content = RenderReportList();
//             break;
//         case 'details':
//             content = RenderReportDetails();
//             break;
//         case 'create':
//             content = RenderReportCreateForm();
//             break;
//         case 'update':
//             content = RenderReportUpdateForm();
//             break;
//         case 'delete':
//             content = RenderReportDeleteForm();
//             break;
//         default:
//             content = <div>Invalid operation</div>;
//             break;
//     }
//     return (content);
// };
//
// export default ReportManagementPanel;
