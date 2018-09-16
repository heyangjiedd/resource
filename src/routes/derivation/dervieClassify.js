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

import styles from './dervieClassify.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
let itemDataStatus = 1;
let listItemData = {};
let treeSelect = '';

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
  let title = itemDataStatus===1?"编辑分类":itemDataStatus===2?"查看分类":"新增分类";
  const footer = (<Row>
    <Col md={24} sm={24}>
      <Button onClick={() => {
        handleModalVisible();
      }}>
        取消
      </Button>
      <Button type="primary" onClick={okHandle}>
        确定
      </Button>
    </Col>
  </Row>);
  return (
    <Modal
      title={title}
      visible={modalVisible}
      footer={itemDataStatus === 2?null:footer}
      onOk={okHandle}
      destroyOnClose={true}
      onCancel={() => handleModalVisible()}
    >

      {itemDataStatus==3||itemDataStatus==4?'':<FormItem {...formItemLayout} label="父级分类名称">
        {form.getFieldDecorator('parentName', {
          rules: [{  message: 'Please input some description...' }],
          initialValue: listItemData.parentName,
        })(<Input disabled placeholder="请输入"/>)}
      </FormItem>}
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

@connect(({ dervieClassify, loading }) => ({
  dervieClassify,
  loading: loading.models.dervieClassify,
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
    this.fetchAll();
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
      type: 'dervieClassify/fetch',
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
      type: 'datasource/fetch',
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
          type: 'dervieClassify/remove',
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
      //   type: 'dervieClassify/fetch',
      //   payload: values,
      // });
    });
  };
  fetchAll =()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'dervieClassify/fetch',
    });
    dispatch({
      type: 'dervieClassify/tree',
    });
  }
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };
  handleModal = (item,status) => {
    listItemData = item;
    itemDataStatus = status;
    this.handleModalVisible(true);
  };
  handleAdd = fields => {
    const { dispatch , dervieClassify: { treeData }} = this.props;
    debugger
    if (itemDataStatus === 1) {
      dispatch({
        type: 'dervieClassify/update',
        payload: { ...listItemData, ...fields },
        callback: () => {
          this.fetchAll();
        },
      });
      message.success('修改成功');
    } else {
      let select = treeData.filter(r => {
        return treeSelect == r.id;
      });
      if (itemDataStatus == 3) {
        treeSelect = select[0]&&select[0].parentId;
      } else {
        treeSelect = select[0].id;
      }
      dispatch({
        type: 'dervieClassify/add',
        payload: {...fields,parentId:treeSelect},
        callback: () => {
          this.fetchAll();
        },
      });
      message.success('添加成功');
    }
    this.setState({
      modalVisible: false,
    });
  };

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }
  handleDelete = () => {
    const { dispatch } = this.props;
    if (this.state.selectedRows.length > 0) {
      this.state.selectedRows.forEach((item, index) => {
        if (index === this.state.selectedRows.length - 1) {
          dispatch({
            type: 'dervieClassify/remove',
            payload: {
              id: item.id,
            }, callback: () => {
              this.fetchAll();
            },
          });
          message.success('删除成功');

        } else {
          dispatch({
            type: 'dervieClassify/remove',
            payload: {
              id: item.id,
            },
          });
        }
      });
    }
  };
  handleTree = data => {
    treeSelect = data[0]
  };

  render() {
    const {
      dervieClassify: { data, treeData },
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
        render: (text, record, index) => <span>{index+1}</span>
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
                this.handleModal(text,2);

                listItemData = text;
              }}>查看</a>
              <Divider type="vertical"/>
              <a onClick={() => {
                this.handleModal(text,1);

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
            title={'衍生资源库'}
          />
          <Card bordered={false} className={styles.flexTable}>
            <div className={styles.tableList}>
              {/*<div className={styles.tableListForm}>{this.renderForm()}</div>*/}
              <div className={styles.tableListOperator}>
                <Button icon="plus" type="primary" onClick={() => {this.handleModal({},3);}}>
                  添加同级
                </Button>
                <Button icon="plus" type="primary" onClick={() => {
                  if (!treeSelect) {
                    message.error('请先选择资源分类');
                    return;
                  }
                  this.handleModal({},4);}}>
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
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderLayout>
    );
  }
}
