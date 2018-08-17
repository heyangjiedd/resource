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
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './resourceClassify.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
let itemDataStatus = 0;
let listItemData = {};
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
      sm: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 17 },
      md: { span: 17 },
    },
  };
  let title = itemDataStatus===1?"编辑分类":itemDataStatus===2?"查看分类":"新增分类";
  return (
    <Modal
      title={title}
      visible={modalVisible}
      onOk={okHandle}
      destroyOnClose={true}
      onCancel={() => handleModalVisible()}
    >

      <FormItem {...formItemLayout} label="父级分类名称">
        {form.getFieldDecorator('parentName', {
          rules: [{  message: 'Please input some description...' }],
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
      type: 'classify/tree',
    });
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
      currentPage: pagination.current,
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

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
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
    if (itemDataStatus === 1) {
      dispatch({
        type: 'classify/update',
        payload: { ...listItemData, ...fields },
        callback: () => {
          dispatch({
            type: 'classify/fetch',
          });
        },
      });
      message.success('修改成功');
    } else {
      dispatch({
        type: 'classify/add',
        payload: {...fields,parentId:treeSelect},
        callback: () => {
          dispatch({
            type: 'classify/fetch',
          });
        },
      });
      message.success('添加成功');
    }
    this.setState({
      modalVisible: false,
    });
  };
  handleDelete = () => {
    const { dispatch } = this.props;
    if (this.state.selectedRows.length > 0) {
      this.state.selectedRows.forEach((item, index) => {
        if (index === this.state.selectedRows.length - 1) {
          dispatch({
            type: 'classify/remove',
            payload: {
              id: item.id,
            }, callback: () => {
              dispatch({
                type: 'classify/fetch',
              });
            },
          });
          message.success('删除成功');
          this.setState({
            selectedRows: [],
          });
        } else {
          dispatch({
            type: 'classify/remove',
            payload: {
              id: item.id,
            },
          });
        }
      });
    }
  };
  handleTree = (data,e) => {
    treeSelect = data[0];
  };

  render() {
    const {
      classify: { data ,treeData},
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
        dataIndex: 'sort',
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
              <Divider type="vertical"/>
              <a onClick={() => {
                this.handleModal(text, 1);

                listItemData = text;
              }}>编辑</a>
            </Fragment>
          );
        },
      },
    ];

    return (
      <PageHeaderLayout>
        {/*<Col xl={6} lg={6} md={6} sm={6} xs={6} style={{ marginBottom: 24 }}>*/}
        <div className={styles.flexMain}>
          <SimpleTree
            data={treeData}
            handleTree={this.handleTree}
            title={'资源分类'}
          />
          <Card bordered={false} className={styles.flexTable}>
            <div className={styles.tableList}>
              {/*<div className={styles.tableListForm}>{this.renderForm()}</div>*/}
              <div className={styles.tableListOperator}>
                <Button icon="plus" type="primary" onClick={() => {
                  this.handleModal({}, 0);
                }}>
                  添加同级
                </Button>
                <Button icon="plus" type="primary" onClick={() => {
                  this.handleModal({}, 0);
                }}>
                  添加下级
                </Button>
                <Button icon="delete" onClick={() => this.handleDelete()}>
                  批量删除
                </Button>
              </div>
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
        {/*</Col>*/}
        {/*<Col xl={18} lg={16} md={16} sm={16} xs={16} style={{ marginBottom: 24 }}>*/}

        {/*</Col>*/}
        <CreateForm {...parentMethods} modalVisible={modalVisible}/>
      </PageHeaderLayout>
    );
  }
}
