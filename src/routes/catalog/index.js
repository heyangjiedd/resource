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
  Tabs,
  Cascader,
  Radio,
  List,
} from 'antd';
import DescriptionList from 'components/DescriptionList';
import StandardTable from 'components/StandardTable';
import StandardTableNoCheck from 'components/StandardTableNoCheck';
import StandardTableNothing from 'components/StandardTableNothing';
import StandardTableNoPage from 'components/StandardTableNoPage';
import StandardTableNoPage1 from 'components/StandardTableNoPage1';
import StandardTableRadio from 'components/StandardTableRadio';
import StandardTableEdit from 'components/StandardTableEdit';
import SimpleTableEdit from 'components/SimpleTableEdit';
import StandardTableRadioNopage from 'components/StandardTableRadioNopage';
import AnycSimpleTree from 'components/AnycSimpleTree';
import SimpleSelectTree from 'components/SimpleSelectTree';
import StandardTableNothingNoCloums from 'components/StandardTableNothingNoCloums';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './index.less';
import ARR from '../../assets/arr';
import EditableTable1 from '../../components/StandardTableEdit1';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
const { Description } = DescriptionList;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
let itemDataStatus = 0;
let listItemData = {};//列表选择
let modalListData = {};//弹窗第一页选择
let choiseListItemData = {};//弹窗中弹窗选择
let choiceSelectedRows = [];
let searchValue = { resourceId: '', relationDb: '', unrelationDb: '', api: '', files: '' }; //关联查询

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
              rules: [{ required: true, message: '请输入目录分类' }],
            })(<Input disabled={true} placeholder="请输入目录分类"/>)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <FormItem {...formItemLayout} label="信息资源名称">
            {form.getFieldDecorator('xxzymc', {
              rules: [{ required: true, message: '请输入信息资源名称' }],
            })(<Input disabled={true} placeholder="请输入信息资源名称"/>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formItemLayout} label="信息资源名称">
            {form.getFieldDecorator('xxzybm', {
              rules: [{ required: true, message: '请输入信息资源名称' }],
            })(<Input disabled={true} placeholder="请输入信息资源名称"/>)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <FormItem {...formItemLayout} label="资源提供方">
            {form.getFieldDecorator('zttgf', {
              rules: [{ required: true, message: '请输入资源提供方' }],
            })(<Input disabled={true} placeholder="请输入资源提供方"/>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formItemLayout} label="资源提供方">
            {form.getFieldDecorator('zttgfbm', {
              rules: [{ required: true, message: '请输入...' }],
            })(<Input disabled={true} placeholder="请输入"/>)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="关联资源分类">
            {form.getFieldDecorator('glzyfl', {
              rules: [{ required: true, message: '请输入...' }],
            })(<Input disabled={true} placeholder="请输入"/>)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <FormItem {...formItemLayout} label="所属资源格式">
            {form.getFieldDecorator('sszygs', {
              rules: [{ required: true, message: '请输入...' }],
            })(<Input disabled={true} placeholder="请输入"/>)}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem labelCol={{ span: 16 }} wrapperCol={{ span: 8 }} label="涉密标识">
            {form.getFieldDecorator('smbs', {
              rules: [{ required: true, message: '请输入...' }],
            })(<Input disabled={true} placeholder="请输入"/>)}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="周期">
            {form.getFieldDecorator('zq', {
              rules: [{ required: true, message: '请输入...' }],
            })(<Input disabled={true} placeholder="请输入"/>)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={6}>
          <FormItem labelCol={{ span: 16 }} wrapperCol={{ span: 8 }} label="共享类型">
            {form.getFieldDecorator('gxlx', {
              rules: [{ required: true, message: '请输入...' }],
            })(<Input disabled={true} placeholder="请输入"/>)}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} label="共享方式">
            {form.getFieldDecorator('gxff', {
              rules: [{ required: true, message: '请输入...' }],
            })(<Input disabled={true} placeholder="请输入"/>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formItemLayout} label="是否开放">
            {form.getFieldDecorator('sfkf', {
              rules: [{ required: true, message: '请输入...' }],
            })(<Input disabled={true} placeholder="请输入"/>)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <FormItem {...formItemLayout} label="共享条件">
            {form.getFieldDecorator('gxtj', {
              rules: [{ required: true, message: '请输入...' }],
            })(<TextArea disabled={true} placeholder="请输入" rows={4}/>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formItemLayout} label="开放条件">
            {form.getFieldDecorator('kftj', {
              rules: [{ required: true, message: '请输入...' }],
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
              rules: [{ required: true, message: '请输入...' }],
            })(<Input disabled={true} placeholder="请输入"/>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formItemLayout} label="结构化信息(万)">
            {form.getFieldDecorator('jghxx', {
              rules: [{ required: true, message: '请输入...' }],
            })(<Input disabled={true} placeholder="请输入"/>)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <FormItem {...formItemLayout} label="已共享数据量(G)">
            {form.getFieldDecorator('ygxsjl', {
              rules: [{ required: true, message: '请输入...' }],
            })(<Input disabled={true} placeholder="请输入"/>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formItemLayout} label="已共享结构化(万)">
            {form.getFieldDecorator('ygxjgh', {
              rules: [{ required: true, message: '请输入...' }],
            })(<Input disabled={true} placeholder="请输入"/>)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <FormItem {...formItemLayout} label="已放开数据量(G)">
            {form.getFieldDecorator('ykfsjl', {
              rules: [{ required: true, message: '请输入...' }],
            })(<Input disabled={true} placeholder="请输入"/>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formItemLayout} label="已开放结构化(万)">
            {form.getFieldDecorator('ykfjgh', {
              rules: [{ required: true, message: '请输入...' }],
            })(<Input disabled={true} placeholder="请输入"/>)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          信息项列表：
        </Col>
      </Row>
      {/*<StandardTableNothing*/}
      {/*loading={loading}*/}
      {/*data={data}*/}
      {/*columns={columns}*/}
      {/*/>*/}
    </Modal>
  );
});
const ChoiceList = Form.create()(props => {
  const { modalVisible, handleAdd, handleModalVisible, loading, data, columns, handleChoiceFeild, /*choiceFeild*/ selectedFields, curSelectedRowKeys} = props;
  const okHandle = () => {
    handleChoiceFeild(selectedRows);
    handleModalVisible();
  };
  let selectedRows = [];
  let columnsNoPage = [
    {
      title: '序号',
      width:'150px',
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: '字段',
      width:'150px',
      dataIndex: 'name',
    },
    {
      title: '备注',
      width:'150px',
      dataIndex: 'tableDesc',
    },

  ];
  const handleSelectRows = (data) => {
    selectedRows = data;
  };
  const handleStandardTableChange = () => {

  };
  return (
    <Modal
      title="选择字段"
      visible={modalVisible}
      onOk={okHandle}
      destroyOnClose={true}
      width={700}
      z-index={1001}
      onCancel={() => handleModalVisible()}
    >
      {/*<Row gutter={24}>*/}
        {/*<Col span={24}>*/}
          {/*<span>已选字段：{selectedRows.map(item => {*/}
            {/*return item.name;*/}
          {/*}).join(',')}</span>*/}
        {/*</Col>*/}
      {/*</Row>*/}
      <StandardTableNoPage1
        selectedRows={selectedRows}
        data={data}
        curSelectedRowKeys={curSelectedRowKeys}
        rowKey='id'
        scroll={{ y: 240 }}
        columns={columnsNoPage}
        onSelectRow={handleSelectRows}
        onChange={handleStandardTableChange}
      />
    </Modal>
  );
});
const CreateForm = Form.create()(props => {
  const {
    dispatch, modalVisible, form, handleAdd, handleModalVisible, data, handleItem, item, catalogItem, dataList, handleItemSearch,
    searchHandle, getListBuyId, choiseFeild, choiseList, type, handleType, /*choiceFeild, choiceFeildCount,*/choicelist, catalogItemChange,
    selectHttpItem, httpItem, lifelist, handleStandardTableChange,sourceTableField, selDataSource,selDataSourceIds, selectedFields, selectedFieldsCount, relationships,
  } = props;
  const { getFieldDecorator } = form;
  const columns = [
    {
      title: '数据源名称',
      width:'150px',
      dataIndex: 'sourceName',
    },
    {
      title: '数据源类型',
      width:'150px',
      dataIndex: 'sourceType',
    },
    {
      title: '数据源描述',
      width:'150px',
      dataIndex: 'content',
    },
    {
      title: '最近连接时间',
      width:'150px',
      dataIndex: 'createTime',
      render: val => <span>{val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '-'}</span>,
    },
    {
      title: '连接状态',
      width:'150px',
      dataIndex: 'linkStatus',
      render(val) {
        return <Badge status={val == 'on' ? 'success' : 'error'} text={val == 'on' ? '连通' : '未连通'}/>;
      },
    },
  ];
  const columnsdataList = [
    {
      title: '序号',
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: '表名',
      width:'150px',
      dataIndex: 'name',
    },
    {
      title: '字段数',
      width:'150px',
      dataIndex: 'fieldNum',
    },
    {
      title: '表描述',
      width:'150px',
      dataIndex: 'description',
    },
    {
      title: '已选字段',
      width:'150px',
      dataIndex: 'selectedFieldNum',
    },
    {
      title: '选择字段',
      width:'150px',
      render: (text, record, index) => {
        return (
          <Fragment>
            <a onClick={() => {
              choiseListItemData = text;
              choiseFeild(text);
            }}>选择字段</a>
          </Fragment>
        );
      },
    },
  ];
  const columnscatalogItem = [
    {
      title: '序号',
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: '信息项',
      width:'150px',
      dataIndex: 'name',
    },
    {
      title: '信息项描述',
      width:'150px',
      dataIndex: 'description',
    },
    {
      title: '信息项类型',
      width:'150px',
      dataIndex: 'type',
    },
    {
      title: '信息项长度',
      width:'150px',
      dataIndex: 'len',
    },
  ];
  const filecolumns = [
    {
      title: '文件名称',
      width:'150px',
      dataIndex: 'name',
    }, {
      title: '文件类型',
      width:'150px',
      dataIndex: 'type',
    }];
  const fgxxsjkcolumns = [
    {
      title: '序号',
      width: '150px',
      render: (text, record, index) => <span>{index + 1}</span>,
    }, {
      title: '集合',
      width: '150px',
      dataIndex: 'name',
    }];
  const columnscatalogfeild = [
    {
      title: '序号',
      width: '150px',
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: '信息源',
      width:'150px',
      dataIndex: 'name',
    }, {
      title: '信息源描述',
      width:'150px',
      dataIndex: 'description',
    }, {
      title: '信息源类型',
      width:'150px',
      dataIndex: 'type',
    }, {
      title: '信息源长度',
      width:'150px',
      dataIndex: 'len',
    }, {
      title: '字段名',
      width:'150px',
      dataIndex: 'feild_name',
      render: (text, record, index) => {
        return <Select placeholder={'请选择'} style={{ width: 120 }}
                       getPopupContainer={triggerNode => triggerNode.parentNode} onSelect={(select, current) => {
          save(text, record, index, select, current);
        }}>
          {/*{choiceFeild.map(item => {*/}
          {selectedFields.map(item => {
            return (
              <Option title={item.name} value={item.id}>{item.name}</Option>
            );
          })}
        </Select>;
      },
    }, {
      title: '字段描述',
      width:'150px',
      dataIndex: 'feild_description',
    }, {
      title: '字段类型',
      width:'150px',
      dataIndex: 'feild_type',
    }, {
      title: '字段长度',
      width:'150px',
      dataIndex: 'feild_len',
    },
  ];
  let selectedRows = [];
  let choiceFeildSelectedRows = [];
  let addTableSelectedRows = [];
  let addFeilsSelectedRows = [];
  let addTableRows = [];
  let setTableRows = [];
  let fgxxsjkHandleSelectRows = [];
  let fileTableSelectedRows = [];
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  const getSelectRows = (data) => {
    setTableRows = data;
  };
  const submitHandle = () => {
    if (item == 2) {
      // if(choiceFeildCount == 0){
      if(selectedFields.length == 0){
        message.error('请先选择字段');
        return
      }
      // if(choiceFeildCount>=2&&setTableRows.length==0){
      if(selectedFields.length>=2&&setTableRows.length==0){
        message.error('请先设置表间关系');
        return
      }
      handleAdd(catalogItem, setTableRows);
    } else if (item == 3) {
      if(fgxxsjkHandleSelectRows.length <= 0){
        message.error('请先勾选数据');
        return
      }
      handleAdd(fgxxsjkHandleSelectRows);
    } else if (item == 4) {
      if( fileTableSelectedRows.length === 0 ) {
        message.error('请先勾选数据');
        return
      }
      handleAdd(fileTableSelectedRows);
    } else if (item == 5) {
      handleAdd();
    }
  };
  const save = (text, record, index, select, current) => {
    let params = selectedFields.filter(item => {
      return item.id == select;
    })[0];
    record = {
      ...record, ...{
        feild_description: params.description,
        feild_type: params.type,
        feild_len: params.len,
        feild_id: params.id,
      },
    };
    catalogItemChange(record);
  };
  const cancel = () => {
    choiceSelectedRows = [];
    handleItem(1, true);
    handleModalVisible(false);
  };
  const firstFooter = (<Row>
    <Col md={24} sm={24}>
      <Button type="primary" onClick={() => {
        if (!choiceSelectedRows || choiceSelectedRows.length == 0) {
          message.error('请先勾选数据');
          return;
        }
        if (choiceSelectedRows[0].sourceType === 'mysql' || choiceSelectedRows[0].sourceType === 'oracle' || choiceSelectedRows[0].sourceType === 'sqlserver'
          || choiceSelectedRows[0].sourceType === 'db2') {
          getListBuyId(choiceSelectedRows[0], 2);
        } else if (choiceSelectedRows[0].sourceType === 'mongo' || choiceSelectedRows[0].sourceType === 'hbase') {
          getListBuyId(choiceSelectedRows[0], 3);
        } else if (choiceSelectedRows[0].sourceType === 'http' || choiceSelectedRows[0].sourceType === 'https' || choiceSelectedRows[0].sourceType === 'wsdl'
          || choiceSelectedRows[0].sourceType === 'rest') {
          getListBuyId(choiceSelectedRows[0], 5);
        } else if (choiceSelectedRows[0].sourceType === 'ftp' || choiceSelectedRows[0].sourceType === 'sftp' || choiceSelectedRows[0].sourceType === 'local'
          || choiceSelectedRows[0].sourceType === 'share') {
          getListBuyId(choiceSelectedRows[0], 4);
        }
      }}>
        下一步
      </Button>
      <Button onClick={cancel}>
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
      <Button type="primary" onClick={submitHandle}>
        提交
      </Button>
      <Button onClick={cancel}>
        取消
      </Button>
    </Col>
  </Row>);
  const onChange = (index) => {
    searchValue.relationDb = '';
    searchValue.unrelationDb = '';
    searchValue.api = '';
    searchValue.files = '';
    if (index[1] === 'mysql' || index[1] === 'oracle' || index[1] === 'sqlserver'
      || index[1] === 'db2') {
      searchValue.relationDb = index[1];
    } else if (index[1] === 'mongo' || index[1] === 'hbase') {
      searchValue.unrelationDb = index[1];
    } else if (index[1] === 'http' || index[1] === 'https' || index[1] === 'wsdl'
      || index[1] === 'rest') {
      searchValue.api = index[1];
    } else if (index[1] === 'ftp' || index[1] === 'sftp' || index[1] === 'local'
      || index[1] === 'share') {
      searchValue.file = index[1];
    }
  };

  const handleFeildSelectRows = (data) => {
    choiceFeildSelectedRows = data;
  };
  const filehandleSelectRows = (data) => {
    fileTableSelectedRows = data;
  };
  const fgxxsjkhandleSelectRows = (data) => {
    fgxxsjkHandleSelectRows = data;
  };
  const handleSelectRows = (data) => {
    // console.log(data);
    // selDataSource
    dispatch({
      type: 'catalog/setSelDataSource',
      payload: data,
    });
    choiceSelectedRows = data;

  };
  const handleSubmit = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleItemSearch({ ...searchValue, ...fieldsValue });
    });
  };
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 },
      md: { span: 18 },
    },
  };
  return (<Modal
      title="目数关联"
      visible={modalVisible}
      width={900}
      destroyOnClose={true}
      footer={item === 1 ? firstFooter : secondFooter}
      onOk={handleItem}
      onCancel={cancel}
    >
      {item === 1 ? <div><Form onSubmit={handleSubmit}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={12}>
            <FormItem {...formItemLayout} label="资源分类">
              <SimpleSelectTree url={'classify/tree'} transMsg={(index) => {
                searchValue.resourceId = index;
              }}></SimpleSelectTree>
            </FormItem>
          </Col>
          <Col md={12} sm={12}>
            <FormItem {...formItemLayout} label="数据源类型"><Cascader style={{ width: 100 + '%' }} options={ARR.CASCADER}
                                                                  onChange={onChange}
                                                                  placeholder="请选择数据源/数据库"/>
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={12}>
            <FormItem {...formItemLayout} label="数据源名称">
              {getFieldDecorator('sourceName')(<Input placeholder="请输入数据源名称"/>)}
            </FormItem>
          </Col>
          <Col md={4} sm={12}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </span>
          </Col>
        </Row><Row gutter={{ md: 8, lg: 24, xl: 48 }}>

      </Row></Form><StandardTableRadio
        selectedRowKeys={selDataSourceIds}
        data={data}
        columns={columns}
        onSelectRow={handleSelectRows}
        onChange={handleStandardTableChange}
      /></div> : item === 2 ? <div>
        {/*<Row gutter={{ md: 8, lg: 24, xl: 48 }}>*/}
        {/*<Col md={12} sm={24}>*/}
        {/*<FormItem {...formItemLayout} label="新增类型">*/}
        {/*{getFieldDecorator('status')(*/}
        {/*<Select placeholder="选择新增类型" style={{ width: '100%' }}>*/}
        {/*<Option value="关系型数据库">关系型数据库</Option>*/}
        {/*<Option value="非关系型数据库">非关系型数据库</Option>*/}
        {/*</Select>,*/}
        {/*)}*/}
        {/*</FormItem>*/}
        {/*</Col>*/}
        {/*<Col md={12} sm={24}>*/}
        {/*<FormItem {...formItemLayout} label="请选择表/视图">*/}
        {/*<RadioGroup onChange={this.onChange}>*/}
        {/*<Radio value='table'>表</Radio>*/}
        {/*<Radio value='view'>视图</Radio>*/}
        {/*</RadioGroup>*/}
        {/*</FormItem>*/}
        {/*</Col>*/}
        {/*</Row>*/}
        <Row>
          <Col>
            <span>
              信息资源所含信息项一览：
            </span>
          </Col>
        </Row>
        <Row>
          <StandardTableNothing
            data={catalogItem}
            scroll={{ y: 180 }}
            columns={columnscatalogItem}
          />
        </Row>
        <Row>
          <Col>
            <span>共{catalogItem.length}个信息项</span>
          </Col>
        </Row>
        <Row>
          <Col>
            <span>请选择字段：</span>
          </Col>
        </Row>
        {/*<Row>*/}
        {/*<Col md={12} sm={24}>*/}
        {/*<FormItem {...formItemLayout} label="请选择表/视图">*/}
        {/*<RadioGroup onChange={this.onChange}>*/}
        {/*<Radio value='table'>表</Radio>*/}
        {/*<Radio value='view'>视图</Radio>*/}
        {/*</RadioGroup>*/}
        {/*</FormItem>*/}
        {/*</Col>*/}
        {/*</Row>*/}
        <Row>
          <StandardTableNothing
            data={sourceTableField}
            scroll={{ y: 180 }}
            columns={columnsdataList}
          />
        </Row>
        <Row>
          <Col>
            <span>
              {/*已选字段：<span>{choiceFeild.map(item => {*/}
              已选字段：<span>{
                selectedFields.map((item) => {
                  let subitem = item.map(item0=>{
                    return item0.tableName + '(' + item0.name + ')';
                  }).join(',');
                return subitem + ',';
                })}</span>
            </span>
          </Col>
        </Row>
        <Row>
          <Col>
            <span>
              {/*已选择<span>{choiceFeildCount}</span>张表，共<span>{choiceFeild.length}</span>个字段，需设置至少<span>{(choiceFeildCount || 1) - 1}</span>个表间关系*/}
              已选择<span>{Object.keys(selectedFields).length}</span>张表，共<span>{selectedFieldsCount}</span>个字段，需设置至少<span>{(Object.keys(selectedFields).length || 1) - 1}</span>个表间关系
            </span>
          </Col>
        </Row>
        {selectedFieldsCount > 1?<div>        <Row>
          <Col>
            <span>
              设置表间关系：
            </span>
          </Col>
        </Row>
          <Row>
            <EditableTable1
              // selectedRows={addTableSelectedRows}
              relationships={relationships}
              dispatch={dispatch}
              // selectItemTable={choicelist}
              selectedFields={selectedFields}
              transMsg={getSelectRows}
              scroll={{ y: 180 }}
            />
          </Row></div>:''}
        <Row>
          <Col>
            <span>
              选择表字段与信息资源信息项映射：
            </span>
          </Col>
        </Row>
        <Row>
          <StandardTableNothing
            data={catalogItem}
            columns={columnscatalogfeild}
          />
          {/*<SimpleTableEdit*/}
          {/*data={catalogItem}*/}
          {/*selectItemFeild={choiceFeild}*/}
          {/*scroll={{ y: 180 }}*/}
          {/*transMsg={(index)=>{*/}
          {/*setTableRows = index*/}
          {/*}}*/}
          {/*/>*/}
        </Row>
      </div> : item === 3 ? <div>
        <StandardTableRadioNopage
          selectedRows={fgxxsjkHandleSelectRows}
          data={dataList}
          columns={fgxxsjkcolumns}
          onSelectRow={fgxxsjkhandleSelectRows}
          scroll={{ y: 480 }}
        />
      </div> : item === 4 ? <div>
        <Row>
          <Col>
            <FormItem>
              {getFieldDecorator('filename')(<Input placeholder="请输入文件地址名称"/>)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <StandardTableNoPage
            selectedRows={fileTableSelectedRows}
            data={lifelist}
            columns={filecolumns}
            onSelectRow={filehandleSelectRows}
            scroll={{ y: 480 }}
          />
        </Row>
      </div> : <div>
        <DescriptionList size="large" title="详情" style={{ marginBottom: 32 }}>
          <Description term="服务名称">{httpItem.interfaceName}</Description>
          <Description term="所属数据源">{httpItem.sourceName}</Description>
          <Description term="接口类型">{httpItem.interfaceType}</Description>
          <Description term="数据格式">{httpItem.content}</Description>
          <Description term="服务类型">代理接口</Description>
          <Description term="服务地址">{httpItem.interfaceUrl}</Description>
        </DescriptionList>
      </div>}
    </Modal>
  );
});
const ResourceDetail = Form.create()(props => {
  const {
    modalVisible, form, handleModalVisible, loading, data, columns, detailType, tableAndField,
    radioSwitch, radioSwitcHandle, operateLog, lifelist, httpItem, searchHandle, sqlList, excSql, excSqlTableChange,catalogTable,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  const exHandle = (index) => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      excSql(fieldsValue);
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
  const onChange = (value) => {
    radioSwitcHandle(value.target.value);
  };
  const gxxsjkdatacolumns = [];
  if (sqlList.length > 0) {
    for (let feild in sqlList[0]) {
      gxxsjkdatacolumns.push({
        title: feild,
        dataIndex: feild,
        width: 100,
      });
    }
  }
  const gxxsjkfieldcolumns = [
    {
      title: '字段名',
      width:'150px',
      dataIndex: 'name',
    }, {
      title: '字段描述',
      width:'150px',
      dataIndex: 'tableDesc',
    }, {
      title: '类型',
      width:'150px',
      dataIndex: 'type',
    }, {
      title: '长度',
      width:'150px',
      dataIndex: 'len',
    }, {
      title: '所属表',
      width:'150px',
      dataIndex: 'tableName',
    }];
  const apilogcolumns = [
    {
      title: '序号',
      width:'150px',
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: '服务调用用户',
      width:'150px',
      dataIndex: 'content',
    }, {
      title: '最近一次接口调用开始时间',
      width:'200px',
      dataIndex: 'content',
    }, {
      title: '最近一次接口调用结束时间',
      width:'200px',
      dataIndex: 'content',
    }, {
      title: '累积调用次数',
      width:'150px',
      dataIndex: 'content',
    }, {
      title: '调用方式',
      width:'150px',
      dataIndex: 'content',
    },
  ];
  const filelogcolumns = [
    {
      title: '序号',
      width:'150px',
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: '文件名称',
      width:'150px',
      dataIndex: 'fileId',
    }, {
      title: '服务调用用户',
      width:'150px',
      dataIndex: 'userName',
    }, {
      title: '最近一次数据调用开始时间',
      width:'150px',
      dataIndex: 'startTime',
    }, {
      title: '最近一次数据调用结束时间',
      width:'150px',
      dataIndex: 'endTime',
    }, {
      title: '累积调用次数',
      width:'150px',
      dataIndex: 'num',
    }, {
      title: '调用方式',
      width:'150px',
      dataIndex: 'type',
    }];
  const fgxxsjkdatacolumns = [
    {
      title: '集合名称',
      width:'150px',
      dataIndex: 'name',
    }, {
      title: '所属数据源',
      width:'150px',
      dataIndex: 'description',
    },
  ];
  const lifelistcolumns = [
    {
      title: '文件名称',
      width:'150px',
      dataIndex: 'name',
    }, {
      title: '文件类型',
      width:'150px',
      dataIndex: 'type',
    },
    // {
    //   title: '文件描述',
    //   width:'150px',
    //   dataIndex: 'description',
    // },
  ];
  let indexList = [];
  let indexAndOr = '';
  return (
    <Modal
      title="资源详情"
      visible={modalVisible}
      footer={null}
      onOk={okHandle}
      destroyOnClose={true}
      width={900}
      onCancel={() => handleModalVisible()}
    >
      {detailType == 1 ? <div><Tabs defaultActiveKey='1'>
        <TabPane tab="数据详情" key="1" >
          <DescriptionList size="large" title="过滤条件" style={{ marginBottom: 0 }}>
          </DescriptionList>
          <Row>
            <Col md={12} sm={24}>
              <FormItem {...formItemLayout} label="请选择表/视图">
                <RadioGroup onChange={onChange} defaultValue={radioSwitch}>
                  <Radio value='view' defaultChecked={true}>视图操作</Radio>
                  <Radio value='sql'>SQL操作</Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
          {radioSwitch == 'view' ? <div>
              <SimpleTableEdit
                scroll={{ y: 180 }}
                search={searchHandle}
                data={[]}
                selectItemFeild={[].concat.apply([], tableAndField.map(item => {
                  return item.tableFieldList;
                }))}
                transMsg={(index, andOr) => {
                  indexList = index;
                  indexAndOr = andOr;
                }}
              />
            </div> :
            <div>
              <DescriptionList size="large" title="请编写SQL语句" style={{ marginBottom: 0 }}>
              </DescriptionList>
              <FormItem>
                {form.getFieldDecorator('sql')(
                  <TextArea
                    style={{ minHeight: 32 }}
                    rows={4}
                  />,
                )}
              </FormItem>
              {/*<Button size="small" style={{ marginRight: 20 }} onClick={() => {*/}
              {/*}}>*/}
              {/*SQL语法检测*/}
              {/*</Button>*/}
              <Button size='small' style={{ marginTop: 20 }} type="primary" onClick={exHandle}>
                执行SQL语句
              </Button>
            </div>}
          <DescriptionList size="large" title="数据详情" style={{ marginBottom: 32 }}>
          </DescriptionList>
          <StandardTableNothingNoCloums
            scroll={{ x: true }}
            loading={loading}
            data={sqlList}
            columns={gxxsjkdatacolumns}
            onChange={excSqlTableChange}
          />
        </TabPane>
        <TabPane tab="表结构" key="2" >
          {tableAndField.map(item => {
            return (<div>
              <DescriptionList size="large" col={2} title="信息资源详情" style={{ marginBottom: 32 }}>
                <Description term="信息资源名称">{item.sourceTable.name}</Description>
                <Description term="关联资源类型">{item.sourceTable.type}</Description>
                <Description term="注释">{item.sourceTable.description}</Description>
              </DescriptionList>
              <DescriptionList size="large" title="字段信息" style={{ marginBottom: 32 }}>
                <StandardTableNothing
                  loading={loading}
                  data={item.tableFieldList}
                  columns={gxxsjkfieldcolumns}
                /></DescriptionList></div>);
          })}

        </TabPane>
      </Tabs></div> : detailType == 2 ?
        <div>
          {/*<DescriptionList size="large" col={2} title="" style={{ marginBottom: 32 }}>*/}
          {/*<Description term="集合名称">{catalogTable[0]&&catalogTable[0].name||''}</Description>*/}
          {/*<Description term="所属数据源">{catalogTable[0]&&catalogTable[0].description||''}</Description>*/}
          {/*</DescriptionList>*/}
          <StandardTableNothing
            loading={loading}
            data={catalogTable}
            columns={fgxxsjkdatacolumns}
          />
        </div> : detailType == 3 ?
          <div>
            <DescriptionList size="large" col={2} title="基本信息详情" style={{ marginBottom: 32 }}>
              <Description term="服务名称">{httpItem.interfaceName}</Description>
              <Description term="所属数据源">{httpItem.sourceName}</Description>
              <Description term="调用数量">{operateLog.total||0}</Description>
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
          </div> :
          <div>
            <DescriptionList size="large" title="文件信息" style={{ marginBottom: 32 }}>
              <StandardTableNothing
                selectedRows={[]}
                onSelectRow={[]}
                loading={loading}
                data={lifelist}
                columns={lifelistcolumns}
              />
              {/*<List*/}
              {/*rowKey="id"*/}
              {/*grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}*/}
              {/*dataSource={lifelist}*/}
              {/*renderItem={item =>*/}
              {/*<List.Item key={item.id}>*/}
              {/*<Card hoverable className={styles.card}>*/}
              {/*<Card.Meta*/}
              {/*description={*/}
              {/*<DescriptionList size="large"  col={1} title="" style={{ marginBottom: 12 }}>*/}
              {/*<Description term="文件名称">{item.name}</Description>*/}
              {/*<Description term="文件类型">{item.type}</Description>*/}
              {/*<Description term="文件描述">{item.description}</Description>*/}
              {/*</DescriptionList>*/}
              {/*}*/}
              {/*/>*/}
              {/*</Card>*/}
              {/*</List.Item>*/}
              {/*}*/}
              {/*/>*/}
            </DescriptionList>
            <DescriptionList size="large" title="数据调用记录" style={{ marginBottom: 32 }}>
              <StandardTableNoCheck
                selectedRows={[]}
                onSelectRow={[]}
                loading={loading}
                data={operateLog}
                columns={filelogcolumns}
              /></DescriptionList>
          </div>}


    </Modal>
  );
});
@connect(({ catalog, centersource, loading }) => ({
  catalog,
  centersource,
  loading: loading.models.catalog,
}))
@Form.create()
export default class ResourceClassify extends PureComponent {
  state = {
    modalVisible: false,
    modalVisibleChoice: false,
    modalVisibleCatlog: false,
    modalVisibleResource: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    item: 1,
    type: 1,
    detailType: 1,
    // choiceFeild: [],
    // choiceFeildCount: 0,
    radioSwitch: 'view',
  };
  componentDidMount() {
    if(!localStorage.getItem('token_str')){
      return
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'catalog/fetch',
      payload: {classifyId:307024003},
    });
    // dispatch({
    //   type: 'catalog/tree',
    //   payload: {region:'000000',type:'7'},
    // });
  }

  handleStandardTableChangeDataSource = (pagination, filtersArg, sorter) => {
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
      dispatch({
        type: 'catalog/fetch',
        payload: values,
      });
    });
  };

  handleModalVisibleCatlog = flag => {
    this.setState({
      modalVisibleCatlog: !!flag,
    });
  };
  handleModalVisibleResource = flag => {
    const { dispatch } = this.props;
    dispatch({
      type: 'centersource/fetchViewSetNull',
      callback: () => {
        this.setState({
          modalVisibleResource: !!flag,
        });
      },
    });
  };
  handleModalVisible = flag => {
    const {dispatch} = this.props;
    searchValue = { resourceId: '', relationDb: '', unrelationDb: '', api: '', files: '' };
    this.setState({
      modalVisible: !!flag,
      // choiceFeild: [],
      // choiceFeildCount: 0,
      choicelist:[],
      item: 1,
    });

    //清空所有选择
    dispatch({
      type: 'catalog/clearSelect',
    });

  };
  handleModalCatlog = (item, status) => {
    listItemData = item;
    itemDataStatus = status;
    this.handleModalVisibleCatlog(true);
  };
  handleModalResource = (item, status) => {
    listItemData = item;
    itemDataStatus = status;
    const { dispatch } = this.props;
    if (!listItemData.sourceType) {
      return;
    }
    if (listItemData.sourceType === 'mysql' || listItemData.sourceType === 'oracle' || listItemData.sourceType === 'sqlserver'
      || listItemData.sourceType === 'db2') {
      dispatch({
        type: 'catalog/catalogTableAndTableField',
        payload: { catalogId: listItemData.id },
      });
      this.setState({
        detailType: 1,
      });
    } else if (listItemData.sourceType === 'mongo' || listItemData.sourceType === 'hbase') {
      dispatch({
        type: 'catalog/catalogTable',
        payload: { catalogId: listItemData.id },
      });
      this.setState({
        detailType: 2,
      });
    } else if (listItemData.sourceType === 'http' || listItemData.sourceType === 'https' || listItemData.sourceType === 'wsdl'
      || listItemData.sourceType === 'rest') {
      dispatch({
        type: 'centersource/get',
        payload: { id: listItemData.dataSourceId },
      });
      dispatch({
        type: 'catalog/operateLog',
        payload: { id: listItemData.dataSourceId, type: 'api' },
      });
      this.setState({
        detailType: 3,
      });
    } else if (listItemData.sourceType === 'ftp' || listItemData.sourceType === 'sftp' || listItemData.sourceType === 'local'
      || listItemData.sourceType === 'share') {
      dispatch({
        type: 'centersource/fetchFile',
        payload: {
          id: listItemData.dataSourceId,
          catalogId: listItemData.id,
        },
      });
      dispatch({
        type: 'catalog/operateLog',
        payload: { id: listItemData.dataSourceId, type: 'file' },
      });
      this.setState({
        detailType: 4,
      });
    }
    this.handleModalVisibleResource(true);
  };
  handleItemSearch = (index) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'centersource/fetch',
      payload: index,
    });
  };
  handleModal = (item, status) => {
    listItemData = item;
    itemDataStatus = status;
    const { dispatch } = this.props;
    dispatch({
      type: 'centersource/fetch',
    });
    this.handleModalVisible(true);
  };
  handleModalVisibleChoice = flag => {
    this.setState({
      modalVisibleChoice: !!flag,
    });
  };
  handleAddChoice = (data, index) => {

  };
  handleAdd = (catalogItem, addTableRows) => {
    const { dispatch, catalog } = this.props;
    // const { choiceFeild } = this.state;
    const { selectedFields } = catalog;
    if (this.state.item == 2) {
      let itemFieldList = catalogItem.map(item => {
        return {
          'fieldId': item.feild_id,
          'itemId': item.id,
        };
      });
      let tableRelationList = addTableRows.map(item => {
        return {
          'leftFieldId': item.feils1,
          'leftTableId': item.name1,
          'rightFieldId': item.feils2,
          'rightTableId': item.name2,
        };
      });
      // let fieldIds = choiceFeild.map(item => {
      let fieldIds = selectedFields.map(item => {
        return item.id;
      }).join(',');
      let params = {
        fieldIds: fieldIds,
        dataSourceId: modalListData.id,
        catalogId: listItemData.id,
        itemFieldList: itemFieldList,
        tableRelationList: tableRelationList,
      };
      dispatch({
        type: 'catalog/add',
        payload: params,
        callback: () => {
          message.success('添加成功');
          this.setState({
            modalVisible: false,
          });
          dispatch({
            type: 'catalog/fetch',
            payload: params,
          });
        },
      });
    } else if (this.state.item == 3) {
      let itemFieldList = catalogItem.map(item => {
        return item.id;
      });
      let params = {};
      params[listItemData.id] = itemFieldList;
      dispatch({
        type: 'catalog/catalogCollection',
        payload: params,
        callback: () => {
          message.success('添加成功');
          this.setState({
            modalVisible: false,
          });
          dispatch({
            type: 'catalog/fetch',
            payload: params,
          });
        },
      });
    } else if (this.state.item == 4) {
      let itemFieldList = catalogItem.map(item => {
        return item.id;
      });
      let params = {};
      params[listItemData.id] = itemFieldList;
      dispatch({
        type: 'catalog/catalogFile',
        payload: params,
        callback: () => {
          message.success('添加成功');
          this.setState({
            modalVisible: false,
          });
          dispatch({
            type: 'catalog/fetch',
            payload: params,
          });
        },
      });
    } else if (this.state.item == 5) {
      let params = {};
      params[listItemData.id] = [modalListData.id];
      dispatch({
        type: 'catalog/catalogApi',
        payload: params,
        callback: () => {
          message.success('添加成功');
          this.setState({
            modalVisible: false,
          });
          dispatch({
            type: 'catalog/fetch',
            payload: params,
          });
        },
      });
    }
  };
  handleItem = (index) => {
    // const { dispatch } = this.props;
    // const {
    //   catalog: { selDataSource },
    // } = this.props;

    this.setState({
      item: index,
    });

    // dispatch({
    //   type: 'catalog/setSelDataSource',
    //   payload: selDataSource,
    // });
  };
  handleType = (index) => {
    this.setState({
      type: index,
    });
  };
  choiseFeild = (data) => {
    const { dispatch } = this.props;
    this.handleModalVisibleChoice(true);
    // console.log(data);
    dispatch({
      type: 'catalog/saveCurrentTable',
      payload: data,
    });

    dispatch({
      type: 'catalog/tableField',
      payload: { tableId: data.id },
    });
  };
  getListBuyId = (data, index) => {
    this.handleItem(index);
    const { dispatch } = this.props;
    modalListData = data;
    if (index == 2 || index == 3) {
      dispatch({
        type: 'catalog/querycatalogItem',
        payload: { catalogId: listItemData.id },
      });
      dispatch({
        type: 'catalog/sourceTable',
        payload: { catalogId: listItemData.id,
          dataSourceId:data.id },
      });
      // dispatch({
      //   type: 'centersource/fetchTable',
      //   payload: { id: data.id },
      // });
    }
    if (index == 4) {
      dispatch({
        type: 'centersource/fetchFile',
        payload: { id: data.id },
      });
    }
    if (index == 5) {
      dispatch({
        type: 'centersource/get',
        payload: { id: data.id },
      });
    }
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
      payload: { classifyId: data[0] },
    });
  };
  handleChoiceFeild = (list) => {
    const { dispatch } = this.props;
    // const { choiceFeild, choiceFeildCount ,choicelist} = this.state;
    const {choicelist} = this.state;
    // console.log("handleChoiceFeild");
    // console.log( list );
    // this.setState({
    //   choiceFeildCount: choiceFeildCount + 1,
    // });
    this.setState({
      choicelist:choicelist.concat([{...choiseListItemData}]),
    });
    // this.setState({
    //   choiceFeild: [...new Set(choiceFeild.concat(list))],
    // });

    dispatch({
      type: 'catalog/selectField',
      payload: list,
    });
  };
  catalogItemChange = (index) => {
    const { dispatch, catalog: { catalogItem } } = this.props;
    let list = catalogItem.map(item => {
      if (item.id == index.id)
        item = index;
      return item;
    });
    dispatch({
      type: 'catalog/querycatalogItemCopy',
      payload: list,
    });
  };
  radioSwitcHandle = (index) => {
    this.setState({
      radioSwitch: index,
    });
  };
  excSql = (index) => {
    const { dispatch } = this.props;
    let params = {
      'params': index.sql,
      'dataSourceId': listItemData.dataSourceId,
      tableId:0,
      pageSize:10,
      pageNum:1,
    };
    dispatch({
      type: 'centersource/fetchTableData',
      payload: params,
    });
  };
  excSqlTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    };
    dispatch({
      type: 'centersource/fetchTableData',
      payload: params,
    });
  };
  searchHandle = (list, value) => {
    const { dispatch } = this.props;
    let param = list.map(item => {
      return {
        'fieldName': item.field,
        'operation': item.condition,
        'value': item.value,
        'tableId': item.tableId,
        'valueType': item.valueType,
      };
    });
    let params = {
      'accordWith': value,
      'catalogId': listItemData.id,
      'params': param,
      deriveId:0,
      tableId:0,
      pageSize:10,
      pageNum:1,
    };
    dispatch({
      type: 'centersource/fetchView',
      payload: params,
    });
  };

  render() {
    const {
      catalog: { data, catalogItem, field, tableAndField, logdata, catTable,sourceTableField, selDataSource, selDataSourceIds, curSelectedRowKeys, selectedFields, selectedFieldsCount, relationships },
      loading,
      centersource: { sqlList, data: formData, dataList, lifelist: { list: lifelist }, httpItem },
      form,
      dispatch,
    } = this.props;
    const { selectedRows, modalVisible, modalVisibleCatlog, radioSwitch, modalVisibleResource, modalVisibleChoice, item, type /*choiceFeild, choiceFeildCount*/,choicelist, detailType } = this.state;

    const parentMethods = {
      dispatch: dispatch,
      httpItem: httpItem,
      handleStandardTableChange: this.handleStandardTableChangeDataSource,
      lifelist: lifelist,
      handleAdd: this.handleAdd,
      handleItem: this.handleItem,
      handleModalVisible: this.handleModalVisible,
      choiseFeild: this.choiseFeild,
      getListBuyId: this.getListBuyId,
      handleItemSearch: this.handleItemSearch,
      data: formData,
      catalogItem: catalogItem,
      catalogItemChange: this.catalogItemChange,
      dataList: dataList,
      item: item,
      relationships: relationships,
      modalVisible: modalVisible,
      type: type,
      handleType: this.handleType,
      sourceTableField:sourceTableField,
      selectedFields: selectedFields,
      selectedFieldsCount: selectedFieldsCount,
      // choiceFeild: choiceFeild,
      choicelist:choicelist,
      // choiceFeildCount: choiceFeildCount,
      selDataSource: selDataSource,
      selDataSourceIds: selDataSourceIds,
    };
    const parentMethodsChoice = {
      data: field,
      curSelectedRowKeys: curSelectedRowKeys,
      // choiceFeild: choiceFeild,
      selectedFields: selectedFields,
      handleChoiceFeild: this.handleChoiceFeild,
      handleAdd: this.handleAddChoice,
      handleModalVisible: this.handleModalVisibleChoice,
    };
    const parentMethodsCatlog = {
      handleAdd: this.handleAddCatlog,
      handleModalVisible: this.handleModalVisibleCatlog,
    };

    const parentMethodsResource = {
      handleAdd: this.handleAddResource,
      radioSwitcHandle: this.radioSwitcHandle,
      operateLog: logdata,
      sqlList: sqlList,
      excSql: this.excSql,
      excSqlTableChange:this.excSqlTableChange,
      lifelist: lifelist,
      httpItem: httpItem,
      searchHandle: this.searchHandle,
      radioSwitch: radioSwitch,
      tableAndField: tableAndField,
      catalogTable: catTable,
      detailType: detailType,
      handleModalVisible: this.handleModalVisibleResource,
    };
    const columns = [
      {
        title: '序号',
        width:'150px',
        render: (text, record, index) => <span>{index + 1}</span>,
      },
      {
        title: '信息资源名称',
        width:'150px',
        dataIndex: 'datasetName',
      },
      {
        title: '目录分类',
        width:'150px',
        dataIndex: 'classifyStructureName',
      },
      {
        title: '关联资源类型',
        width:'150px',
        dataIndex: 'sourceType',
      },
      {
        title: '操作',
        width:'150px',
        render: (text, record, index) => {
          return (
            <Fragment>
              {/*<a onClick={() => {*/}
              {/*// listItemData = text;*/}
              {/*// this.handleModalCatlog()*/}
              {/*}}>目录详情</a>*/}
              {/*<Divider type="vertical"/>*/}
              <a onClick={() => {
                this.handleModal(text, true);
              }}>目数关联</a>
              <Divider type="vertical"/>
              {
                text.sourceType? <a onClick={() => {
                  this.handleModalResource(text, true);
                }}>资源详情</a>: <span style={{color:'#a8abaf'}} onClick={() => {
                  }}>资源详情</span>
              }


            </Fragment>
          );
        },
      },
    ];
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
        md: { span: 18 },
      },
    };
    return (
      <PageHeaderLayout>
        {/*<Col xl={6} lg={6} md={6} sm={6} xs={6} style={{ marginBottom: 24 }}>*/}
        <div className={styles.flexMain}>
          <AnycSimpleTree
            handleTree={this.handleTree}
            title={'目录分类'}
          />
          <Card bordered={false} className={styles.flexTable}>
            <div className={styles.tableList}>
              <Form onSubmit={this.handleSearch}>
                {/*<div className={styles.tableListForm}>{this.renderForm()}</div>*/}
                <Row>
                  <Col offset={8} md={14} sm={24}>
                    <FormItem {...formItemLayout} label="信息资源名称">
                      {getFieldDecorator('name')(<Input placeholder="请输入信息资源名称"/>)}
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
        <ChoiceList {...parentMethodsChoice} modalVisible={modalVisibleChoice}> </ChoiceList>
        <ResourceDetail {...parentMethodsResource} modalVisible={modalVisibleResource}/>
        <CatlogDetail {...parentMethodsCatlog} modalVisible={modalVisibleCatlog}/>
        <CreateForm {...parentMethods}/>
      </PageHeaderLayout>
    );
  }
}
