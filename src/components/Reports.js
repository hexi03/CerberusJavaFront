import React, { useEffect } from 'react';
import { Form, Button, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { navigate } from 'react-router-dom';
import { createReportAction, fetchOneReportAction, updateReportAction, fetchAllReportsAction } from '../actions/reportActions';
import ReportBuilder from '../models/ReportBuilder';

const ReportManagementPanel = () => {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();

  // Рендер формы для создания нового отчета
  const renderReportCreateForm = () => {
    const onSubmit = (data) => {
      dispatch(createReportAction((new ReportBuilder()).setTitle(data.title).build()));
      navigate(-1);
    };

    return (
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group controlId="formBasicTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" {...register('title')} />
        </Form.Group>
        <Button variant="primary" type="submit">Submit</Button>
      </Form>
    );
  };

  // Рендер формы для обновления информации об отчете
  const renderReportUpdateForm = () => {
    // Здесь вы можете использовать useParams() для получения id отчета из URL
    // Пока примерно:
    const reportId = 123; // Ваш ID отчета
    useEffect(() => {
      dispatch(fetchOneReportAction(reportId));
    }, [dispatch, reportId]);

    const report = useSelector(state => state.reports.report[reportId]);

    const onSubmit = (data) => {
      dispatch(updateReportAction((new ReportBuilder()).setTitle(data.title).setId(reportId).build()));
      navigate(-1);
    };

    return (
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group controlId="formBasicTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" defaultValue={report.title} {...register('title')} />
        </Form.Group>
        <Button variant="primary" type="submit">Submit</Button>
      </Form>
    );
  };

  // Рендер списка отчетов
  const renderReportList = () => {
    useEffect(() => {
      dispatch(fetchAllReportsAction());
    }, [dispatch]);

    const reports = useSelector(state => state.reports);

    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(report => (
            <tr key={report.id}>
              <td>{report.title}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <>
      <h2>Report Management</h2>
      {renderReportCreateForm()}
      {renderReportUpdateForm()}
      {renderReportList()}
    </>
  );
};

export default ReportManagementPanel;
