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
  Progress
} from 'antd';
import StandardTable from 'components/StandardTable';
import SimpleTree from 'components/SimpleTree';
import TagSelect from 'components/TagSelect';
import StandardFormRow from 'components/StandardFormRow';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './resource_db.less';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const { TextArea } = Input;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];
let itemDataStatus = 0;
let listItemData = {};
let createItemData = {};
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
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem {...formItemLayout} label="数据库类型">
        {form.getFieldDecorator('desc1', {
          rules: [{ required: true, message: 'Please input some description...' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem {...formItemLayout} label="数据源名称">
        {form.getFieldDecorator('desc2', {
          rules: [{ required: true, message: 'Please input some description...' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem {...formItemLayout} label="所属组织机构">
        {form.getFieldDecorator('desc3', {
          rules: [{ required: true, message: 'Please input some description...' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem {...formItemLayout} label="资源分类">
        {form.getFieldDecorator('desc4', {
          rules: [{ required: true, message: 'Please input some description...' }],
        })(
          <Select placeholder="请选择" style={{ width: '100%' }}>
          <Option value="0">关闭</Option>
          <Option value="1">运行中</Option>
        </Select>,)}
      </FormItem>
      <FormItem {...formItemLayout} label="IP地址">
        {form.getFieldDecorator('desc5', {
          rules: [{ required: true, message: 'Please input some description...' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem {...formItemLayout} label="端口">
        {form.getFieldDecorator('desc6', {
          rules: [{ required: true, message: 'Please input some description...' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem {...formItemLayout} label="数据库名称/SID">
        {form.getFieldDecorator('desc7', {
          rules: [{ required: true, message: 'Please input some description...' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem {...formItemLayout} label="用户名">
        {form.getFieldDecorator('desc8', {
          rules: [{ required: true, message: 'Please input some description...' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem {...formItemLayout} label="密码">
        {form.getFieldDecorator('desc9', {
          rules: [{ required: true, message: 'Please input some description...' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem {...formItemLayout} label="数据源描述">
        {form.getFieldDecorator('flms', {
          rules: [
            {
              required: true,
              message: '请输入数据源描述',
            },
          ],initialValue:listItemData.owner
        })(
          <TextArea
            style={{ minHeight: 32 }}
            placeholder="请输入你的数据源描述"
            rows={4}
          />
        )}
      </FormItem>
    </Modal>
  );
});
const TestForm = Form.create()(props => {
  const { modalVisible, form , selectedRows, testList, handleModalVisible } = props;
  let percent = 50;
  return (
    <Modal
      title="测试连通性"
      visible={modalVisible}
      onOk={() => handleModalVisible()}
      destroyOnClose={true}
      onCancel={() => handleModalVisible()}
    >
      <Row>
        <Progress percent={(testList.length / selectedRows.length)*100}/>
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
          <Button type="primary">重试</Button>
        </Col>
      </Row>
    </Modal>
  );
});
@connect(({ resource_db,classify,centersource, loading }) => ({
  resource_db,
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
    listItemData: {},
    testList: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'centersource/fetch',
    });
    dispatch({
      type: 'classify/tree',
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
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'centersource/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'centersource/fetch',
      payload: {},
    });
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

      dispatch({
        type: 'centersource/fetch',
        payload: values,
      });
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
      onCancel() {},
    });
  }
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
            <FormItem >
              {getFieldDecorator('status')(
                <Select placeholder="数据库类型" style={{ width: '100%' }}>
                  <Option value="0">关系型数据库</Option>
                  <Option value="1">非关系型数据库</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={3} sm={24}>
            <FormItem >
              {getFieldDecorator('status')(
                <Select placeholder="连通状态" style={{ width: '100%' }}>
                  <Option value="0">已连通</Option>
                  <Option value="1">未连通</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={3} sm={24}>
            <FormItem >
              {getFieldDecorator('status')(
                <Select placeholder="同步状态" style={{ width: '100%' }}>
                  <Option value="0">已同步</Option>
                  <Option value="1">未同步</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('no')(<Input placeholder="请输入数据源名称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
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
            <FormItem >
              {getFieldDecorator('status')(
                <Select placeholder="数据库类型" style={{ width: '100%' }}>
                  <Option value="0">关系型数据库</Option>
                  <Option value="1">非关系型数据库</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={3} sm={24}>
            <FormItem >
              {getFieldDecorator('status')(
                <Select placeholder="连通状态" style={{ width: '100%' }}>
                  <Option value="0">已连通</Option>
                  <Option value="1">未连通</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={3} sm={24}>
            <FormItem >
              {getFieldDecorator('status')(
                <Select placeholder="同步状态" style={{ width: '100%' }}>
                  <Option value="0">已同步</Option>
                  <Option value="1">未同步</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('no')(<Input placeholder="请输入数据源名称" />)}
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
              收起 <Icon type="up" />
            </a>
            </span>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <StandardFormRow title="关系型数据库" block style={{ paddingBottom: 5 }}>
            <FormItem style={{ marginBottom: 0 }}>
              {getFieldDecorator('category')(
                <TagSelect onChange={this.handleFormSubmit}>
                  <TagSelect.Option value="cat1">MySQL</TagSelect.Option>
                  <TagSelect.Option value="cat2">Oracle</TagSelect.Option>
                  <TagSelect.Option value="cat3">SQLServer</TagSelect.Option>
                  <TagSelect.Option value="cat4">DB2</TagSelect.Option>
                </TagSelect>
              )}
            </FormItem>
          </StandardFormRow>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <StandardFormRow title="非关系型数据库" block style={{ paddingBottom: 5 }}>
            <FormItem style={{ marginBottom: 0 }}>
              {getFieldDecorator('category')(
                <TagSelect onChange={this.handleFormSubmit}>
                  <TagSelect.Option value="cat1">MongoDB</TagSelect.Option>
                  <TagSelect.Option value="cat2">Hbase</TagSelect.Option>
                </TagSelect>
              )}
            </FormItem>
          </StandardFormRow>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <StandardFormRow title="API" block style={{ paddingBottom: 5 }}>
            <FormItem style={{ marginBottom: 0 }}>
              {getFieldDecorator('category')(
                <TagSelect onChange={this.handleFormSubmit} >
                  <TagSelect.Option value="cat1">HTTP</TagSelect.Option>
                  <TagSelect.Option value="cat2">HTTPS</TagSelect.Option>
                  <TagSelect.Option value="cat3">WSDL</TagSelect.Option>
                  <TagSelect.Option value="cat4">REST</TagSelect.Option>
                </TagSelect>
              )}
            </FormItem>
          </StandardFormRow>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <StandardFormRow title="普通文件系统" block style={{ paddingBottom: 5 }}>
            <FormItem style={{ marginBottom: 0 }}>
              {getFieldDecorator('category')(
                <TagSelect onChange={this.handleFormSubmit} >
                  <TagSelect.Option value="cat1">FTP</TagSelect.Option>
                  <TagSelect.Option value="cat2">SFTP</TagSelect.Option>
                  <TagSelect.Option value="cat3">本地磁盘</TagSelect.Option>
                  <TagSelect.Option value="cat4">共享文件件</TagSelect.Option>
                </TagSelect>
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
    this.setState({
      testModalVisible: true,
    });
    this.state.selectedRows.forEach((item, index) => {
      dispatch({
        type: 'centersource/test',
        payload: {
          id: item.id,
        },
        callback: (index) => {
          this.state.testList.push(index);
          this.setState({
            testList: this.state.testList,
          });
          if (index === this.state.selectedRows.length - 1) {
            message.success('测试完毕');
          }
        },
      });
    });
  };
  handleTree = data => {
    const { dispatch } = this.props;
    createItemData.resourceId = data[0];
    dispatch({
      type: 'centersource/fetch',
      payload: {resourceId:createItemData.resourceId},
    });
  }
  render() {
    const {
      centersource: { data },
      loading,
      classify: { treeData },
      form
    } = this.props;
    const { selectedRows, modalVisible,listItemData,testModalVisible } = this.state;

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
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '连通状态',
        dataIndex: 'linkStatus',
        render(val) {
          return <Badge status={val ? 'success' : 'error'}/>;
        },
      },
      {
        title: '操作',
        render: (text, record, index) => {
          return (
            <Fragment>
              <a onClick={() => {
                this.updateHandleModal(text);
              }}>详情</a>
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
    };
    const options = [{
      value: 'gxxsjk',
      label: '关系型数据库',
      children: [{
        value: 'gxxsjk_MySQL', label: 'MySQL',
      }, {
        value: 'gxxsjk_Oracle', label: 'Oracle',
      }, {
        value: 'gxxsjk_SQLServer', label: 'SQLServer',
      }, {
        value: 'gxxsjk_DB2', label: 'DB2',
      }],
    }, {
      value: 'fgxxsjk',
      label: '非关系型数据库',
      children: [{
        value: 'fgxxsjk_MongoDB', label: 'MongoDB',
      }, {
        value: 'fgxxsjk_Hbase', label: 'Hbase',
      }],
    }, {
      value: 'API',
      label: 'API',
      children: [{
        value: 'API_HTTP', label: 'HTTP',
      }, {
        value: 'API_HTTPS', label: 'HTTPS',
      }, {
        value: 'API_WSDL', label: 'WSDL',
      }, {
        value: 'API_REST', label: 'REST',
      }],
    }, {
      value: 'ptwj',
      label: '普通文件',
      children: [{
        value: 'ptwj_FTP', label: 'FTP',
      }, {
        value: 'ptwj_SFTP', label: 'SFTP',
      }, {
        value: 'ptwj_bdcp', label: '本地磁盘',
      }, {
        value: 'ptwj_gxwjj', label: '共享文件夹',
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
    const onChange = (value)=> {
    }
    const { getFieldDecorator } = form;
    return (
      <PageHeaderLayout>
        <div className={styles.flexMain}>
        <SimpleTree
          data={treeData}
          handleTree={this.handleTree}
          title={'数据库'}
        />
        <Card bordered={false}  className={styles.flexTable}>
          <div className={styles.tableList}>
            <Row gutter={{ md: 2, lg:6, xl: 12 }}>
              <Col md={6} sm={24}>
                <FormItem>
                  <Button icon="desktop" type="primary" onClick={() => this.testHandleAdd(true)}>
                    测试连通性
                  </Button>
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem {...formItemLayout}  label="数据源类型">
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
        </div>
        <TestForm {...testParentMethods} modalVisible={testModalVisible}/>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderLayout>
    );
  }
}
