import {useNavigate, useParams} from "react-router";
import {FormProvider, useFieldArray, useForm, useFormContext} from 'react-hook-form';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link, useSearchParams} from "react-router-dom";
import {LinkContainer} from 'react-router-bootstrap'
import {Accordion, Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader, Container, Form} from 'react-bootstrap';
import {
    createReportAction,
    fetchOneReportAction,
    fetchReportsByQuery,
    updateReportAction
} from '../actions/reportActions.js';
import {ReportBuilder, ReportType} from '../builders/reportBuilder.js';
import {reportDescriptions} from '../builders/reportDescriptions.js';
import {ReportFieldType} from "../builders/reportTypes.js";
import {reportFilter} from "../query/reportQuery.js";
import {fetchAllUsersAction} from "../actions/userActions.js";


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
            <b>{field.label}</b>: <p><Link to={{pathname: "/Reports/details", search: `?id=${rep.id}`}}>{reportDescriptions[rep.type].name + " от " + new Date(rep.createdAt).toLocaleString()}</Link></p>
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

        console.log("WAREHOUSE_LIST");

        const whs = field.get(store, report);
        console.log(whs);
        if(!whs) return (<></>)
        return (
          <>
          <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
          <Accordion.Header>{field.label}</Accordion.Header>
          <Accordion.Body>
          {whs.map((wh1)=>{return (
            <div>
              <p><Link to={{pathname: "/WareHouses/details", search: `?id=${wh1.id}`}}>{wh1.name}</Link></p>
            </div>
          )})}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
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
                  {list_entries.map((entry) => {
                      return (<tr><td><Link to={{pathname: "/Registries/item/details", search: `?id=${entry?.item?.id}`}}>{entry?.item?.name}</Link></td> <td>{entry.amount}</td></tr>)
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
                  {product_entries.map((entry) => {
                      return (<tr><td><Link to={{pathname: "/Registries/product/details", search: `?id=${entry?.productId}`}}>{entry?.item?.name}</Link></td> <td>{entry?.amount}</td></tr>)
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

  console.log("Рендер ReportView: ");
  useEffect(() => {
      console.log("Вызов useEffect c id: " + reportId);
      if (reportId)
      dispatch(fetchOneReportAction(reportId));

  }, [reportId, dispatch]);

  const report = reports[reportId];


  console.log("ID формы отчета: ");
  console.log(reportId);
  console.log("Отчетик: ");
  console.log(report);






  useEffect(() => {
    console.log("fetch called effect")
    console.log(report)
    console.log("report111")
    if (report){
      console.log("fetch called condition")
      reportDescriptions[report.type].fetch(report).forEach(dispatch);
    }

  }, [report]); // Выполняем только при изменении типа отчета


  if (!report) return <NotFound/>

  return (
    <div>
      <h2>{'Детали отчета: '}  {reportDescriptions[report.type].name} от {new Date(report.createdAt).toLocaleString()}</h2>
      <hr/>
      <h6>Идентификатор отчета: {reportId}</h6>
      <hr/>
        <LinkContainer to={{pathname: `/Reports/edit/`, search: `?id=${reportId}` }} key={reportId}>
          <Button variant="primary">
            Редактировать
          </Button>
        </LinkContainer>
      <hr/>
        {Object.entries(reportDescriptions[report.type].fields).map(([fieldName, field]) => (

          <div key={fieldName}>
            {getFieldViewComponent(field, store, report)}
          </div>
        ))}

    </div>
  );
};










const RepSelect = ({ field, fieldName, defaultValue, store, params, options }) => {
  const { register, control } = useFormContext();

    return (
        <Form.Group>
            <Form.Label>{field.label}</Form.Label>
            <Form.Control as="select" {...register(fieldName)} value={defaultValue}>
                {options.map(rep => (
                    <option key={rep.id} value={rep.id}>{reportDescriptions[rep.type].name + " от " + new Date(rep.createdAt).toLocaleString()}</option>
                ))}
            </Form.Control>
        </Form.Group>
    );
};

const WarehouseSelect = ({ field, fieldName, defaultValue, store, params, options  }) => {
  const { register, control } = useFormContext();
    const { fields, append, remove } = useFieldArray({ control, name: fieldName });
    return (
        <Form.Group>
            <Form.Label>{field.label}</Form.Label>
            <Form.Control as="select" {...register(fieldName)} value={defaultValue}>
                {options.map(wh => (
                    <option key={wh.id} value={wh.id}>{wh.name}</option>
                ))}
            </Form.Control>
        </Form.Group>
    );
};

const WarehouseList = ({ field, fieldName, defaultValue, store, params, options }) => {
  const { register, control } = useFormContext();
    const { fields, append, remove, replace } = useFieldArray({ control, name: fieldName });
    useEffect(() => {
        if (defaultValue && defaultValue.length) {
            replace(defaultValue.map(entry => (entry.id)));
        }
    }, [defaultValue]);

    return (
        <Form.Group>
            <Form.Label>{field.label}</Form.Label>
            {fields.map((item, index) => {
                console.log("шняга в форме")
                console.log(item)
                if (!item) return null;
                return (
                    <div key={item.id} className="d-flex mb-2">
                        <Form.Control as="select" {...register(`${fieldName}[${index}]`)} defaultValue={item || ""}>
                            {options.map(wh => (
                                <option key={wh.id} value={wh.id}>{wh.name}</option>
                            ))}
                        </Form.Control>
                        <Button variant="danger" onClick={() => remove(index)}>Remove</Button>
                    </div>
                );
            })}
            <Button variant="primary" onClick={() => append("")}>Add Warehouse</Button>
        </Form.Group>
    );
};

const ItemsList = ({ field, fieldName, defaultValue, store, params, options }) => {
  const { register, control } = useFormContext();
    const { fields, append, remove, replace } = useFieldArray({ control, name: fieldName });
    useEffect(() => {
        if (defaultValue && defaultValue.length) {
            console.log("replace!!!!!!!!!!!!1")
            replace(defaultValue.map(entry => ({id: entry.item.id, amount: entry.amount})));
        }
    }, [defaultValue]);

    return (
        <Form.Group>
            <Form.Label>{field.label}</Form.Label>
            {fields.map((item, index) => {
                console.log("шляпа в форме")
                console.log(item)
                return (
                    <div key={item.id} className="d-flex mb-2">
                        <Form.Control as="select" {...register(`${fieldName}[${index}].id`)} defaultValue={item.id || ""}>
                            {options.map(option => (
                                <option key={option.id} value={option.id}>{option.name}</option>
                            ))}
                        </Form.Control>
                        <Form.Control
                            type="number"
                            placeholder="Amount"
                            {...register(`${fieldName}[${index}].amount`)}
                            defaultValue={item.amount || ""}
                            className="ml-2"
                        />
                        <Button variant="danger" onClick={() => remove(index)}>Remove</Button>
                    </div>
                );
            })}
            <Button variant="primary" onClick={() => append({  id: "", amount: ""  })}>Add Item</Button>
        </Form.Group>
    );
};

const ProductsList = ({ field, fieldName, defaultValue, store, params, options}) => {
  const { register, control } = useFormContext();
    const { fields, append, remove, replace } = useFieldArray({ control, name: fieldName });
    useEffect(() => {
        if (defaultValue && defaultValue.length) {
            replace(defaultValue.map(entry => ({id: entry.item.id, amount: entry.amount})));
        }
    }, [defaultValue]);

    return (
        <Form.Group>
            <Form.Label>{field.label}</Form.Label>
            {fields.map((item, index) => {
                return (
                    <div key={item.id} className="d-flex mb-2">
                        <Form.Control as="select" {...register(`${fieldName}[${index}].id`)} defaultValue={item.id || ""}>
                            {options.map(option => (
                                <option key={option.product.id} value={option.product.id}>{option.item.name}</option>
                            ))}
                        </Form.Control>
                        <Form.Control
                            type="number"
                            placeholder="Amount"
                            {...register(`${fieldName}[${index}].amount`)}
                            defaultValue={item.amount || ""}
                            className="ml-2"
                        />
                        <Button variant="danger" onClick={() => remove(index)}>Remove</Button>
                    </div>
                );
            })}
            <Button variant="primary" onClick={() => append({  id: "", amount: ""})}>Add Product</Button>
        </Form.Group>
    );
};

const DateTimeField = ({ field, fieldName, defaultValue }) => {
  const { register, control } = useFormContext();
    return (
        <Form.Group>
            <Form.Label>{field.label}</Form.Label>
            <Form.Control type="datetime-local" {...register(fieldName)} value={defaultValue} />
        </Form.Group>
    );
};




const GetFieldEditComponent = ({ field, store, report, reportType, fieldName, isEditMode, defaultVal, params }) => {


    const defaultValue = isEditMode ? reportDescriptions[report.type].fields[fieldName].get(store, report) : defaultVal;

    switch (field.type) {
        case ReportFieldType.REP_SELECT:
            return <RepSelect field={field}  fieldName={fieldName} defaultValue={defaultValue} store={store} params={params} options={field.getVariants(store, report, params) || []} />;
        case ReportFieldType.WAREHOUSE_SELECT:
            return <WarehouseSelect field={field} fieldName={fieldName} defaultValue={defaultValue} store={store} params={params} options={field.getVariants(store, report, params) || []} />;
        case ReportFieldType.WAREHOUSE_LIST:
            return <WarehouseList field={field} fieldName={fieldName} defaultValue={defaultValue} store={store} params={params} options={field.getVariants(store, report, params) || []}  />;
        case ReportFieldType.ITEMS_LIST:
            return <ItemsList field={field}  fieldName={fieldName} defaultValue={defaultValue} store={store} params={params} options={field.getVariants(store, report, params) || []}  />;
        case ReportFieldType.PRODUCTS_LIST:
            return <ProductsList field={field}  fieldName={fieldName} defaultValue={defaultValue} store={store} params={params} options={field.getVariants(store, report, params) || []}  />;
        case ReportFieldType.DATETIME:
        case ReportFieldType.DELETED_DATETIME:
            return <DateTimeField field={field} fieldName={fieldName} defaultValue={defaultValue} />;
        default:
            return <></>;
    }
};


const ReportForm = ({ isEditMode, reportType, params}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


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


  // const store = useSelector(state => ({
  //   department: state.department || {},
  //   factorySite: state.factorySite || {},
  //   wareHouse: state.wareHouse || {},
  //   item: state.item.items || {},
  //   product:  state.product || {},
  //   user: state.user || {},
  //   group: state.group || {},
  //   report: state.report || {},
  //   factorySiteState: state.factorySiteState || {},
  //   wareHouseState: state.wareHouseState || {}
  // }));
  const reportId = params.get("id")
  console.log("reportId: ")
  console.log(reportId)


  useEffect(() => {
    if (reportId && isEditMode) {
      dispatch(fetchOneReportAction(reportId));
    }
  }, [reportId, isEditMode, dispatch]);


  const report = useSelector(state => state.report.reports[reportId]);

  useEffect(() => {
      if (isEditMode){
        if (report)
          reportDescriptions[report.type].fetch(report).forEach(dispatch);
      }else
        reportDescriptions[reportType].fetchCreate(report).forEach(dispatch);
  }, [reportType, report, dispatch]);

  const methods = useForm({ defaultValues: {} });  //setting defaults
  const { register, control } = methods;


  if (isEditMode && !report) return <NotFound/>

  reportType = isEditMode ? report.type : reportType;
  const reportDescription = reportDescriptions[reportType];

  const onSubmit = (data) => {
    console.log("data: ")
    console.log(data)
    const dateTimeString = `${data["createdAtDate"]}T${data["createdAtTime"]}:00`;

    var builder = new ReportBuilder().setType(reportType);
    if (isEditMode) builder = builder.setId(reportId)
    builder = builder.setId(reportId).setCreatedAt(new Date(dateTimeString).getTime())
    Object.keys(reportDescriptions[reportType].fields).forEach(fieldName => {

      const fieldDescription = reportDescriptions[reportType].fields[fieldName];

      if (fieldDescription && fieldDescription.set) {

        fieldDescription.set(builder, data[fieldName], report || {}, params);
      }
    });

    const reportData = builder.build();

    if (isEditMode) {
      reportData.id = report.id
      dispatch(updateReportAction(reportData));
    } else {
      dispatch(createReportAction(reportData));
    }
    navigate(-1);
  };
  console.log("reportType")
  console.log(reportType)

  const formattedDate = (report?.createdAt ? new Date(report.createdAt) : new Date()).toISOString().split('T')[0];
  const formattedTime = (report?.createdAt ? new Date(report.createdAt) : new Date()).toTimeString().split(' ')[0].substring(0, 5);
  return (
    <Card>
    <FormProvider {...methods}>
      <Form onSubmit={methods.handleSubmit(onSubmit)}>
        <CardHeader>
        <h2>{isEditMode ? 'Редактирование отчета' : 'Создание отчета'}</h2>

       {isEditMode && <h6>Идентификатор отчета: {reportId}</h6>}
        </CardHeader>
        <CardBody>
        {Object.keys(reportDescription.fields).map(fieldName => {
          const field = reportDescription.fields[fieldName];
          return (
            <>
            <div key={fieldName}>
              <GetFieldEditComponent
                    field = {field}
                    store = {store}
                    report = {report || {}}
                    fieldName = {fieldName}
                    reportType = {reportType}
                    isEditMode={isEditMode}
                    defaultVal = {""}
                    params = {params}
              />
            </div>
            <hr/>
            </>
          );
        })}
        </CardBody>
        <CardFooter>
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
          <Accordion.Header>Специальные</Accordion.Header>
          <Accordion.Body>
              <Form.Label>Дата создания</Form.Label>
              <Form.Control type="date" {...register("createdAtDate")} defaultValue={ formattedDate }/>

              <Form.Label>Время создания</Form.Label>
              <Form.Control type="time" {...register("createdAtTime")} defaultValue={ formattedTime }/>


          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

        <hr/>
        <Button type="submit">{isEditMode ? 'Save Changes' : 'Create Report'}</Button>
        </CardFooter>
      </Form>
    </FormProvider>
    </Card>
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
                <td><div><Link to={{pathname: "/Reports/details", search: `?id=${id}`}}>{id}</Link></div></td>
                <td>{reportDescriptions[reports[id].type].name}</td>
                <td>{new Date(reports[id].createdAt).toLocaleString()}</td>
                <td><div><Link to={{pathname: "/UserGroup/user/details", search: `?id=${reports[id].creatorId}`}}>🧑‍💼{(reports[id].creatorId && users[reports[id].creatorId]?.name) || ""}</Link></div></td>
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



export const ReportSelector = ({ reportTypes, operation, params }) => {
  return (
    <ButtonGroup>
      {reportTypes.map((reportType) => (
        <LinkContainer to={{pathname: `/Reports/${operation}/${reportType}`, search: "?" + Object.keys(params).map((key) => `${key}=${params[key]}`).join('&')}} key={reportType}>
          <Button variant="primary">
            Создать {reportDescriptions[reportType].name}
          </Button>
        </LinkContainer>
      ))}
    </ButtonGroup>
  );
};

export const ReportManagementPanel = () => {

  const {operation, reportType} = useParams();
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
            content = <ReportForm isEditMode = {false} reportType={reportType} params={queryParameters}/>;
            break;
        case 'edit':
            content = <ReportForm isEditMode = {true} params={queryParameters}/>;
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


