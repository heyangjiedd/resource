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
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

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

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
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
  return (
    <Modal
      title="修改配置"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem {...formItemLayout} label="数据源类型">
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: 'Please input some description...' }],
        })(<Input placeholder="请输入"/>)}
      </FormItem>
      <FormItem {...formItemLayout} label="数据库类型">
        {form.getFieldDecorator('desc1', {
          rules: [{ required: true, message: 'Please input some description...' }],
        })(<Input placeholder="请输入"/>)}
      </FormItem>
      <FormItem {...formItemLayout} label="数据源名称">
        {form.getFieldDecorator('desc2', {
          rules: [{ required: true, message: 'Please input some description...' }],
        })(<Input placeholder="请输入"/>)}
      </FormItem>
      <FormItem {...formItemLayout} label="所属组织机构">
        {form.getFieldDecorator('desc3', {
          rules: [{ required: true, message: 'Please input some description...' }],
        })(<Input placeholder="请输入"/>)}
      </FormItem>
      <FormItem {...formItemLayout} label="资源分类">
        {form.getFieldDecorator('desc4', {
          rules: [{ required: true, message: 'Please input some description...' }],
        })(
          <Select placeholder="请选择" style={{ width: '100%' }}>
            <Option value="0">关闭</Option>
            <Option value="1">运行中</Option>
          </Select>)}
      </FormItem>
      <FormItem {...formItemLayout} label="IP地址">
        {form.getFieldDecorator('desc5', {
          rules: [{ required: true, message: 'Please input some description...' }],
        })(<Input placeholder="请输入"/>)}
      </FormItem>
      <FormItem {...formItemLayout} label="端口">
        {form.getFieldDecorator('desc6', {
          rules: [{ required: true, message: 'Please input some description...' }],
        })(<Input placeholder="请输入"/>)}
      </FormItem>
      <FormItem {...formItemLayout} label="数据库名称/SID">
        {form.getFieldDecorator('desc7', {
          rules: [{ required: true, message: 'Please input some description...' }],
        })(<Input placeholder="请输入"/>)}
      </FormItem>
      <FormItem {...formItemLayout} label="用户名">
        {form.getFieldDecorator('desc8', {
          rules: [{ required: true, message: 'Please input some description...' }],
        })(<Input placeholder="请输入"/>)}
      </FormItem>
      <FormItem {...formItemLayout} label="密码">
        {form.getFieldDecorator('desc9', {
          rules: [{ required: true, message: 'Please input some description...' }],
        })(<Input placeholder="请输入"/>)}
      </FormItem>
      <FormItem {...formItemLayout} label="数据源描述">
        {form.getFieldDecorator('flms', {
          rules: [
            {
              required: true,
              message: '请输入数据源描述',
            },
          ], initialValue: listItemData.owner,
        })(
          <TextArea
            style={{ minHeight: 32 }}
            placeholder="请输入你的数据源描述"
            rows={4}
          />,
        )}
      </FormItem>
    </Modal>
  );
});
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
      <Row>
        <Col xl={16} lg={12} md={12} sm={24} xs={24}>
          <Button type="primary" onClick={testHandleAdd}>重试</Button>
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
  const gxxsjkdatacolumns = [
    {
      title: '姓名',
      dataIndex: 'sourceName',
    },
    {
      title: '性别',
      dataIndex: 'sourceType',
    },
    {
      title: '年龄',
      dataIndex: 'content',
    }, {
      title: '身份证号码',
      dataIndex: 'content',
    }, {
      title: '地址',
      dataIndex: 'content',
    }];
  const gxxsjkfieldcolumns = [
    {
      title: '字段名',
      dataIndex: 'name',
    }, {
      title: '字段描述',
      dataIndex: 'tableDesc',
    }, {
      title: '类型',
      dataIndex: 'type',
    }, {
      title: '长度',
      dataIndex: 'len',
    }];
  const fgxxsjkdatacolumns = [
    {
      title: 'Key',
      dataIndex: 'key',
    }, {
      title: 'Value',
      dataIndex: 'value',
    }, {
      title: 'Type',
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
        <div><Tabs defaultActiveKey="2">
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
            <StandardTableNothing
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
    this.fetchHandle();
    dispatch({
      type: 'classify/tree',
    });
  }

  fetchHandle(params) {
    const { dispatch } = this.props;
    params = { ...params, file: 'mysql,oracle,sqlserver,db2', unrelationDb: 'mongo,hbase' };
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
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });
      this.fetchHandle(values);
      // dispatch({
      //   type: 'centersource/fetch',
      //   payload: values,
      // });
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

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('status')(
                <Select placeholder="数据库类型" style={{ width: '100%' }}>
                  <Option value="0">关系型数据库</Option>
                  <Option value="1">非关系型数据库</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={3} sm={24}>
            <FormItem>
              {getFieldDecorator('status')(
                <Select placeholder="连通状态" style={{ width: '100%' }}>
                  <Option value="0">已连通</Option>
                  <Option value="1">未连通</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={3} sm={24}>
            <FormItem>
              {getFieldDecorator('status')(
                <Select placeholder="同步状态" style={{ width: '100%' }}>
                  <Option value="0">已同步</Option>
                  <Option value="1">未同步</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('no')(<Input placeholder="请输入数据源名称"/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down"/>
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('status')(
                <Select placeholder="数据库类型" style={{ width: '100%' }}>
                  <Option value="0">关系型数据库</Option>
                  <Option value="1">非关系型数据库</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={3} sm={24}>
            <FormItem>
              {getFieldDecorator('status')(
                <Select placeholder="连通状态" style={{ width: '100%' }}>
                  <Option value="0">已连通</Option>
                  <Option value="1">未连通</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={3} sm={24}>
            <FormItem>
              {getFieldDecorator('status')(
                <Select placeholder="同步状态" style={{ width: '100%' }}>
                  <Option value="0">已同步</Option>
                  <Option value="1">未同步</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('no')(<Input placeholder="请输入数据源名称"/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
               <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up"/>
            </a>
            </span>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <StandardFormRow title="关系型数据库" block style={{ paddingBottom: 5 }}>
            <FormItem style={{ marginBottom: 0 }}>
              {getFieldDecorator('category')(
                <TagSelect onChange={this.handleFormSubmit}>
                  <TagSelect.Option value="mysql">mysql</TagSelect.Option>
                  <TagSelect.Option value="oracle">oracle</TagSelect.Option>
                  <TagSelect.Option value="sqlserver">sqlserver</TagSelect.Option>
                  <TagSelect.Option value="db2">db2</TagSelect.Option>
                </TagSelect>,
              )}
            </FormItem>
          </StandardFormRow>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <StandardFormRow title="非关系型数据库" block style={{ paddingBottom: 5 }}>
            <FormItem style={{ marginBottom: 0 }}>
              {getFieldDecorator('category')(
                <TagSelect onChange={this.handleFormSubmit}>
                  <TagSelect.Option value="mongo">mongo</TagSelect.Option>
                  <TagSelect.Option value="hbase">hbase</TagSelect.Option>
                </TagSelect>,
              )}
            </FormItem>
          </StandardFormRow>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <StandardFormRow title="API" block style={{ paddingBottom: 5 }}>
            <FormItem style={{ marginBottom: 0 }}>
              {getFieldDecorator('category')(
                <TagSelect onChange={this.handleFormSubmit}>
                  <TagSelect.Option value="http">http</TagSelect.Option>
                  <TagSelect.Option value="https">https</TagSelect.Option>
                  <TagSelect.Option value="wsdl">wsdl</TagSelect.Option>
                  <TagSelect.Option value="rest">rest</TagSelect.Option>
                </TagSelect>,
              )}
            </FormItem>
          </StandardFormRow>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <StandardFormRow title="普通文件系统" block style={{ paddingBottom: 5 }}>
            <FormItem style={{ marginBottom: 0 }}>
              {getFieldDecorator('category')(
                <TagSelect onChange={this.handleFormSubmit}>
                  <TagSelect.Option value="ftp">ftp</TagSelect.Option>
                  <TagSelect.Option value="sftp">sftp</TagSelect.Option>
                  <TagSelect.Option value="本地磁盘">本地磁盘</TagSelect.Option>
                  <TagSelect.Option value="共享文件件">共享文件件</TagSelect.Option>
                </TagSelect>,
              )}
            </FormItem>
          </StandardFormRow>
        </Row>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  testHandleAdd = fields => {
    const { dispatch } = this.props;
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
          if (res) {
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
    if (listItemData.sourceType == 'hbase' || listItemData.sourceType == 'mongo') {
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
      centersource: { sqlList, data, dataListPage, dataList, lifelist: { list: lifelist }, httpItem },
      loading,
      classify: { treeData },
      catalog: { catalogItem, field, tableAndField, operateLog },
      form,
    } = this.props;
    const { selectedRows, modalVisible, testModalVisible, testList, isFileDetail, detailType, radioSwitch } = this.state;

    const columns = [
      {
        title: '数据源名称',
        dataIndex: 'sourceName',
      },
      {
        title: '数据源类型',
        dataIndex: 'sourceType',
      },
      {
        title: '所属组织机构',
        dataIndex: 'orgId',
      },
      {
        title: '所属资源分类',
        dataIndex: 'status',
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]}/>;
        },
      },
      {
        title: '最近连接时间',
        dataIndex: 'createTime',
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '-'}</span>,
      },
      {
        title: '连通状态',
        dataIndex: 'linkStatus',
        render(val) {
          return <Badge status={val ? 'success' : 'error'} text={val || '未连通'}/>;
        },
      },
      {
        title: '操作',
        width: 10,
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
        render: (text, record, index) => <span>{index + 1}</span>,
      },
      {
        title: '表名',
        dataIndex: 'name',
      },
      {
        title: '表描述',
        dataIndex: 'description',
      },
      {
        title: '所属数据源',
        render: (text, record, index) => <span>{listItemData.sourceName}</span>,
      },
      {
        title: '数据源类型',
        render: (text, record, index) => <span>{listItemData.sourceType}</span>,
      },
      {
        title: '表类型',
        dataIndex: 'type',
      },
      {
        title: '字段数',
        dataIndex: 'selectedFieldNum',
      },
      {
        title: '操作',
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
    const options = [
      {
        value: '关系型数据库',
        label: '关系型数据库',
        children: [{
          value: 'mysql', label: 'mysql',
        }, {
          value: 'oracle', label: 'oracle',
        }, {
          value: 'sqlserver', label: 'sqlserver',
        }, {
          value: 'db2', label: 'db2',
        }],
      }, {
        value: '非关系型数据库',
        label: '非关系型数据库',
        children: [{
          value: 'mongo', label: 'mongo',
        }, {
          value: 'hbase', label: 'hbase',
        }],
      }, {
        value: 'API',
        label: 'API',
        children: [{
          value: 'http', label: 'http',
        }, {
          value: 'https', label: 'https',
        }, {
          value: 'wsdl', label: 'wsdl',
        }, {
          value: 'rest', label: 'rest',
        }],
      }, {
        value: '普通文件',
        label: '普通文件',
        children: [{
          value: 'ftp', label: 'ftp',
        }, {
          value: 'sftp', label: 'sftp',
        }, {
          value: '本地磁盘', label: '本地磁盘',
        }, {
          value: '共享文件夹', label: '共享文件夹',
        }],
      }];
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
    const onChange = (value) => {
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
              <StandardTable
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
                    <Cascader style={{ width: 100 + '%' }} options={options} onChange={onChange}
                              placeholder="请选择数据源/数据库"/>
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem>
                    {getFieldDecorator('no')(<Input placeholder="请输入数据源名称"/>)}
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
