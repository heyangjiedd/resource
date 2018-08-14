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
  Progress,
  Cascader,
  Steps
} from 'antd';
import StandardTable from 'components/StandardTable';
import SimpleTree from 'components/SimpleTree';
import TagSelect from 'components/TagSelect';
import StandardFormRow from 'components/StandardFormRow';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './resourceClassify.less';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const { TextArea } = Input;
const { Option } = Select;
const Step = Steps.Step;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];
let listItemData = {};

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, handleItem, item } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
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
    value: '非关系型数据库',
    label: 'fgxxsjk',
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
  const firstFooter = (<Row>
    <Col md={24} sm={24}>
      <Button type="primary" onClick={() => {
        handleItem(2);
      }}>
        下一步
      </Button>
      <Button onClick={() => {
        handleModalVisible(false);
      }}>
        取消
      </Button>
    </Col>
  </Row>);
  const secondFooter = (<Row>
    <Col md={24} sm={24}>
      <Button onClick={() => {
        handleItem(1);
      }}>
        上一步
      </Button>
      <Button type="primary" onClick={() => {
        handleItem(3);
      }}>
        下一步
      </Button>
      <Button onClick={() => {
        handleModalVisible(false);
      }}>
        取消
      </Button>
    </Col>
  </Row>);
  const thirdFooter = (<Row>
    <Col md={24} sm={24}>
      <Button onClick={() => {
        handleItem(2);
      }}>
        上一步
      </Button>
      <Button type="primary" onClick={handleAdd}>
        提交
      </Button>
      <Button onClick={() => {
        handleModalVisible(false);
      }}>
        取消
      </Button>
    </Col>
  </Row>);
  const onChange = ()=>{

  }
  return (
    <Modal
      title="创建数据源"
      visible={modalVisible}
      footer={item === 1 ? firstFooter : item === 2 ? secondFooter : thirdFooter}
      onOk={okHandle}
      destroyOnClose={true}
      onCancel={() => handleModalVisible()}
    >
      <Row>
      <Steps current={item-1} labelPlacement={'vertical'}>
        <Step key={1} title={'选择数据源类型'} />
        <Step key={2} title={'录入基本信息'} />
        <Step key={3} title={'配置技术参数'} />
      </Steps>
      </Row>
      {item === 1 ? <div><Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={24} sm={24}>
          <FormItem {...formItemLayout} label="数据源类型"><Cascader style={{ width: 100 + '%' }} options={options}
                                                                onChange={onChange}
                                                                placeholder="请选择数据源/数据库"/>
          </FormItem>
        </Col></Row></div> : item === 2 ? <div>
          <FormItem {...formItemLayout} label="数据源名称">
            {form.getFieldDecorator('desc7', {
              rules: [{ required: true, message: 'Please input some description...' }],
            })(<Input placeholder="请输入"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="所属组织机构">
            {form.getFieldDecorator('status')(
              <Select placeholder="选择所属组织机构" style={{ width: '100%' }}>
                <Option value="0">公安局</Option>
                <Option value="1">刑侦科</Option>
                <Option value="2">户籍科</Option>
                <Option value="3">办公室</Option>
              </Select>,
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="资源分类">
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
        </div> :
        <div>
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
          <FormItem {...formItemLayout} label="SID">
            {form.getFieldDecorator('desc7', {
              rules: [{ required: true, message: 'Please input some description...' }],
            })(<Input placeholder="请输入"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="数据库名称/服务名称">
            {form.getFieldDecorator('desc8', {
              rules: [{ required: true, message: 'Please input some description...' }],
            })(<Input placeholder="请输入"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="数据库版本号">
            {form.getFieldDecorator('desc8', {
              rules: [{ required: true, message: 'Please input some description...' }],
            })(<Input placeholder="请输入"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="用户名">
            {form.getFieldDecorator('desc8', {
              rules: [{ required: true, message: 'Please input some description...' }],
            })(<Input placeholder="请输入"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="备注">
            {form.getFieldDecorator('desc9', {
              rules: [{ required: true, message: 'Please input some description...' }],
            })(<Input placeholder="请输入"/>)}
          </FormItem>
          <Row>
            <Col>
              <Button type="primary">测试连通性</Button>
            </Col>
          </Row>
        </div>}

    </Modal>
  );
});
const UpdateForm = Form.create()(props => {
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
      destroyOnClose={true}
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
  const { modalVisible, form, handleAdd, selectedRows, testList, handleModalVisible } = props;
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
        <Progress percent={testList.length / selectedRows.length}/>
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
@connect(({ centersource, classify, loading }) => ({
  centersource,
  classify,
  loading: loading.models.centersource,
}))
@Form.create()
export default class ResourceClassify extends PureComponent {
  state = {
    modalVisible: false,
    testModalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    listItemData: {},
    testList: [],
    item: 1,
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
  handleItem = (index) => {
    this.setState({
      item: index,
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
          type: 'centersource/remove',
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
  testHandleModalVisible = flag => {
    this.setState({
      testModalVisible: !!flag,
    });
  };
  updateHandleModalVisible = flag => {
    this.setState({
      updateModalVisible: !!flag,
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
      type: 'centersource/add',
      payload: {
        description: fields.desc,
      },
    });
    message.success('添加成功');
    this.setState({
      modalVisible: false,
    });
  };
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
  updateHandleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'centersource/add',
      payload: {
        description: fields.desc,
      },
    });
    message.success('添加成功');
    this.setState({
      updateModalVisible: false,
    });
  };

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 2, lg: 6, xl: 12 }}>
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
        <Row gutter={{ md: 2, lg: 6, xl: 12 }}>
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
              {getFieldDecorator('status1')(
                <Select placeholder="连通状态" style={{ width: '100%' }}>
                  <Option value="0">已连通</Option>
                  <Option value="1">未连通</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={3} sm={24}>
            <FormItem>
              {getFieldDecorator('status2')(
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
        <Row gutter={{ md: 2, lg: 6, xl: 12 }}>
          <StandardFormRow title="关系型数据库" block style={{ paddingBottom: 5 }}>
            <FormItem style={{ marginBottom: 0 }}>
              {getFieldDecorator('category')(
                <TagSelect onChange={this.handleFormSubmit}>
                  <TagSelect.Option value="cat1">MySQL</TagSelect.Option>
                  <TagSelect.Option value="cat2">Oracle</TagSelect.Option>
                  <TagSelect.Option value="cat3">SQLServer</TagSelect.Option>
                  <TagSelect.Option value="cat4">DB2</TagSelect.Option>
                </TagSelect>,
              )}
            </FormItem>
          </StandardFormRow>
        </Row>
        <Row gutter={{ md: 2, lg: 6, xl: 12 }}>
          <StandardFormRow title="非关系型数据库" block style={{ paddingBottom: 5 }}>
            <FormItem style={{ marginBottom: 0 }}>
              {getFieldDecorator('category')(
                <TagSelect onChange={this.handleFormSubmit}>
                  <TagSelect.Option value="cat1">MongoDB</TagSelect.Option>
                  <TagSelect.Option value="cat2">Hbase</TagSelect.Option>
                </TagSelect>,
              )}
            </FormItem>
          </StandardFormRow>
        </Row>
        <Row gutter={{ md: 2, lg: 6, xl: 12 }}>
          <StandardFormRow title="API" block style={{ paddingBottom: 5 }}>
            <FormItem style={{ marginBottom: 0 }}>
              {getFieldDecorator('category')(
                <TagSelect onChange={this.handleFormSubmit}>
                  <TagSelect.Option value="cat1">HTTP</TagSelect.Option>
                  <TagSelect.Option value="cat2">HTTPS</TagSelect.Option>
                  <TagSelect.Option value="cat3">WSDL</TagSelect.Option>
                  <TagSelect.Option value="cat4">REST</TagSelect.Option>
                </TagSelect>,
              )}
            </FormItem>
          </StandardFormRow>
        </Row>
        <Row gutter={{ md: 2, lg: 6, xl: 12 }}>
          <StandardFormRow title="普通文件系统" block style={{ paddingBottom: 5 }}>
            <FormItem style={{ marginBottom: 0 }}>
              {getFieldDecorator('category')(
                <TagSelect onChange={this.handleFormSubmit}>
                  <TagSelect.Option value="cat1">FTP</TagSelect.Option>
                  <TagSelect.Option value="cat2">SFTP</TagSelect.Option>
                  <TagSelect.Option value="cat3">本地磁盘</TagSelect.Option>
                  <TagSelect.Option value="cat4">共享文件件</TagSelect.Option>
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

  handleTree = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'centersource/fetch',
      payload: data,
    });
  };

  render() {
    const {
      centersource: { data },
      classify: { treeData },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, testModalVisible, updateModalVisible, listItemData, item } = this.state;

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
                this.updateHandleModalVisible(true);
                this.setState({
                  listItemData: text,
                });
              }}>配置详情</a>
              <Divider type="vertical"/>
              <a onClick={() => {
                this.updateHandleModalVisible(true);
                this.setState({
                  listItemData: text,
                });
              }}>修改配置</a>
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
      handleAdd: this.testHandleAdd,
      handleModalVisible: this.testHandleModalVisible,
      selectedRows: this.state.selectedRows,
      testList: this.state.testList,
    };
    const updateParentMethods = {
      handleAdd: this.updateHandleAdd,
      handleModalVisible: this.updateHandleModalVisible,
    };
    return (
      <PageHeaderLayout>
        <div className={styles.flexMain}>
          <SimpleTree
            data={treeData}
            handleTree={this.handleTree}
            title={'中心数据源'}
          />
          <Card bordered={false} className={styles.flexTable}>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                  新建数据源
                </Button>
                <Button icon="desktop" type="primary" onClick={() => this.testHandleAdd(true)}>
                  测试连通性
                </Button>
                <Button icon="delete" onClick={() => this.handleDelete(true)}>
                  批量删除
                </Button>
              </div>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
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
        <UpdateForm {...updateParentMethods} modalVisible={updateModalVisible}/>
        <CreateForm {...parentMethods} modalVisible={modalVisible} handleItem={this.handleItem} item={item}/>
      </PageHeaderLayout>
    );
  }
}
