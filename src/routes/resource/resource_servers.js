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

import styles from './resource_servers.less';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const { TextArea } = Input;
const { Option } = Select;
const { Description } = DescriptionList;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];
let itemDataStatus = 0;
let listItemData = {};
let treeSelect = {};
let createItemData = {};

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
const ResourceDetail = Form.create()(props => {
  const {
    modalVisible, form, handleModalVisible, loading, data, columns, detailType, tableAndField,
    radioSwitch, radioSwitcHandle, operateLog, lifelist, httpItem,
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
  const apifieldcolumns = [
    {
      title: '字段名称',
      dataIndex: 'content',
    }, {
      title: '字段别名',
      dataIndex: 'content',
    }, {
      title: '字段中文名',
      dataIndex: 'content',
    }, {
      title: '字段描述',
      dataIndex: 'content',
    }, {
      title: '来源数据表',
      dataIndex: 'content',
    }, {
      title: '来源数据库',
      dataIndex: 'content',
    }];
  const apilogcolumns = [
    {
      title: '序号',
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: '服务调用用户',
      dataIndex: 'content',
    }, {
      title: '最近一次接口调用开始时间',
      dataIndex: 'content',
    }, {
      title: '最近一次接口调用结束时间',
      dataIndex: 'content',
    }, {
      title: '累积调用次数',
      dataIndex: 'content',
    }, {
      title: '调用方式',
      dataIndex: 'content',
    },
  ];
  return (
    <Modal
      title="查看详情"
      visible={modalVisible}
      footer={null}
      destroyOnClose={true}
      width={900}
      onCancel={() => handleModalVisible()}
    >
      <div>
        <DescriptionList size="large" col={2} title="基本信息详情" style={{ marginBottom: 32 }}>
          <Description term="服务名称">{httpItem.sourceName}</Description>
          <Description term="所属数据源">{httpItem.sourceName}</Description>
          <Description term="接口类型">{httpItem.interfaceType}</Description>
          <Description term="数据格式">{httpItem.content}</Description>
          <Description term="服务类型">{httpItem.interfaceName}</Description>
          <Description term="服务地址">{httpItem.interfaceUrl}</Description>
        </DescriptionList>
        <DescriptionList size="large" title="接口调用记录" style={{ marginBottom: 32 }}>
          <StandardTableNoCheck
            loading={loading}
            data={operateLog}
            selectedRows={[]}
            onSelectRow={[]}
            columns={apilogcolumns}/>
        </DescriptionList>
      </div>
    </Modal>
  );
});

@connect(({ resource_servers, catalog, classify, centersource, loading }) => ({
  resource_servers,
  catalog,
  classify,
  centersource,
  loading: loading.models.resource_servers,
}))
@Form.create()
export default class ResourceClassify extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    listItemData: {},
    modalVisibleResource: false,
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
      pageNum: pagination.current,
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
  handleGetResource = flag => {
    const { dispatch } = this.props;
    listItemData = flag;
    dispatch({
      type: 'centersource/get',
      payload: { id: listItemData.id },
    });
    dispatch({
      type: 'catalog/operateLog',
      payload: { id: listItemData.id, type: 'api' },
    });
    this.handleModalVisibleResource(flag);
  };
  handleModalVisibleResource = flag => {
    this.setState({
      modalVisibleResource: !!flag,
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
                  <TagSelect.Option value="mongodb">mongodb</TagSelect.Option>
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

  handleTree = data => {
    const { dispatch } = this.props;
    createItemData.resourceId = data[0];
    dispatch({
      type: 'centersource/fetch',
      payload: { resourceId: createItemData.resourceId },
    });
  };

  render() {
    const {
      centersource: { sqlList, data: formData, dataList, lifelist: { list: lifelist }, httpItem },
      loading,
      catalog: { catalogItem, field, tableAndField, operateLog },
      classify: { treeData },
      form,
    } = this.props;
    const { selectedRows, modalVisible, listItemData, modalVisibleResource } = this.state;

    const columns = [
      {
        title: '序号',
        render: (text, record, index) => <span>{index + 1}</span>,
      },
      {
        title: '服务名称',
        dataIndex: 'sourceName',
      },
      {
        title: '数据源类型',
        dataIndex: 'sourceType',
      },
      {
        title: '服务类型',
        dataIndex: 'createTime',
        sorter: true,
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '-'}</span>,
      },
      {
        title: '服务描述',
        dataIndex: 'linkStatus',
        render(val) {
          return <Badge status={val ? 'success' : 'error'} text={val || '未连通'}/>;
        },
      },
      {
        title: '操作',
        render: (text, record, index) => {
          return (
            <Fragment>
              <a onClick={() => {
                this.handleGetResource(text);
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
    const parentMethodsResource = {
      operateLog: operateLog,
      lifelist: lifelist,
      httpItem: httpItem,
      handleModalVisible: this.handleModalVisibleResource,
      handleGetResource: this.handleGetResource,
    };
    const { getFieldDecorator } = form;
    return (
      <PageHeaderLayout>
        <div className={styles.flexMain}>
          <SimpleTree
            data={treeData}
            handleTree={this.handleTree}
            title={'资源库'}
          />
          <Card bordered={false} className={styles.flexTable}>
            <div className={styles.tableList}>
              <Row gutter={{ md: 2, lg: 6, xl: 12 }}>
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
                data={formData}
                columns={columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card>
        </div>
        <CreateForm {...parentMethods} modalVisible={modalVisible}/>
        <ResourceDetail {...parentMethodsResource} modalVisible={modalVisibleResource}/>
      </PageHeaderLayout>
    );
  }
}
