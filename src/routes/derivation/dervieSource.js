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
  Cascader,
  Radio,
  List,
} from 'antd';
import DescriptionList from 'components/DescriptionList';
import StandardTable from 'components/StandardTable';
import StandardTableNoCheck from 'components/StandardTableNoCheck';
import StandardTableNothing from 'components/StandardTableNothing';
import StandardTableNoPage from 'components/StandardTableNoPage';
import StandardTableRadio from 'components/StandardTableRadio';
import StandardTableEdit from 'components/StandardTableEdit';
import SimpleTableEdit from 'components/SimpleTableEdit';
import SimpleTree from 'components/SimpleTree';
import StandardTableRadioNopage from 'components/StandardTableRadioNopage';
import AnycSimpleTree from 'components/AnycSimpleTree';
import SimpleSelectTree from 'components/SimpleSelectTree';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';


import styles from './dervieSource.less';
import { Tabs } from 'antd/lib/index';

const confirm = Modal.confirm;
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
let listItemData = {};
let treeSelect = {};
let selectValue = [];
let modalListData = {};//弹窗第一页选择
let choiseListItemData = {};//弹窗中弹窗选择

const ChoiceList = Form.create()(props => {
  const { modalVisible, handleAdd, handleModalVisible, loading, data, columns, handleChoiceFeild, choiceFeild } = props;
  const okHandle = () => {
    handleChoiceFeild(selectedRows);
    handleModalVisible();
  };
  let selectedRows = [];
  let columnsNoPage = [
    {
      title: '序号',
      dataIndex: 'id',
    },
    {
      title: '字段',
      dataIndex: 'name',
    },
    {
      title: '备注',
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
      <Row gutter={24}>
        <Col span={24}>
          <span>已选字段：{selectedRows.map(item => {
            return item.name;
          }).join(',')}</span>
        </Col>
      </Row>
      <StandardTableNoPage
        selectedRows={selectedRows}
        data={data}
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
    modalVisible, form, handleAdd, handleModalVisible, data, handleItem, item, catalogItem, dataList, handleItemSearch,
    searchHandle, getListBuyId, choiseFeild, choiseList, type, handleType, choiceFeild, choiceFeildCount, catalogItemChange,
    selectHttpItem, httpItem, lifelist,
  } = props;
  const { getFieldDecorator } = form;
  const options = [
    {
      value: '关系型数据库',
      label: '关系型数据库',
      children: [{
        value: 'mysql', label: 'mysql',
      }, {
        value: 'Oracle', label: 'oracle',
      }, {
        value: 'sqlserver', label: 'sqlserver',
      }, {
        value: 'db2', label: 'db2',
      }],
    }, {
      value: '非关系型数据库',
      label: '非关系型数据库',
      children: [{
        value: 'mongo', label: 'mongo',
      }, {
        value: 'hbase', label: 'hbase',
      }],
    }, {
      value: 'API',
      label: 'API',
      children: [{
        value: 'http', label: 'http',
      }, {
        value: 'https', label: 'https',
      }, {
        value: 'wsdl', label: 'wsdl',
      }, {
        value: 'rest', label: 'rest',
      }],
    }, {
      value: '普通文件',
      label: '普通文件',
      children: [{
        value: 'ftp', label: 'ftp',
      }, {
        value: 'sftp', label: 'sftp',
      }, {
        value: '本地磁盘', label: '本地磁盘',
      }, {
        value: '共享文件夹', label: '共享文件夹',
      }],
    }];
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
      title: '数据源描述',
      dataIndex: 'content',
    },
    {
      title: '最近连接时间',
      dataIndex: 'createTime',
      render: val => <span>{val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '-'}</span>,
    },
    {
      title: '连接状态',
      dataIndex: 'linkStatus',
      render(val) {
        return <Badge status={val ? 'success' : 'error'} text={val || '未连通'}/>;
      },
    },
  ];
  const columnsdataList = [
    // {
    //   title: '序号',
    //   dataIndex: 'no',
    // },
    {
      title: '表名',
      dataIndex: 'name',
    },
    {
      title: '字段数',
      dataIndex: 'fieldNum',
    },
    {
      title: '表描述',
      dataIndex: 'description',
    },
    {
      title: '已选字段',
      dataIndex: 'selectedFieldNum',
    },
    {
      title: '选择字段',
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
    // {
    //   title: '序号',
    //   dataIndex: 'no',
    // },
    {
      title: '信息项',
      dataIndex: 'name',
    },
    {
      title: '信息项描述',
      dataIndex: 'description',
    },
    {
      title: '信息项类型',
      dataIndex: 'type',
    },
    {
      title: '信息项长度',
      dataIndex: 'len',
    },
  ];
  const fgxxsjkcolumns = [{
    title: '文件名称',
    dataIndex: 'name',
  }, {
    title: '文件类型',
    dataIndex: 'type',
  }];
  const filecolumns = [{
    title: '序号',
    dataIndex: 'id',
  }, {
    title: '集合',
    dataIndex: 'name',
  }];
  const columnscatalogfeild = [{
    title: '信息源',
    dataIndex: 'name',
  }, {
    title: '信息源描述',
    dataIndex: 'description',
  }, {
    title: '信息源类型',
    dataIndex: 'type',
  }, {
    title: '信息源长度',
    dataIndex: 'len',
  }, {
    title: '字段名',
    dataIndex: 'feild_name',
    render: (text, record, index) => {
      return <Select placeholder={'请选择'} style={{ width: 120 }} onSelect={(select, current) => {
        save(text, record, index, select, current);
      }}>
        {choiceFeild.map(item => {
          return (
            <Option title={item.name} value={item.id}>{item.name}</Option>
          );
        })}
      </Select>;
    },
  }, {
    title: '字段描述',
    dataIndex: 'feild_description',
  }, {
    title: '字段类型',
    dataIndex: 'feild_type',
  }, {
    title: '字段长度',
    dataIndex: 'feild_len',
  },
  ];
  let selectedRows = [];
  let choiceSelectedRows = [];
  let choiceFeildSelectedRows = [];
  let addTableSelectedRows = [];
  let addFeilsSelectedRows = [];
  let addTableRows = [];
  let setTableRows = [];
  let search = {};//搜索内容
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
      handleAdd(catalogItem, setTableRows);
    } else if (item == 3) {
      handleAdd(fgxxsjkHandleSelectRows);
    } else if (item == 4) {
      handleAdd(fileTableSelectedRows);
    } else if (item == 5) {
      handleAdd();
    }
  };
  const save = (text, record, index, select, current) => {
    let params = choiceFeild.filter(item => {
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
    handleItem(1);
    handleModalVisible(false);
  };
  const firstFooter = (<Row>
    <Col md={24} sm={24}>
      <Button type="primary" onClick={() => {
        if (!choiceSelectedRows || choiceSelectedRows.length == 0) {
          return;
        }
        if (choiceSelectedRows[0].sourceType === 'mysql' || choiceSelectedRows[0].sourceType === 'oracle' || choiceSelectedRows[0].sourceType === 'sqlserver'
          || choiceSelectedRows[0].sourceType === 'db2') {
          getListBuyId(choiceSelectedRows[0], 2);
        } else if (choiceSelectedRows[0].sourceType === 'mongo' || choiceSelectedRows[0].sourceType === 'mongo' || choiceSelectedRows[0].sourceType === 'hbase') {
          getListBuyId(choiceSelectedRows[0], 3);
        } else if (choiceSelectedRows[0].sourceType === 'http' || choiceSelectedRows[0].sourceType === 'https' || choiceSelectedRows[0].sourceType === 'wsdl'
          || choiceSelectedRows[0].sourceType === 'rest') {
          getListBuyId(choiceSelectedRows[0], 5);
        } else if (choiceSelectedRows[0].sourceType === 'ftp' || choiceSelectedRows[0].sourceType === 'sftp' || choiceSelectedRows[0].sourceType === '本地磁盘'
          || choiceSelectedRows[0].sourceType === '共享文件夹') {
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
    search.sourceType = index[0] + '/' + index[1];
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
    choiceSelectedRows = data;
  };

  const handleStandardTableChange = () => {

  };
  const handleSubmit = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleItemSearch({ ...search, ...fieldsValue });
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
      footer={item === 1 ? firstFooter : secondFooter}
      onOk={handleItem}
      onCancel={cancel}
    >
      {item === 1 ? <div><Form onSubmit={handleSubmit}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem {...formItemLayout} label="资源分类">
              <SimpleSelectTree transMsg={(index) => {
                search.resourceId = index;
              }}></SimpleSelectTree>
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem {...formItemLayout} label="数据源类型"><Cascader style={{ width:100 + '%' }} options={options}
                                                                  onChange={onChange}
                                                                  placeholder="请选择数据源/数据库"/>
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem>
              {getFieldDecorator('sourceName')(<Input placeholder="请输入数据源名称"/>)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </span>
          </Col>
        </Row><Row gutter={{ md: 8, lg: 24, xl: 48 }}>

      </Row></Form>
        <StandardTableRadio
        selectedRows={choiceSelectedRows}
        data={data}
        columns={columns}
        onSelectRow={handleSelectRows}
        onChange={handleStandardTableChange}
        /></div>: item === 2 ? <div>
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
            <FormItem>
              信息资源所含信息项一览：
            </FormItem>
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
        <Row>
          <Col md={12} sm={24}>
            <FormItem {...formItemLayout} label="请选择表/视图">
              <RadioGroup onChange={this.onChange}>
                <Radio value='table'>表</Radio>
                <Radio value='view'>视图</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <StandardTableNothing
            data={dataList}
            scroll={{ y: 180 }}
            columns={columnsdataList}
          />
        </Row>
        <Row>
          <Col>
            <span>
              已选字段：<span>{choiceFeild.map(item => {
              return item.name;
            }).join(',')}</span>
            </span>
          </Col>
        </Row>
        <Row>
          <Col>
            <span>
              已选择<span>{choiceFeildCount}</span>张表，共<span>{choiceFeild.length}</span>个字段，需设置至少<span>{choiceFeildCount - 1}</span>个表间关系
            </span>
          </Col>
        </Row>
        <Row>
          <Col>
            <span>
              设置表间关系：
            </span>
          </Col>
        </Row>
        <Row>
          <StandardTableEdit
            selectedRows={addTableSelectedRows}
            data={addTableRows}
            selectItemTable={dataList}
            selectItemFeild={choiceFeild}
            transMsg={getSelectRows}
            scroll={{ y: 180 }}
          />
        </Row>
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
            scroll={{ y: 180 }}
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
          <Description term="服务名称">{httpItem.sourceName}</Description>
          <Description term="所属数据源">{httpItem.sourceName}</Description>
          <Description term="接口类型">{httpItem.interfaceType}</Description>
          <Description term="数据格式">{httpItem.content}</Description>
          <Description term="服务类型">{httpItem.interfaceName}</Description>
          <Description term="服务地址">{httpItem.interfaceUrl}</Description>
        </DescriptionList>
      </div>}
    </Modal>
  );
});
const ResourceDetail = Form.create()(props => {
  const {
    modalVisible, form, handleModalVisible, loading, data, columns, detailType, tableAndField,
    radioSwitch, radioSwitcHandle, operateLog, lifelist, httpItem,searchHandle,sqlList,excSql
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
  const gxxsjkdatacolumns = [
    {
      title: '序号',
      render: (text, record, index) => <span>{index+1}</span>
    },
    {
      title: '姓名',
      dataIndex: 'sourceName',
    },
    {
      title: '性别',
      dataIndex: 'sourceType',
    },
    {
      title: '年龄',
      dataIndex: 'content',
    }, {
      title: '身份证号码',
      dataIndex: 'content',
    }, {
      title: '地址',
      dataIndex: 'content',
    }];
  const gxxsjkfieldcolumns = [
    {
      title: '字段名',
      dataIndex: 'name',
    }, {
      title: '字段描述',
      dataIndex: 'tableDesc',
    }, {
      title: '类型',
      dataIndex: 'type',
    }, {
      title: '长度',
      dataIndex: 'len',
    }];
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
  const filelogcolumns = [
    {
      title: '文件名称',
      dataIndex: 'content',
    }, {
      title: '服务调用用户',
      dataIndex: 'content',
    }, {
      title: '最近一次数据调用开始时间',
      dataIndex: 'content',
    }, {
      title: '最近一次数据调用结束时间',
      dataIndex: 'content',
    }, {
      title: '累积调用次数',
      dataIndex: 'content',
    }, {
      title: '调用方式',
      dataIndex: 'content',
    }];
  const fgxxsjkdatacolumns = [
    {
      title: 'Key',
      dataIndex: 'content',
    }, {
      title: 'Value',
      dataIndex: 'content',
    }, {
      title: 'Type',
      dataIndex: 'content',
    },
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
      {detailType == 1 ? <div><Tabs defaultActiveKey="2">
        <TabPane tab="数据详情" key="1">
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
                search={()=>{
                  searchHandle(indexList,indexAndOr)}
                }
                data={[]}
                selectItemFeild={[].concat.apply([],tableAndField.map(item=>{return  item.tableFieldList}))}
                transMsg={(index,andOr)=>{
                  indexList = index;
                  indexAndOr = andOr;
                }}
              />
              <DescriptionList size="large" col={1} title="描述" style={{ marginBottom: 32 }}>
                <Description ></Description>
              </DescriptionList>
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
          <StandardTableNothing
            loading={loading}
            data={sqlList}
            columns={gxxsjkdatacolumns}
          />
        </TabPane>
        <TabPane tab="表结构" key="2">
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
          <DescriptionList size="large" col={2} title="" style={{ marginBottom: 32 }}>
            <Description term="集合名称">{httpItem.sourceName}</Description>
            <Description term="所属数据源">{httpItem.sourceName}</Description>
          </DescriptionList>
          {/*<StandardTableNoCheck*/}
          {/*loading={loading}*/}
          {/*data={data}*/}
          {/*columns={fgxxsjkdatacolumns}*/}
          {/*/>*/}
        </div> : detailType == 3 ?
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
          </div> :
          <div>
            <DescriptionList size="large" title="文件信息" style={{ marginBottom: 32 }}>
              <List
                rowKey="id"
                grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
                dataSource={lifelist}
                renderItem={item =>
                  <List.Item key={item.id}>
                    <Card hoverable className={styles.card}>
                      <Card.Meta
                        description={
                          <DescriptionList size="large"  col={1} title="" style={{ marginBottom: 12 }}>
                            {/*<div>文件名称:<span>{item.sourceName}</span></div>*/}
                            {/*<div>文件类型:<span>{item.sourceName}</span></div>*/}
                            {/*<div>文件类型:<span>{item.interfaceType}</span></div>*/}
                            <Description term="文件名称">{item.sourceName}</Description>
                            <Description term="文件类型">{item.sourceName}</Description>
                            <Description term="文件描述">{item.interfaceType}</Description>
                          </DescriptionList>
                        }
                      />
                    </Card>
                  </List.Item>
                }
              />
            </DescriptionList>
            <DescriptionList size="large" title="接口调用记录" style={{ marginBottom: 32 }}>
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

@connect(({ dervieSource,catalog, centersource, dervieClassify, loading }) => ({
  dervieSource,
  centersource,
  dervieClassify,
  catalog,
  loading: loading.models.dervieSource,
}))
@Form.create()
export default class ResourceClassify extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    listItemData: {},
    item: 1,
    modalVisibleChoice: false,
    modalVisibleCatlog: false,
    modalVisibleResource: false,
    type: 1,
    detailType: 1,
    choiceFeild: [],
    choiceFeildCount: 0,
    radioSwitch: 'view',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dervieSource/fetch',
    });
    dispatch({
      type: 'dervieClassify/tree',
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
      type: 'dervieSource/fetch',
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
      type: 'dervieSource/fetch',
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
          type: 'dervieSource/remove',
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
        type: 'dervieSource/fetch',
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
    this.setState({
      modalVisibleResource: !!flag,
    });
  };
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
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
    } else if (listItemData.sourceType === 'mongo' || listItemData.sourceType === 'mongo' || listItemData.sourceType === 'hbase') {
      dispatch({
        type: 'catalog/catalogTableAndTableField',
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
    } else if (listItemData.sourceType === 'ftp' || listItemData.sourceType === 'sftp' || listItemData.sourceType === '本地磁盘'
      || listItemData.sourceType === '共享文件夹') {
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
    const { dispatch } = this.props;
    const { choiceFeild } = this.state;
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
      let fieldIds = choiceFeild.map(item => {
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
            type: 'dervieSource/fetch',
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
        type: 'dervieSource/collection',
        payload: params,
        callback: () => {
          message.success('添加成功');
          this.setState({
            modalVisible: false,
          });
          dispatch({
            type: 'dervieSource/fetch',
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
        type: 'dervieSource/file',
        payload: params,
        callback: () => {
          message.success('添加成功');
          this.setState({
            modalVisible: false,
          });
          dispatch({
            type: 'dervieSource/fetch',
            payload: params,
          });
        },
      });
    } else if (this.state.item == 5) {
      let params = {};
      params[listItemData.id] = modalListData.id;
      dispatch({
        type: 'dervieSource/api',
        payload: params,
        callback: () => {
          message.success('添加成功');
          this.setState({
            modalVisible: false,
          });
          dispatch({
            type: 'dervieSource/fetch',
            payload: params,
          });
        },
      });
    }
  };
  handleItem = (index) => {
    this.setState({
      item: index,
    });
  };
  handleType = (index) => {
    this.setState({
      type: index,
    });
  };
  choiseFeild = (data) => {
    const { dispatch } = this.props;
    this.handleModalVisibleChoice(true);
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
        type: 'centersource/fetchTable',
        payload: { id: data.id },
      });
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
  handleDelete = () => {
    const { dispatch } = this.props;
    if (this.state.selectedRows.length > 0) {
      this.state.selectedRows.forEach((item, index) => {
        if (index === this.state.selectedRows.length - 1) {
          dispatch({
            type: 'dervieSource/remove',
            payload: {
              id: item.id,
            }, callback: () => {
              dispatch({
                type: 'dervieSource/fetch',
              });
            },
          });
          message.success('删除成功');

        } else {
          dispatch({
            type: 'dervieSource/remove',
            payload: {
              id: item.id,
            },
          });
        }
      });
    }
  };
  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dervieSource/add',
      payload: {
        description: fields.desc,
      },
    });

    message.success('添加成功');
    this.setState({
      modalVisible: false,
    });
  };

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  handleTree = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dervieSource/fetch',
      payload: data,
    });
  };
  addHandle = data => {
    this.handleModalVisible(true);
    this.searchHandle(data);
  };
  getListBuyId = (data, index) => {
    this.handleItem(index);
    const { dispatch} = this.props;
    dispatch({
      type: 'centersource/fetch',
      payload: data,
    });
  };
  handleChoiceFeild = (list) => {
    const { choiceFeild, choiceFeildCount } = this.state;
    this.setState({
      choiceFeildCount: choiceFeildCount + 1,
    });
    this.setState({
      choiceFeild: [...new Set(choiceFeild.concat(list))],
    });
  };
  catalogItemChange = (index) => {
    const { dispatch, catalog: { catalogItem } } = this.props;
    let list = catalogItem.map(item => {
      if (item.id = index.id) ;
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
  excSql = (index) =>{
    const { dispatch } = this.props;
    let params = {
      "params": index.sql,
      "dataSourceId": listItemData.dataSourceId,
    };
    dispatch({
      type: 'centersource/fetchTableData',
      payload: params,
    });
  };
  searchHandle = (list,value)=>{
    const { dispatch } = this.props;
    let param = list.map(item=>{
      return {
        "fieldName": item.field,
        "operation": item.condition,
        "value": item.value,
        'tableId':item.tableId,
        "valueType": item.valueType
      }
    });
    let params = {
      "accordWith": value,
      "catalogId": listItemData.id,
      "params":param
    };
    debugger
    dispatch({
      type: 'centersource/fetchView',
      payload: params,
    });
  }
  searchHandle = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'centersource/fetch',
      payload: data,
    });
  };

  render() {
    const {
      dervieSource: { data },
      dervieClassify: { treeData },
      catalog: {  catalogItem, field, tableAndField, operateLog },
      centersource: {sqlList, data: formData, dataList, lifelist: { list: lifelist }, httpItem },
      form,
      loading,
    } = this.props;
    const { selectedRows, modalVisible, modalVisibleCatlog, radioSwitch, modalVisibleResource, modalVisibleChoice, item, type, choiceFeild, choiceFeildCount, detailType } = this.state;
    const parentMethods = {
      httpItem: httpItem,
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
      modalVisible: modalVisible,
      type: type,
      handleType: this.handleType,
      choiceFeild: choiceFeild,
      choiceFeildCount: choiceFeildCount,
    };
    const parentMethodsChoice = {
      data: field,
      choiceFeild: choiceFeild,
      handleChoiceFeild: this.handleChoiceFeild,
      handleAdd: this.handleAddChoice,
      handleModalVisible: this.handleModalVisibleChoice,
    };
    const parentMethodsResource = {
      handleAdd: this.handleAddResource,
      radioSwitcHandle: this.radioSwitcHandle,
      operateLog: operateLog,
      sqlList:sqlList,
      excSql:this.excSql,
      lifelist: lifelist,
      httpItem: httpItem,
      searchHandle:this.searchHandle,
      radioSwitch: radioSwitch,
      tableAndField: tableAndField,
      detailType: detailType,
      handleModalVisible: this.handleModalVisibleResource,
    };
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
      },
      {
        title: '数据名称',
        dataIndex: 'name',
      },
      {
        title: '所属数据源',
        dataIndex: 'dataSourceName',
      },
      {
        title: '数据源类型',
        dataIndex: 'dataSourceType',
      },
      {
        title: '数据来源',
        dataIndex: 'dataSourceId',
      },
      {
        title: '操作',
        render: (text, record, index) => {
          return (
            <Fragment>
              <a onClick={() => {
                this.handleModalResource(text, true);
              }}>查看</a>
            </Fragment>
          );
        },
      },
    ];
    const { getFieldDecorator } = form;
    return (
      <PageHeaderLayout>
        <div className={styles.flexMain}>
          <SimpleTree
            data={treeData}
            handleTree={this.handleTree}
            title={'衍生资源库'}
          />
          <Card bordered={false} className={styles.flexTable}>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Row>
                  <Col md={12} sm={12}>
                    <Button icon="plus" type="primary" onClick={() => this.addHandle(true)}>
                      新增
                    </Button>
                    <Button icon="delete" onClick={() => this.handleDelete(true)}>
                      批量删除
                    </Button>
                  </Col>
                  <Col md={8} sm={8}>
                    <FormItem>
                      {getFieldDecorator('name')(<Input placeholder="请输入数据源名称"/>)}
                    </FormItem>
                  </Col>
                  <Col md={4} sm={4}>
                    <FormItem>
                      <Button type="primary" htmlType="submit">
                        查询
                      </Button>
                    </FormItem>
                  </Col>
                </Row>
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
        <ChoiceList {...parentMethodsChoice} modalVisible={modalVisibleChoice}> </ChoiceList>
        <ResourceDetail {...parentMethodsResource} modalVisible={modalVisibleResource}/>
        <CreateForm {...parentMethods}/>
        {/*<StepNoTitle {...parentMethods} data={data} modalVisible={modalVisible}/>*/}
      </PageHeaderLayout>
    );
  }
}
