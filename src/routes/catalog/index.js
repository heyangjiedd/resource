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
import StandardTableNoCheck from 'components/StandardTableNoCheck';
import StandardTableNothing from 'components/StandardTableNothing';
import SimpleTree from 'components/SimpleTree';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
let itemDataStatus = 0;
let listItemData = {};

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
      sm: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 17 },
      md: { span: 17 },
    },
  };
  const normalizeAll = (value, prevValue = []) => {
    if (value.indexOf('All') >= 0 && prevValue.indexOf('All') < 0) {
      return ['All', 'Apple', 'Pear', 'Orange'];
    }
    if (value.indexOf('All') < 0 && prevValue.indexOf('All') >= 0) {
      return [];
    }
    return value;
  };
  return (
    <Modal
      title="编辑分类"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem {...formItemLayout} label="父级分类名称">
        {form.getFieldDecorator('fjflmc', {
          rules: [{ required: true, message: 'Please input some description...' }],
          initialValue: listItemData.parentName,
        })(<Input placeholder="请输入"/>)}
      </FormItem>
      <FormItem {...formItemLayout} label="分类名称">
        {form.getFieldDecorator('flmc', {
          rules: [{ required: true, message: 'Please input some description...' }], initialValue: listItemData.name,
        })(<Input placeholder="请输入"/>)}
      </FormItem>
      <FormItem {...formItemLayout} label="排序号">
        {form.getFieldDecorator('pxh', {
          rules: [{ required: true, message: 'Please input some description...' }], initialValue: listItemData.sort,
        })(<Input placeholder="请输入"/>)}
      </FormItem>
      <FormItem {...formItemLayout} label="分类描述">
        {form.getFieldDecorator('flms', {
          rules: [
            {
              required: true,
              message: '请输入分类描述',
            },
          ], initialValue: listItemData.description,
        })(
          <TextArea
            style={{ minHeight: 32 }}
            placeholder="请输入你的分类描述"
            rows={4}
          />,
        )}
      </FormItem>
    </Modal>
  );
});
const CatlogDetail = Form.create()(props => {
  const { modalVisible, form, handleModalVisible, loading, data, columns } = props;
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
      title="目录详情"
      visible={modalVisible}
      footer={null}
      onOk={okHandle}
      destroyOnClose={true}
      width={900}
      onCancel={() => handleModalVisible()}
    >
      <Row gutter={24}>
        <Col span={24}>
          <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="目录分类">
            {form.getFieldDecorator('mlfl', {
              rules: [{ required: true, message: 'Please input some description...' }],
            })(<Input disabled={true} placeholder="请输入"/>)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <FormItem {...formItemLayout} label="信息资源名称">
            {form.getFieldDecorator('xxzymc', {
              rules: [{ required: true, message: 'Please input some description...' }],
            })(<Input disabled={true} placeholder="请输入"/>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formItemLayout} label="信息资源名称">
            {form.getFieldDecorator('xxzybm', {
              rules: [{ required: true, message: 'Please input some description...' }],
            })(<Input disabled={true} placeholder="请输入"/>)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <FormItem {...formItemLayout} label="资源提供方">
            {form.getFieldDecorator('zttgf', {
              rules: [{ required: true, message: 'Please input some description...' }],
            })(<Input disabled={true} placeholder="请输入"/>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formItemLayout} label="资源提供方">
            {form.getFieldDecorator('zttgfbm', {
              rules: [{ required: true, message: 'Please input some description...' }],
            })(<Input disabled={true} placeholder="请输入"/>)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="关联资源分类">
            {form.getFieldDecorator('glzyfl', {
              rules: [{ required: true, message: 'Please input some description...' }],
            })(<Input disabled={true} placeholder="请输入"/>)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <FormItem {...formItemLayout} label="所属资源格式">
            {form.getFieldDecorator('sszygs', {
              rules: [{ required: true, message: 'Please input some description...' }],
            })(<Input disabled={true} placeholder="请输入"/>)}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem labelCol={{ span: 16 }} wrapperCol={{ span: 8 }} label="涉密标识">
            {form.getFieldDecorator('smbs', {
              rules: [{ required: true, message: 'Please input some description...' }],
            })(<Input disabled={true} placeholder="请输入"/>)}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="周期">
            {form.getFieldDecorator('zq', {
              rules: [{ required: true, message: 'Please input some description...' }],
            })(<Input disabled={true} placeholder="请输入"/>)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={6}>
          <FormItem labelCol={{ span: 16 }} wrapperCol={{ span: 8 }} label="共享类型">
            {form.getFieldDecorator('gxlx', {
              rules: [{ required: true, message: 'Please input some description...' }],
            })(<Input disabled={true} placeholder="请输入"/>)}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} label="共享方式">
            {form.getFieldDecorator('gxff', {
              rules: [{ required: true, message: 'Please input some description...' }],
            })(<Input disabled={true} placeholder="请输入"/>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formItemLayout} label="是否开放">
            {form.getFieldDecorator('sfkf', {
              rules: [{ required: true, message: 'Please input some description...' }],
            })(<Input disabled={true} placeholder="请输入"/>)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <FormItem {...formItemLayout} label="共享条件">
            {form.getFieldDecorator('gxtj', {
              rules: [{ required: true, message: 'Please input some description...' }],
            })(<TextArea disabled={true} placeholder="请输入" rows={4}/>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formItemLayout} label="开放条件">
            {form.getFieldDecorator('kftj', {
              rules: [{ required: true, message: 'Please input some description...' }],
            })(<TextArea disabled={true} placeholder="请输入" rows={4}/>)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          信息资源大普查：
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <FormItem {...formItemLayout} label="数据存储总量(G)">
            {form.getFieldDecorator('sjcczl', {
              rules: [{ required: true, message: 'Please input some description...' }],
            })(<Input disabled={true} placeholder="请输入"/>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formItemLayout} label="结构化信息(万)">
            {form.getFieldDecorator('jghxx', {
              rules: [{ required: true, message: 'Please input some description...' }],
            })(<Input disabled={true} placeholder="请输入"/>)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <FormItem {...formItemLayout} label="已共享数据量(G)">
            {form.getFieldDecorator('ygxsjl', {
              rules: [{ required: true, message: 'Please input some description...' }],
            })(<Input disabled={true} placeholder="请输入"/>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formItemLayout} label="已共享结构化(万)">
            {form.getFieldDecorator('ygxjgh', {
              rules: [{ required: true, message: 'Please input some description...' }],
            })(<Input disabled={true} placeholder="请输入"/>)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <FormItem {...formItemLayout} label="已放开数据量(G)">
            {form.getFieldDecorator('ykfsjl', {
              rules: [{ required: true, message: 'Please input some description...' }],
            })(<Input disabled={true} placeholder="请输入"/>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formItemLayout} label="已开放结构化(万)">
            {form.getFieldDecorator('ykfjgh', {
              rules: [{ required: true, message: 'Please input some description...' }],
            })(<Input disabled={true} placeholder="请输入"/>)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          信息项列表：
        </Col>
      </Row>
      <StandardTableNothing
        loading={loading}
        data={data}
        columns={columns}
      />
    </Modal>
  );
});
@connect(({ catalog, loading }) => ({
  catalog,
  loading: loading.models.catalog,
}))
@Form.create()
export default class ResourceClassify extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'catalog/fetch',
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
      type: 'catalog/fetch',
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
      type: 'catalog/fetch',
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
          type: 'catalog/remove',
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

      // dispatch({
      //   type: 'catalog/fetch',
      //   payload: values,
      // });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };
  handleModal = (item, status) => {
    listItemData = item;
    itemDataStatus = status;
    this.handleModalVisible(true);
  };
  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'catalog/add',
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
          <Col md={8} sm={24}>
            <FormItem label="规则编号">
              {getFieldDecorator('no')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
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
          <Col md={8} sm={24}>
            <FormItem label="规则编号">
              {getFieldDecorator('no')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="调用次数">
              {getFieldDecorator('number')(<InputNumber style={{ width: '100%' }}/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="更新日期">
              {getFieldDecorator('date')(
                <DatePicker style={{ width: '100%' }} placeholder="请输入更新日期"/>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status3')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status4')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
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
        </div>
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
      type: 'catalog/fetch',
      payload: data,
    });
  };

  render() {
    const {
      catalog: { data, treeData },
      loading,
      form
    } = this.props;
    const { selectedRows, modalVisible } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const columns = [
      {
        title: '序号',
        dataIndex: 'sort',
      },
      {
        title: '信息资源名称',
        dataIndex: 'name',
      },
      {
        title: '目录分类',
        dataIndex: 'childNum',
      },
      {
        title: '信息资源管理资源类型',
        dataIndex: 'description',
      },
      {
        title: '操作',
        render: (text, record, index) => {
          return (
            <Fragment>
              <a onClick={() => {
                this.handleModal(text, 2);
                listItemData = text;
              }}>目录详情</a>
              <Divider type="vertical"/>
              <a onClick={() => {
                this.handleModal(text, 1);
                listItemData = text;
              }}>配置详情</a>
              <Divider type="vertical"/>
              <a onClick={() => {
                this.handleModal(text, 1);
                listItemData = text;
              }}>目数关联</a>
            </Fragment>
          );
        },
      },
    ];

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );
    const { getFieldDecorator } = form;
    return (
      <PageHeaderLayout>
        {/*<Col xl={6} lg={6} md={6} sm={6} xs={6} style={{ marginBottom: 24 }}>*/}
        <div className={styles.flexMain}>
          {/*<SimpleTree*/}
          {/*data={data}*/}
          {/*handleTree={this.handleTree}*/}
          {/*title={'资源分类'}*/}
          {/*/>*/}
          <Card bordered={false} className={styles.flexTable}>
            <div className={styles.tableList}>
              {/*<div className={styles.tableListForm}>{this.renderForm()}</div>*/}
                <Row>
                <Col md={8} sm={24}>
                  <FormItem>
                    {getFieldDecorator('no')(<Input placeholder="请输入数据源名称"/>)}
                  </FormItem>
                </Col>
                <Col md={6} sm={24}>
                  <FormItem>
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                  </FormItem>
                </Col>
                </Row>
              <StandardTableNoCheck
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
        {/*</Col>*/}
        {/*<Col xl={18} lg={16} md={16} sm={16} xs={16} style={{ marginBottom: 24 }}>*/}

        {/*</Col>*/}
        <CreateForm {...parentMethods} modalVisible={modalVisible}/>
      </PageHeaderLayout>
    );
  }
}
