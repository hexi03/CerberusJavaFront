import {useNavigate, useParams} from "react-router";

import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import {Link, useSearchParams} from "react-router-dom";
import { Container, Form, Button, Row, Col, ListGroup, Table} from 'react-bootstrap';
import { createReportAction, fetchOneReportAction, updateReportAction, fetchAllReportsAction } from '../actions/reportActions.js';
import {ReportBuilder, ReportType} from '../builders/reportBuilder.js';
import {reportDescriptions} from '../builders/reportDescriptions.js';



const MODE_CREATE = "MODE_CREATE";
const MODE_EDIT = "MODE_EDIT";
const MODE_VIEW = "MODE_VIEW";



const ReportForm = ({mode, reportId }) => {
  const [formData, setFormData] = useState(report || {});
  const dispatch = useDispatch();
  const store = useSelector(state => state); // Получаем состояние хранилища


  useEffect(() => {
    dispatch(fetchOneReportAction(reportId));
  }, [dispatch, params]);

  const report = useSelector(state => state.report.reports[reportId]);


  useEffect(() => {
    // Выполняем fetch для данных отчета в зависимости от его типа
    if (mode === 'edit') {
      reportDescriptions[report.type].fetch(report);
    }
  }, [report]); // Выполняем только при изменении типа отчета

  const handleSubmit = () => {
      //create -> name = fieldName -> onSubmit -> calling description.set(builder,formdata['fieldName'])

    if (mode === MODE_EDIT) {
      // Отправляем данные на сервер для обновления отчета
      dispatch(updateReportAction(formData));
    }
    if (mode === MODE_CREATE) {
      // Отправляем данные на сервер для создания отчета
      dispatch(createReportAction(formData));
    }
  };

  if (mode === MODE_VIEW && !report) return <NotFound/>

  return (
    <div>
      <h2>{mode === MODE_EDIT ? 'Edit' : ''} {mode === MODE_CREATE ? 'Create' : ''} {mode === MODE_VIEW ? 'Details of' : ''} {reportDescriptions[report.type].name}</h2>
      {mode === MODE_VIEW ? (<h2>{reportId}</h2>) : ''}

      <Form onSubmit={handleSubmit}>
        {Object.entries(reportDescriptions[report.type].fields).map(([fieldName, field]) => (

          <div key={fieldName}>
            <label>{field.label}</label>
            {getFieldComponent(field, mode)}
          </div>
        ))}

        {mode === MODE_EDIT || mode === MODE_CREATE ? (<button type="submit">{mode === MODE_EDIT ? 'Update' : 'Create'}</button>) : ''  }
      </Form>
    </div>
  );
};

const getFieldComponent = (fieldName, field) => {
  //create -> name = fieldName -> onSubmit -> calling description.set(builder,formdata['fieldName'])
  switch (field.type) {
    case ReportFieldType.NOT_ACCESSIBLE:
      return <input type="text" value={field.get(store, formData)} disabled />;
    case ReportFieldType.WAREHOUSE_SELECT:
    case ReportFieldType.SUP_REQ_REP_SELECT:
    case ReportFieldType.WS_REP_SELECT:
      return (
        <select onChange={(e) => handleFieldChange(fieldName, e.target.value)}>
          {field.getVariants(store).map(({ id, label }) => (
            <option key={id} value={id}>{label}</option>
          ))}
        </select>
      );
    case ReportFieldType.ITEMS_LIST:
    case ReportFieldType.PRODUCTS_LIST:
    case ReportFieldType.ITEMS_LIST_LIMITED:
    case ReportFieldType.PRODUCTS_LIST_LIMITED:
      return (
        <select multiple onChange={(e) => handleFieldChange(fieldName, Array.from(e.target.selectedOptions, option => option.value))}>
          {field.getVariants(store).map(({ id, label }) => (
            <option key={id} value={id}>{label}</option>
          ))}
        </select>
      );
    case ReportFieldType.DATETIME:
    case ReportFieldType.DELETED_DATETIME:
      return <input type="datetime-local" onChange={(e) => handleFieldChange(fieldName, e.target.value)} />;
    // Добавь другие типы полей по мере необходимости
    default:
      return null;
  }
};



const ReportList = ({queryParams}) => {
  const dispatch = useDispatch();
  const reports = useSelector(state => reportFilter(queryParams, state.reports)); // Получаем список отчетов из хранилища

  useEffect(() => {
    // Загружаем список отчетов при монтировании компонента
    dispatch(fetchReports());
  }, []);

  return (
    <div>
      <h2>Report List</h2>
      <ul>
        {reports.map(report => (
          <li key={report.id}>{report.name}</li>
        ))}
      </ul>
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
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {operation} = useParams();
    const [queryParameters] = useSearchParams();



    let content;
    console.log("operation:");
    console.log(operation);

    console.log("name:");
    console.log(name);

    console.log(id);
  switch (operation) {
        case 'index':
            content = <ReportList params = {queryParameters}/>;
            break;
        case 'details':
            content = <ReportForm reportId = {id} mode = {MODE_VIEW}/>;
            break;
        case 'create':
            content = <ReportForm reportId = {id} mode = {MODE_CREATE}/>;
            break;
        case 'update':
            content = <ReportForm reportId = {id} mode = {MODE_EDIT}/>;
            break;
        case 'delete':
            const id = queryParameters.get("id");
            content = <ReportDeleteForm reportId = {id}/>;
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
