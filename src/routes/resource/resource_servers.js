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
          rules: [{ required: true, message: '请输入...' }],
        })(<Input placeholder="请输入"/>)}
      </FormItem>
      <FormItem {...formItemLayout} label="数据库类型">
        {form.getFieldDecorator('desc1', {
          rules: [{ required: true, message: '请输入...' }],
        })(<Input placeholder="请输入"/>)}
      </FormItem>
      <FormItem {...formItemLayout} label="数据源名称">
        {form.getFieldDecorator('desc2', {
          rules: [{ required: true, message: '请输入...' }],
        })(<Input placeholder="请输入"/>)}
      </FormItem>
      <FormItem {...formItemLayout} label="所属组织机构">
        {form.getFieldDecorator('desc3', {
          rules: [{ required: true, message: '请输入...' }],
        })(<Input placeholder="请输入"/>)}
      </FormItem>
      <FormItem {...formItemLayout} label="资源分类">
        {form.getFieldDecorator('desc4', {
          rules: [{ required: true, message: '请输入...' }],
        })(
          <Select placeholder="请选择" style={{ width: '100%' }}>
            <Option value="0">关闭</Option>
            <Option value="1">运行中</Option>
          </Select>)}
      </FormItem>
      <FormItem {...formItemLayout} label="IP地址">
        {form.getFieldDecorator('desc5', {
          rules: [{ required: true, message: '请输入...' }],
        })(<Input placeholder="请输入"/>)}
      </FormItem>
      <FormItem {...formItemLayout} label="端口">
        {form.getFieldDecorator('desc6', {
          rules: [{ required: true, message: '请输入...' }],
        })(<Input placeholder="请输入"/>)}
      </FormItem>
      <FormItem {...formItemLayout} label="数据库名称/SID">
        {form.getFieldDecorator('desc7', {
          rules: [{ required: true, message: '请输入...' }],
        })(<Input placeholder="请输入"/>)}
      </FormItem>
      <FormItem {...formItemLayout} label="用户名">
        {form.getFieldDecorator('desc8', {
          rules: [{ required: true, message: '请输入...' }],
        })(<Input placeholder="请输入"/>)}
      </FormItem>
      <FormItem {...formItemLayout} label="密码">
        {form.getFieldDecorator('desc9', {
          rules: [{ required: true, message: '请输入...' }],
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
  const apilogcolumns = [
    {
      title: '序号',
      width:'150px',
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: '服务调用用户',
      width:'150px',
      dataIndex: 'userName',
    }, {
      title: '最近一次接口调用开始时间',
      width:'200px',
      dataIndex: 'startTime',
    }, {
      title: '最近一次接口调用结束时间',
      width:'200px',
      dataIndex: 'endTime',
    }, {
      title: '累积调用次数',
      width:'150px',
      dataIndex: 'num',
    }, {
      title: '调用方式',
      width:'150px',
      dataIndex: 'type',
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
          <Description term="服务名称">{httpItem.interfaceName}</Description>
          <Description term="所属数据源">{httpItem.sourceName}</Description>
          <Description term="调用记录">{apilogcolumns.total||0}</Description>
          <Description term="接口类型">{httpItem.interfaceType}</Description>
          <Description term="数据格式">{httpItem.content}</Description>
          <Description term="服务类型">代理接口</Description>
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
    if(!localStorage.getItem('token_str')){
      return
    }
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'centersource/fetch',
    // });
    this.fetchHandle();
    dispatch({
      type: 'classify/tree',
    });
  }
  fetchHandle(params) {
    const { dispatch } = this.props;
    params = {...params,file:'http,https,wsdl,rest',}
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

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    this.fetchHandle();
    // dispatch({
    //   type: 'centersource/fetch',
    //   payload: {},
    // });
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


  handleTree = data => {
    const { dispatch } = this.props;
    createItemData.resourceId = data[0];
    this.fetchHandle({ resourceId: createItemData.resourceId });

    // dispatch({
    //   type: 'centersource/fetch',
    //   payload: { resourceId: createItemData.resourceId },
    // });
  };

  render() {
    const {
      centersource: { sqlList, data: formData, dataList, lifelist: { list: lifelist }, httpItem },
      loading,
      catalog: { catalogItem, field, tableAndField, logdata },
      classify: { treeData },
      form,
    } = this.props;
    const { selectedRows, modalVisible, listItemData, modalVisibleResource } = this.state;

    const columns = [
      {
        title: '序号',
        width:'150px',
        render: (text, record, index) => <span>{index + 1}</span>,
      },
      {
        title: '服务名称',
        width:'150px',
        dataIndex: 'interfaceName',
      },
      {
        title: '所属数据源',
        width:'150px',
        dataIndex: 'sourceName',
      },
      {
        title: '数据源类型',
        width:'150px',
        dataIndex: 'sourceType',
        render: (text, record, index) => {
          return (
            <span>API/{text}</span>
          );
        },
      },
      //
      // {
      //   title: '接口类型',
      //   width:'150px',
      //   dataIndex: 'interfaceType',
      // },
      {
        title: '服务类型',
        width:'150px',
        dataIndex: 'serviceType',
        render: (text, record, index) => {
          return (
            <span>代理接口</span>
          );
        },
      },
      {
        title: '服务描述',
        width:'150px',
        dataIndex: 'content',
      },
      {
        title: '操作',
        width:'150px',
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
      operateLog: logdata,
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
            title={'资源分类'}
          />
          <Card bordered={false} className={styles.flexTable}>
            <div className={styles.tableList}>
              <Form onSubmit={this.handleSearch}>
              <Row gutter={{ md: 2, lg: 6, xl: 12 }}>
                <Col offset={14} md={8} sm={24}>
                  <FormItem>
                    {getFieldDecorator('interfaceName')(<Input placeholder="请输入服务名称"/>)}
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
