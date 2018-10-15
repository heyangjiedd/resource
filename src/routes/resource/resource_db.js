import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Cascader,
  Progress,
  Tabs,
  Radio,
} from 'antd';
import DescriptionList from 'components/DescriptionList';
import StandardTable from 'components/StandardTable';
import StandardTableNoCheck from 'components/StandardTableNoCheck';
import StandardTableNothing from 'components/StandardTableNothing';
import StandardTableNoPage from 'components/StandardTableNoPage';
import StandardTableRadio from 'components/StandardTableRadio';
import StandardTableEdit from 'components/StandardTableEdit';
import SimpleTableEdit from 'components/SimpleTableEdit';
import StandardTableRadioNopage from 'components/StandardTableRadioNopage';
import AnycSimpleTree from 'components/AnycSimpleTree';
import SimpleSelectTree from 'components/SimpleSelectTree';
import SimpleTree from 'components/SimpleTree';
import TagSelect from 'components/TagSelect';
import StandardFormRow from 'components/StandardFormRow';
import StandardTableNothingNoCloums from 'components/StandardTableNothingNoCloums';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ARR from '../../assets/arr';

import styles from './resource_db.less';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const { TextArea } = Input;
const { Option } = Select;
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
const { Description } = DescriptionList;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];
let itemDataStatus = 0;
let listItemData = {};
let createItemData = {};
let itemData = {};
let treeSelect = {};

