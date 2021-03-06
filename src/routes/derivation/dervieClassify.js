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

const confirm = Modal.confirm;
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
let treeSelectValue = '';
let searchValue = {};

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
  let title = itemDataStatus===1?"编辑分类":itemDataStatus===2?"查看分类":"添加同级分类";
  if( title === '添加同级分类' && listItemData.parentName) {
    title = "添加下级分类";
  }

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

      {listItemData.parentName?<FormItem {...formItemLayout} label="父级分类名称">
        {form.getFieldDecorator('parentName', {
          rules: [{  message: '请输入父级分类名称' }],
          initialValue: listItemData.parentName,
        })(<Input disabled/>)}
      </FormItem>:''}
      <FormItem {...formItemLayout} label="分类名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入分类名称' },{ max: 20, message: '最大长度不超过20' }], initialValue: listItemData.name,
        })(<Input disabled={itemDataStatus === 2} placeholder={itemDataStatus === 2?'':"请输入分类名称"}/>)}
      </FormItem>
      <FormItem {...formItemLayout} label="排序号">
        {form.getFieldDecorator('sort', {
          rules: [{ required: true, message: '请输入排序号' },
            {pattern:/^[1-9]+\d*$/,message:'输入正整数'},
            { max: 9, message: '最大长度不超过9' }], initialValue: listItemData.sort&&(listItemData.sort+''),
        })(<Input type='number' disabled={itemDataStatus === 2} placeholder={itemDataStatus === 2?'':"请输入排序号"}/>)}
      </FormItem>
      <FormItem {...formItemLayout} label="分类描述">
        {form.getFieldDecorator('description', {
          rules: [{ max: 100, message: '最大长度不超过100' }],
          initialValue: listItemData.description,
        })(
          <TextArea
            style={{ minHeight: 32 }}
            disabled={itemDataStatus === 2}
            placeholder={itemDataStatus === 2?'':"请输入你的分类描述"}
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
  componentWillUnmount(){
     itemDataStatus = 1;
     listItemData = {};
     treeSelect = '';
    searchValue = {};
  }
  componentDidMount() {
    if(!localStorage.getItem('token_str')){
      return
    }
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
    this.fetchAll(params);
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
          callback: (response) => {
            console.log( response );
            if( response.code !== 200 ) {
              message.error( response.error );
              return;
            }
            message.success('删除成功');
            this.setState({
              selectedRows: [],
            });
            this.fetchAll()
            // this.setState({
            //   selectedRows: [],
            // });
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
  fetchAll =(data)=>{
    const { dispatch} = this.props;
    searchValue = data || searchValue
    dispatch({
      type: 'dervieClassify/fetch',
      payload: searchValue,
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
    const {
      dervieClassify: { treeData },
    } = this.props;
    if(status==4){
      let select = treeData.filter(r => {
        return treeSelect == r.id;
      });
      item.parentName = select[0].name
    }else{
      let select = treeData.filter(r => {
        return treeSelect == r.id;
      });
      if(select&&select.length>0) {
        let select1 = treeData.filter(r => {
          return select[0].parentId == r.id;
        });
        if(select1.length > 0){
          item.parentName = select1[0].name;
        }
      }
    }
    listItemData = item;
    itemDataStatus = status;
    this.handleModalVisible(true);
  };
  handleAdd = fields => {
    const { dispatch , dervieClassify: { treeData }} = this.props;
    if (itemDataStatus === 1) {
      dispatch({
        type: 'dervieClassify/update',
        payload: { ...listItemData, ...fields },
        callback: (res) => {
          message.success('修改成功');
          this.fetchAll();
          // if(res=='success'){
          //
          // }else{
          //   message.error('修改失败');
          // }
        },
      });

    } else {
      let select = treeData.filter(r => {
        return treeSelect == r.id;
      });
      let parentId = '';
      if (itemDataStatus == 3) {
        parentId = select[0]&&select[0].parentId;
      } else {
        parentId = select[0].id;
      }
      dispatch({
        type: 'dervieClassify/add',
        payload: {...fields,parentId:parentId},
        callback: (response) => {
          // console.log( res );
          if( response.code !== 200 ) {
            message.error(response.error);
            return;
          }
          message.success('添加成功');
          this.fetchAll();
          // if(res=='success'){
          //
          // }else{
          //   message.error('添加失败');
          // }
          this.setState({
            modalVisible: false,
          });
        },
      });
    }

  };

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }
  handleDelete = () => {
    const { dispatch } = this.props;
    if (this.state.selectedRows.length > 0) {
      confirm({
        title: '确定删除选中数据?',
        content: '删除数据不可恢复，请悉知！！！',
        okText: '确定',
        cancelText: '取消',
        onOk:()=> {
          this.state.selectedRows.forEach((item, index) => {
            if (index === this.state.selectedRows.length - 1) {
              dispatch({
                type: 'dervieClassify/remove',
                payload: {
                  id: item.id,
                }, callback: (response) => {
                  console.log( response );
                  if( response.code !== 200 ) {
                    message.error( response.error );
                    return;
                  }
                  message.success('删除成功');
                  this.setState({
                    selectedRows: [],
                  });
                  this.fetchAll();
                },
              });
              // message.success('删除成功');
              // this.setState({
              //   selectedRows: [],
              // });
            } else {
              dispatch({
                type: 'dervieClassify/remove',
                payload: {
                  id: item.id,
                },
              });
            }
          });
        },
        onCancel:()=> {
        },
      });
    }else{
      message.error('请先选择数据')
    }
  };
  handleTree = data => {
    const {
      dervieClassify: { treeData },
      dispatch,
    } = this.props;
    treeSelect = data[0];
    treeData.forEach(item=>{
      if(item.id == treeSelect){
        listItemData.parentName = item.name
        return
      }
    });
    this.fetchAll({ pid: treeSelect });
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
        title: '排序号',
        width:'150px',
        dataIndex: 'sort',
      },
      {
        title: '分类名称',
        width:'150px',
        dataIndex: 'name',
      },
      {
        title: '下级分类',
        width:'150px',
        render: (text, record, index) => <span>{text.childNum||0}</span>
      },
      {
        title: '分类结构',
        width:'150px',
        dataIndex: 'treeName'
      },
      {
        title: '分类来源',
        width:'150px',
        dataIndex: 'source',
      },
      {
        title: '分类描述',
        width:'150px',
        dataIndex: 'description',
      },
      {
        title: '操作',
        width:'150px',
        render: (text, record, index) => {
          return (
            <Fragment>
              <a onClick={() => {
                this.handleModal(text,2);
              }}>查看</a>
              <Divider type="vertical"/>
              <a onClick={() => {
                this.handleModal(text,1);
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
