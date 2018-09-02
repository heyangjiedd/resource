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
  Tabs,
  Radio,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
} from 'antd';
import { Link } from 'dva/router';
import StandardTable from 'components/StandardTable';
import SimpleTree from 'components/SimpleTree';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './derivationDetail.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const TabPane = Tabs.TabPane;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
let itemDataStatus = 0;
let listItemData = {};
let treeSelect = '';

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      if (itemDataStatus === 2)
        handleModalVisible();
      else
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
  let title = itemDataStatus === 1 ? '编辑分类' : itemDataStatus === 2 ? '查看分类' : '新增分类';
  return (
    <Modal
      title={title}
      visible={modalVisible}
      onOk={okHandle}
      footer={itemDataStatus === 2}
      destroyOnClose={true}
      onCancel={() => handleModalVisible()}
    >

      <FormItem {...formItemLayout} label="父级分类名称">
        {form.getFieldDecorator('parentName', {
          rules: [{ message: 'Please input some description...' }],
          initialValue: listItemData.parentName,
        })(<Input disabled placeholder="请输入"/>)}
      </FormItem>
      <FormItem {...formItemLayout} label="分类名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: 'Please input some description...' }], initialValue: listItemData.name,
        })(<Input disabled={itemDataStatus === 2} placeholder="请输入"/>)}
      </FormItem>
      <FormItem {...formItemLayout} label="排序号">
        {form.getFieldDecorator('sort', {
          rules: [{ required: true, message: 'Please input some description...' }], initialValue: listItemData.sort,
        })(<Input disabled={itemDataStatus === 2} placeholder="请输入"/>)}
      </FormItem>
      <FormItem {...formItemLayout} label="分类描述">
        {form.getFieldDecorator('description', {
          rules: [
            {
              required: true,
              message: '请输入分类描述',
            },
          ], initialValue: listItemData.description,
        })(
          <TextArea
            style={{ minHeight: 32 }}
            disabled={itemDataStatus === 2}
            placeholder="请输入你的分类描述"
            rows={4}
          />,
        )}
      </FormItem>
    </Modal>
  );
});

@connect(({ classify, loading }) => ({
  classify,
  loading: loading.models.classify,
}))
@Form.create()
export default class DerivationDetail extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'classify/fetch',
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
      type: 'classify/fetch',
      payload: params,
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
  handleModeChange = item =>{

  }
  render() {
    const {
      classify: { data, treeData },
      loading,
    } = this.props;
    const { selectedRows, modalVisible } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const columns = [
      {
        title: '序号',
        render: (text, record, index) => <span>{index + 1}</span>,
      },
      {
        title: '分类名称',
        dataIndex: 'name',
      },
      {
        title: '下级分类',
        dataIndex: 'childNum',
      },
      {
        title: '分类结构',
        render: (text, record, index) => {
          return (
            <span>{(text.parentName ? text.parentName : '' + '>') + text.name ? text.name : ''}</span>
          );
        },
      },
      {
        title: '分类描述',
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
              }}>查看</a>
            </Fragment>
          );
        },
      },
    ];

    return (
      <PageHeaderLayout>
        <div className={styles.flexMain}>
          <Card bordered={false} className={styles.flexTable} style={{width:'100%'}}>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Button >
                  <Link to="/main"  key="main">
                    返回
                  </Link>
                </Button>
              </div>
              <div style={{width:'100%'}}>
                <Tabs
                  defaultActiveKey="1"
                  tabPosition='top'
                >
                  <TabPane tab="基础库" key="1">暂无</TabPane>
                  <TabPane tab="主题库" key="2">暂无</TabPane>
                  <TabPane tab="部门库" key="3">暂无</TabPane>
                  <TabPane tab="共享库" key="4">暂无</TabPane>
                  <TabPane tab="开放库" key="5">暂无</TabPane>
                  <TabPane tab="衍生库1" key="6">暂无</TabPane>
                  <TabPane tab="衍生库2" key="7">暂无</TabPane>
                  <TabPane tab="衍生库3" key="8">暂无</TabPane>
                  <TabPane tab="衍生库4" key="9">暂无</TabPane>
                  <TabPane tab="衍生库5" key="10">暂无</TabPane>
                  <TabPane tab="衍生库3" key="11">暂无</TabPane>
                  <TabPane tab="衍生库4" key="12">暂无</TabPane>
                  <TabPane tab="衍生库5" key="13">暂无</TabPane>
                </Tabs>
              </div>
            </div>
          </Card>
        </div>
        <CreateForm {...parentMethods} modalVisible={modalVisible}/>
      </PageHeaderLayout>
    );
  }
}