const TestForm = Form.create()(props => {
  const { modalVisible, form, selectedRows, testHandleAdd, testList, testSuccess, testFail, handleModalVisible } = props;
  let percent = parseInt((testList.length / selectedRows.length) * 100);
  return (
    <Modal
      title="测试连通性"
      visible={modalVisible}
      onOk={() => handleModalVisible()}
      destroyOnClose={true}
      onCancel={() => handleModalVisible()}
    >
      <span>{testList.length == selectedRows.length?'测试完毕':'测试中...'}</span>
      <Row>
        <Progress percent={percent}/>
      </Row>
      <Row>
        <Col xl={16} lg={12} md={12} sm={24} xs={24}>
          <div>
            测试连通：<span style={{ marginLeft: '10px' }}>{testList.filter(item => {
            return item;
          }).length}</span>条
          </div>
        </Col>
        <Col xl={16} lg={12} md={12} sm={24} xs={24}>
          <div>
            测试未连通：<span style={{ color: 'red', marginLeft: '10px' }}>{testList.filter(item => {
            return !item;
          }).length}</span>条
          </div>
        </Col>
      </Row>
      <Row  style={{marginTop:10}}>
        <Col xl={16} lg={12} md={12} sm={24} xs={24}>
          <Button onClick={testHandleAdd}>重试</Button>
        </Col>
      </Row>
    </Modal>
  );
});
const ResourceDetail = Form.create()(props => {
  const {
    modalVisible, form, handleModalVisible, loading, data, columns, detailType, tableAndField,
    radioSwitch, radioSwitcHandle, operateLog, lifelist, httpItem, searchHandle, sqlList, excSql, field,
  } = props;
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
      md: { span: 16 },
    },
  };
  const exHandle = (index) => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      excSql(fieldsValue);
    });
  };
  const onChange = (value) => {
    radioSwitcHandle(value.target.value);
  };
  const gxxsjkdatacolumns = [];
  if(sqlList.length > 0){
    for (let feild in sqlList[0]){
      gxxsjkdatacolumns.push({
        title:feild,
        dataIndex:feild,
        width: 100,
      })
    }
  }
  const gxxsjkfieldcolumns = [
    {
      title: '字段名',
      width:'150px',
      dataIndex: 'name',
    }, {
      title: '字段描述',
      width:'150px',
      dataIndex: 'tableDesc',
    }, {
      title: '类型',
      width:'150px',
      dataIndex: 'type',
    }, {
      title: '长度',
      width:'150px',
      dataIndex: 'len',
    }];
  const fgxxsjkdatacolumns = [
    {
      title: 'Key',
      width:'150px',
      dataIndex: 'key',
    }, {
      title: 'Value',
      width:'150px',
      dataIndex: 'value',
    }, {
      title: 'Type',
      width:'150px',
      dataIndex: 'type',
    },
  ];
  let indexList = [];
  let indexAndOr = '';
  return (
    <Modal
      title="资源详情"
      visible={modalVisible}
      footer={null}
      destroyOnClose={true}
      width={900}
      onCancel={() => handleModalVisible()}
    >
      {detailType == 1 ?
        <div><Tabs defaultActiveKey="1" >
          <TabPane tab="数据详情" key="1">
            <DescriptionList size="large" title="过滤条件" style={{ marginBottom: 0 }}>
            </DescriptionList>
            <Row>
              <Col md={12} sm={24}>
                <FormItem {...formItemLayout} label="请选择表/视图">
                  <RadioGroup onChange={onChange} defaultValue={radioSwitch}>
                    <Radio value='view' defaultChecked={true}>视图操作</Radio>
                    <Radio value='sql'>SQL操作</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
            </Row>
            {radioSwitch == 'view' ? <div>
                <SimpleTableEdit
                  scroll={{ y: 180 }}
                  search={() => {
                    searchHandle(indexList, indexAndOr);
                  }
                  }
                  data={[]}
                  selectItemFeild={field}
                  transMsg={(index, andOr) => {
                    indexList = index;
                    indexAndOr = andOr;
                  }}
                />
                <DescriptionList size="large" col={1} title="描述" style={{ marginBottom: 32 }}>
                  <Description></Description>
                </DescriptionList>
              </div> :
              <div>
                <DescriptionList size="large" title="请编写SQL语句" style={{ marginBottom: 0 }}>
                </DescriptionList>
                <FormItem>
                  {form.getFieldDecorator('sql')(
                    <TextArea
                      style={{ minHeight: 32 }}
                      rows={4}
                    />,
                  )}
                </FormItem>
                {/*<Button size="small" style={{ marginRight: 20 }} onClick={() => {*/}
                {/*}}>*/}
                {/*SQL语法检测*/}
                {/*</Button>*/}
                <Button size='small' style={{ marginBottom: 10 }} type="primary" onClick={exHandle}>
                  执行SQL语句
                </Button>
              </div>}
            <DescriptionList size="large" title="数据详情" style={{ marginBottom: 32 }}>
            </DescriptionList>
            <StandardTableNothingNoCloums
              loading={loading}
              data={sqlList}
              columns={gxxsjkdatacolumns}
            />
          </TabPane>
          <TabPane tab="表结构" key="2">
            {tableAndField.map(item => {
              return (<div>
                <DescriptionList size="large" col={1} title="信息资源详情" style={{ marginBottom: 32 }}>
                  <Description term="表名">{itemData.name}</Description>
                  <Description term="表类型">{itemData.type}</Description>
                  <Description term="表注释">{itemData.description}</Description>
                </DescriptionList>
                <DescriptionList size="large" title="字段信息" style={{ marginBottom: 32 }}>
                  <StandardTableNothing
                    loading={loading}
                    data={field}
                    columns={gxxsjkfieldcolumns}
                  /></DescriptionList></div>);
            })}

          </TabPane>
        </Tabs></div> :
        <div>
          <DescriptionList size="large" col={2} title="" style={{ marginBottom: 32 }}>
            <Description term="集合名称">{itemData.name}</Description>
            <Description term="所属数据源">{listItemData.sourceName}</Description>
          </DescriptionList>
          <StandardTableNothing
            loading={loading}
            data={sqlList}
            columns={fgxxsjkdatacolumns}
          />
        </div>}
    </Modal>
  );
});
@connect(({ resource_db, catalog, classify, centersource, loading }) => ({
  resource_db,
  catalog,
  classify,
  centersource,
  loading: loading.models.resource_db,
}))
@Form.create()
export default class ResourceClassify extends PureComponent {
  state = {
    modalVisible: false,
    testModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    testList: [],
    testSuccess: 0,
    testFail: 0,
    isFileDetail: false,
    detailType: 1,
    choiceFeild: [],
    choiceFeildCount: 0,
    radioSwitch: 'view',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'centersource/fetchOrgList',
      callback: () => {
        dispatch({
          type: 'classify/tree',
          callback: () => {
            this.fetchHandle();
          },
        });
      },
    });
  }

  fetchHandle(params) {
    const { dispatch } = this.props;
    params = { relationDb: 'mysql,oracle,sqlserver,db2', unrelationDb: 'mongo,hbase', ...params };
    dispatch({
      type: 'centersource/fetch',
      payload: params,
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    this.fetchHandle(params);
    // dispatch({
    //   type: 'centersource/fetch',
    //   payload: params,
    // });
  };
  handleStandardTableChangeDetail = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'centersource/fetchTablePage',
      payload: { ...params, id: listItemData.id },
    });
  };
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    this.fetchHandle(params);
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'resource_db/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };
      this.setState({
        formValues: values,
      });
      if (fieldsValue.sourceType && fieldsValue.sourceType[0] == 'all') {

      } else if (fieldsValue.sourceType && fieldsValue.sourceType[0] == '关系型数据库') {
        if (fieldsValue.sourceType[1] == 'all') {
          values.relationDb = 'mysql,oracle,sqlserver,db2';
          values.unrelationDb = undefined;
        } else {
          values.relationDb = fieldsValue.sourceType[1];
          values.unrelationDb = undefined;
        }
      } else if (fieldsValue.sourceType && fieldsValue.sourceType[0] == '非关系型数据库') {
        if (fieldsValue.sourceType[1] == 'all') {
          values.relationDb = undefined;
          values.unrelationDb = 'mongo,hbase';
        } else {
          values.relationDb = undefined;
          values.unrelationDb = fieldsValue.sourceType[1];
        }
      }
      values.sourceType = undefined;
      this.fetchHandle(values);
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };
  handleDelete = () => {
    confirm({
      title: '确定删除选中数据?',
      content: '删除数据不可恢复，请悉知！！！',
      onOk() {
        return new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() {
      },
    });
  };
  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'resource_db/add',
      payload: {
        description: fields.desc,
      },
    });

    message.success('添加成功');
    this.setState({
      modalVisible: false,
    });
  };
  testHandleModalVisible = flag => {
    this.setState({
      testModalVisible: !!flag,
    });
  };

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  testHandleAdd = fields => {
    const { dispatch } = this.props;
    if(this.state.selectedRows.length <= 0){
      message.error('请先选择数据')
      return
    }
    // 之前信息的置空
    this.setState({
      testList: [],
    });
    this.setState({
      testSuccess: 0,
      testFail: 0,
    });
    this.setState({
      testModalVisible: true,
    });
    this.state.selectedRows.forEach((item, index) => {
      dispatch({
        type: 'centersource/test',
        payload: {
          id: item.id,
        },
        callback: (res) => {
          this.state.testList.push(res);
          this.setState({
            testList: this.state.testList,
          });
          if (res===true) {
            this.setState({
              testSuccess: this.state.testSuccess++,
            });
          } else {
            this.setState({
              testFail: this.state.testFail++,
            });
          }
          if (this.state.testList.length === this.state.selectedRows.length) {
            message.success('测试完毕');
          }
        },
      });
    });
  };

  handleTree = data => {
    const { dispatch } = this.props;
    createItemData.resourceId = data[0];
    this.fetchHandle({ resourceId: createItemData.resourceId });
    // dispatch({
    //   type: 'centersource/fetch',
    //   payload: { resourceId: createItemData.resourceId },
    // });
  };
  getFileListHandle = (index, flag) => {
    const { dispatch } = this.props;
    listItemData = index;
    dispatch({
      type: 'centersource/fetchTablePage',
      payload: {
        id: listItemData.id,
      },
    });
    this.getFileListHandleModalVisible(flag);
  };
  getFileDetailHandle = (index, flag) => {
    const { dispatch } = this.props;
    itemData = index;
    if (listItemData.sourceType == 'hbase' || listItemData.sourceType == 'MongoDB') {
      this.setState({
        detailType: 2,
      });
    }
    else {
      this.setState({
        detailType: 1,
      });
    }
    dispatch({
      type: 'catalog/tableField',
      payload: { tableId: index.id },
    });
    this.handleModalVisible(flag);
  };
  getFileListHandleModalVisible = (flag) => {
    this.setState({
      isFileDetail: !!flag,
    });
  };
  radioSwitcHandle = (index) => {
    this.setState({
      radioSwitch: index,
    });
  };
  excSql = (index) => {
    const { dispatch } = this.props;
    let params = {
      'params': index.sql,
      'tableId': itemData.id,
    };
    dispatch({
      type: 'centersource/fetchTableData',
      payload: params,
    });
  };
  searchHandle = (list, value) => {
    const { dispatch } = this.props;
    let param = list.map(item => {
      return {
        'fieldName': item.field,
        'operation': item.condition,
        'value': item.value,
        'tableId': item.tableId,
        'valueType': item.valueType,
      };
    });
    let params = {
      'accordWith': value || '$and',
      'tableId': itemData.id,
      'params': param,
    };
    dispatch({
      type: 'centersource/fetchView',
      payload: params,
    });
  };

  render() {
    const {
      centersource: { sqlList, data, dataListPage, orgList,dataList, lifelist: { list: lifelist }, httpItem },
      loading,
      classify: { treeData },
      catalog: { catalogItem, field, tableAndField, operateLog },
      form,
    } = this.props;
    const { selectedRows, modalVisible, testModalVisible, testList, isFileDetail, detailType, radioSwitch } = this.state;

    const columns = [
      {
        title: '数据源名称',
        width:'150px',
        dataIndex: 'sourceName',
      },
      {
        title: '数据源类型',
        width:'150px',
        dataIndex: 'sourceType',
      },
      {
        title: '所属组织机构',
        width:'150px',
        dataIndex: 'orgId',
        render(val) {
          let org = orgList.filter(r => {
            return val == r.deptCode;
          });
          return <span>{org[0] && org[0].deptShortName}</span>;
        },
      },
      {
        title: '所属资源分类',
        width:'150px',
        dataIndex: 'resourceId',
        render(val) {
          let classfy = treeData.filter(r => {
            return val == r.id;
          });
          return <span>{classfy[0] && classfy[0].name}</span>;
        },
      },
      {
        title: '最近连接时间',
        width:'150px',
        dataIndex: 'createTime',
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '-'}</span>,
      },
      {
        title: '连通状态',
        width:'150px',
        dataIndex: 'linkStatus',
        render(val) {
          return <Badge status={val == 'on' ? 'success' : 'error'} text={val == 'on' ? '连通' : '未连通'}/>;
        },
      },
      {
        title: '操作',
        width:'100px',
        render: (text, record, index) => {
          return (
            <Fragment>
              <a onClick={() => {
                this.getFileListHandle(text, true);
              }}>详情</a>
            </Fragment>
          );
        },
      },
    ];
    const detailColumns = [
      {
        title: '序号',
        width:'150px',
        render: (text, record, index) => <span>{index + 1}</span>,
      },
      {
        title: '表名',
        width:'150px',
        dataIndex: 'name',
      },
      {
        title: '表描述',
        width:'150px',
        dataIndex: 'description',
      },
      {
        title: '所属数据源',
        width:'150px',
        render: (text, record, index) => <span>{listItemData.sourceName}</span>,
      },
      {
        title: '数据源类型',
        width:'150px',
        render: (text, record, index) => <span>{listItemData.sourceType}</span>,
      },
      {
        title: '表类型',
        width:'150px',
        dataIndex: 'type',
      },
      {
        title: '字段数',
        width:'150px',
        dataIndex: 'selectedFieldNum',
      },
      {
        title: '操作',
        width:'150px',
        render: (text, record, index) => {
          return (
            <Fragment>
              <a onClick={() => {
                this.getFileDetailHandle(text, true);
              }}>查看</a>
            </Fragment>
          );
        },
      },
    ];
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const testParentMethods = {
      handleModalVisible: this.testHandleModalVisible,
      selectedRows: this.state.selectedRows,
      testList: this.state.testList,
      testHandleAdd: this.testHandleAdd,
    };
    const parentMethodsResource = {
      handleAdd: this.handleAddResource,
      radioSwitcHandle: this.radioSwitcHandle,
      operateLog: operateLog,
      sqlList: sqlList,
      field: field,
      excSql: this.excSql,
      searchHandle: this.searchHandle,
      lifelist: lifelist,
      httpItem: httpItem,
      radioSwitch: radioSwitch,
      tableAndField: tableAndField,
      detailType: detailType,
      handleModalVisible: this.handleModalVisible,
    };
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        md: { span: 16 },
      },
    };
    const { getFieldDecorator } = form;
    return (
      <PageHeaderLayout>
        <div className={styles.flexMain}>
          <SimpleTree
            data={treeData}
            handleTree={this.handleTree}
            title={'数据库'}
          />
          {isFileDetail ? <Card bordered={false} className={styles.flexTable}>
            <div className={styles.tableList}>
              <Row gutter={{ md: 2, lg: 6, xl: 12 }}>
                <Col md={6} sm={24}>
                  <FormItem>
                    <Button onClick={() => {
                      this.getFileListHandleModalVisible(false);
                    }}>
                      返回
                    </Button>
                  </FormItem>
                </Col>
              </Row>
              <StandardTableNoCheck
                selectedRows={[]}
                loading={loading}
                data={dataListPage}
                columns={detailColumns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChangeDetail}
              />
            </div>
          </Card> : <Card bordered={false} className={styles.flexTable}>
            <div className={styles.tableList}>
              <Form onSubmit={this.handleSearch} >
                <Row gutter={{ md: 2, lg: 6, xl: 12 }}>
                  <Col md={6} sm={24}>
                    <FormItem>
                      <Button icon="desktop" type="primary" onClick={() => this.testHandleAdd(true)}>
                        测试连通性
                      </Button>
                    </FormItem>
                  </Col>
                  <Col md={8} sm={24}>
                    <FormItem {...formItemLayout} label="数据源类型">
                      {getFieldDecorator('sourceType')(<Cascader style={{ width: 100 + '%' }} options={ARR.CASCADERTWO}
                                                                 placeholder="请选择数据源/数据库"/>)}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={24}>
                    <FormItem>
                      {getFieldDecorator('sourceName')(<Input placeholder="请输入数据源名称"/>)}
                    </FormItem>
                  </Col>
                  <Col md={2} sm={24}>
                    <FormItem>
                      <Button type="primary" htmlType="submit">
                        查询
                      </Button>
                    </FormItem>
                  </Col>
                </Row>
              </Form>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading}
                data={data}
                columns={columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card>

          }

        </div>
        <TestForm {...testParentMethods} modalVisible={testModalVisible}/>
        {/*<CreateForm {...parentMethods} modalVisible={modalVisible}/>*/}
        <ResourceDetail {...parentMethodsResource} modalVisible={modalVisible}/>
      </PageHeaderLayout>
    );
  }
}
