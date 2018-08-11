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
} from 'antd';
import StandardTable from 'components/StandardTable';
import SimpleTree from 'components/SimpleTree';
import TagSelect from 'components/TagSelect';
import StandardFormRow from 'components/StandardFormRow';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './resource_file.less';

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

@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
export default class ResourceClassify extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    listItemData: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
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
      type: 'rule/fetch',
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
      type: 'rule/fetch',
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
          type: 'rule/remove',
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
        type: 'rule/fetch',
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
      type: 'rule/add',
      payload: {
        description: fields.desc,
      },
    });

    message.success('添加成功');
    this.setState({
      modalVisible: false,
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
  handleTree = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
      payload: data,
    });
  }
  render() {
    const {
      rule: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible,listItemData } = this.state;

    const columns = [
      {
        title: '数据源名称',
        dataIndex: 'no',
      },
      {
        title: '数据源类型',
        dataIndex: 'description',
      },
      {
        title: '所属组织机构',
        dataIndex: 'callNo',
        sorter: true,
        align: 'right',
        render: val => `${val} 万`,
        // mark to display a total number
        needTotal: true,
      },
      {
        title: '所属资源分类',
        dataIndex: 'status',
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '数据源描述',
        dataIndex: 'updatedAt1',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '最近连接时间',
        dataIndex: 'updatedAt2',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '连通状态',
        dataIndex: 'updatedAt3',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        render: (text, record, index) => {
          return (
            <Fragment>
              <a onClick={() => {
                this.handleModalVisible(true);
                this.setState({
                  listItemData: text
                });
              }}>配置详情</a>
              <Divider type="vertical"/>
              <a onClick={() => {
                this.handleModalVisible(true);
                this.setState({
                  listItemData: text
                });
              }}>修改配置</a>
            </Fragment>
          )
        }
      },
    ];

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderLayout>
        <div className={styles.flexMain}>
        <SimpleTree
          handleTree={this.handleTree}
          title={'中心数据源'}
        />
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建数据源
              </Button>
              <Button icon="desktop" type="primary" onClick={() => this.handleModalVisible(true)}>
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
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderLayout>
    );
  }
}
