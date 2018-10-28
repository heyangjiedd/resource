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
import StandardTableNothingNoCloums from 'components/StandardTableNothingNoCloums';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';


import styles from './dervieSource.less';
import { Tabs } from 'antd/lib/index';
import ARR from '../../assets/arr';

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
let treeSelect = '';
let selectValue = [];
let modalListData = {};//弹窗第一页选择
let choiseListItemData = {};//弹窗中弹窗选择
let choiceSelectedRowsDefault = [];
let searchValue = {
  sourceName: '',
  resourceId: undefined,
  cascader: [],
  relationDb: '',
  unrelationDb: '',
  api: '',
  files: '',
}; //查询

const ChoiceList = Form.create()(props => {
  const {
    modalVisible, handleAdd, handleModalVisible, loadinhandleItemSearchg, data, columns, handleChoiceFeild, choiceFeild,
    choicedataList, choicedataListItems, setChoicedaraListItem,
  } = props;
  const okHandle = () => {
    setChoicedaraListItem(selectedRows);
    // handleChoiceFeild(selectedRows);
    handleModalVisible();
  };
  let selectedRows = [];
  let columnsNoPage = [
    {
      title: '序号',
      width: '150px',
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: '字段',
      width: '150px',
      dataIndex: 'name',
    },
    {
      title: '备注',
      width: '150px',
      dataIndex: 'tableDesc',
    },

  ];
  const handleSelectRows = (data) => {
    selectedRows = data;
  };
  const handleStandardTableChange = () => {
  };
  let defualtValue = choicedataList.filter(item=>{
    return item.id == choiseListItemData.id
  });
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
          <span>已选字段：{choicedataListItems.map(item=>{
            return item.name
          }).join('，')}</span>
        </Col>
      </Row>
      <StandardTableNoPage
        selectedRows={selectedRows}
        data={data}
        scroll={{ y: 240 }}
        columns={columnsNoPage}
        defaultSelectRows={choicedataListItems}
        onSelectRow={handleSelectRows}
        onChange={handleStandardTableChange}
      />
    </Modal>
  );
});
const CreateForm = Form.create()(props => {
  const {
    modalVisible, form, handleAdd, handleModalVisible, data, handleItem, item, catalogItem, dataList, handleItemSearch,
    searchHandle, getListBuyId, choiseFeild, choiseList, type, handleType, choiceFeild, choicelist, catalogItemChange,
    selectHttpItem, httpItem, lifelist, handleStandardTableChange, handleStandardTableChangeFile, selectChange, selectItem,
    tableSelectedRows, tableSelectedRowsHandle, onChangeRadioGroup,choicedataList,
  } = props;
  const { getFieldDecorator } = form;
  const columns = [
    {
      title: '数据源名称',
      width: '150px',
      dataIndex: 'sourceName',
    },
    {
      title: '数据源类型',
      width: '150px',
      dataIndex: 'sourceType',
      render(val) {
        let text = '关系型数据库/MySql';
        if (val === 'mysql') {
          text = '关系型数据库/MySql';
        } else if (val === 'oracle') {
          text = '关系型数据库/Oracle';
        } else if (val === 'sqlserver') {
          text = '关系型数据库/SqlServer';
        } else if (val === 'mongo') {
          text = '非关系型数据库/MongoDB';
        } else if (val === 'hbase') {
          text = '非关系型数据库/HBase';
        } else if (val === 'local') {
          text = '本地文件/Local';
        } else if (val === 'ftp') {
          text = '文件系统/FTP';
        } else if (val === 'sftp') {
          text = '普通文件系统/SFTP';
        } else if (val === 'share') {
          text = '共享文件系统/Share';
        } else if (val === 'rest') {
          text = 'API/REST';
        } else if (val === 'https') {
          text = 'API/HTTPS';
        } else if (val === 'http') {
          text = 'API/HTTP';
        } else if (val === 'wsdl') {
          text = 'API/WSDL';
        }

        return text;
      },
    },
    {
      title: '数据源描述',
      width: '150px',
      dataIndex: 'content',
    },
    {
      title: '最近连接时间',
      width: '150px',
      dataIndex: 'createTime',
      render: val => <span>{val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '-'}</span>,
    },
    {
      title: '连接状态',
      width: '150px',
      dataIndex: 'linkStatus',
      render(val) {
        return <Badge status={val == 'on' ? 'success' : 'error'} text={val == 'on' ? '连通' : '未连通'}/>;
      },
    },
  ];
  const columnsdataList = [
    {
      title: '序号',
      width: '150px',
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: '表名',
      width: '150px',
      dataIndex: 'name',
    },
    {
      title: '字段数',
      width: '150px',
      dataIndex: 'fieldNum',
    },
    {
      title: '表描述',
      width: '150px',
      dataIndex: 'description',
    },
    {
      title: '已选字段',
      width: '150px',
      dataIndex: 'selectArray',
      render: (text, record, index) => {
        return (
          <span>{text.length}</span>
        );
      },
    },
    {
      title: '选择字段',
      width: '150px',
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
      width: '150px',
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: '表名',
      width: '150px',
      dataIndex: 'tableName',
    },
    {
      title: '表类型',
      width: '150px',
      dataIndex: 'tableType',
    },
    {
      title: '信息项类型',
      width: '150px',
      dataIndex: 'type',
    },
    {
      title: '字段名',
      width: '150px',
      dataIndex: 'name',
    },
    {
      title: '字段长度',
      width: '150px',
      dataIndex: 'len',
    },
    {
      title: '字段类型',
      width: '150px',
      dataIndex: 'type',
    },
    {
      title: '字段描述',
      width: '150px',
      dataIndex: 'description',
    },
  ];
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
  const filecolumns = [
    {
      title: '文件名称',
      width: '150px',
      dataIndex: 'name',
    }, {
      title: '文件类型',
      width: '150px',
      dataIndex: 'type',
    }];
  const tableColumnsNoPage = [
    {
      title: '序号',
      width: '150px',
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: '表名',
      width: '150px',
      dataIndex: 'name',
    },
    {
      title: '表描述',
      width: '150px',
      dataIndex: 'description',
    },
  ];
  let choiceSelectedRows = [];
  let choiceFeildSelectedRows = [];
  let addTableSelectedRows = [];
  let addTableRows = [];
  let setTableRows = [];
  let fgxxsjkHandleSelectRows = [];
  let fileTableSelectedRows = [];
  let tableLength = choicedataList.filter(item=>{return item.selectArray.length>0}).length;
  let feildLength = choicedataList.reduce((total,item)=>{
    return item.selectArray.length+total
  },0)
  let felds = choicedataList.reduce((total,item)=>{
    return total.concat(item.selectArray);
  },[])
  const getSelectRows = (data) => {
    setTableRows = data;
  };
  const submitHandle = () => {
    form.validateFields((err, fieldsValues) => {
      // return;
      if (err) return;
      searchValue = {
        sourceName: '',
        resourceId: undefined,
        cascader: [],
        relationDb: '',
        unrelationDb: '',
        api: '',
        files: '',
      };
      if (item == 2) {
        if (selectItem == 1) {
          if (tableLength >= 2 && setTableRows.length == 0) {
            message.error('请先设置表间关系');
            return;
          }
          if (tableLength == 0) {
            message.error('请先选择字段');
            return;
          }
          handleAdd(catalogItem, setTableRows, fieldsValues);
        } else {
          handleAdd(tableSelectedRows, null, fieldsValues);
        }
      } else if (item == 3) {
        if (fgxxsjkHandleSelectRows.length <= 0) {
          message.error('请先勾选数据');
          return;
        }
        handleAdd(fgxxsjkHandleSelectRows, null, fieldsValues);
      } else if (item == 4) {
        if (fileTableSelectedRows.length <= 0) {
          message.error('请先勾选数据');
          return;
        }
        handleAdd(fileTableSelectedRows, null, fieldsValues);
      } else if (item == 5) {
        handleAdd(null, null, fieldsValues);
      }
    });
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
    form.resetFields();
    choiceSelectedRowsDefault = [];
    searchValue = {
      sourceName: '',
      resourceId: undefined,
      cascader: [],
      relationDb: '',
      unrelationDb: '',
      api: '',
      files: '',
    };
  };
  const firstFooter = (<Row>
    <Col md={24} sm={24}>
      <Button type="primary" onClick={() => {
        form.validateFields((err, fieldsValue) => {
          searchValue.sourceName = fieldsValue.sourceName;
          choiceSelectedRows = choiceSelectedRowsDefault;
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
        });
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
        tableSelectedRowsHandle([]);
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
    searchValue.cascader = index;
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
    choiceSelectedRowsDefault = data;
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
      sm: { span: 16 },
      md: { span: 18 },
    },
  };
  return (<Modal
      title="新增"
      visible={modalVisible}
      width={900}
      destroyOnClose={true}
      footer={item === 1 ? firstFooter : secondFooter}
      onOk={handleItem}
      onCancel={cancel}
    >
      {item === 1 ? <div><Form onSubmit={handleSubmit}>
        <Row gutter={{ md: 4, lg: 12, xl: 24 }}>
          <Col md={12} sm={12}>
            <FormItem {...formItemLayout} label="资源分类">
              <SimpleSelectTree url={'classify/tree'} transMsg={(index) => {
                searchValue.resourceId = index;
              }} defaultValue={searchValue.resourceId}></SimpleSelectTree>
            </FormItem>
          </Col>
          <Col md={12} sm={12}>
            <FormItem {...formItemLayout} label="数据源类型"><Cascader style={{ width: 100 + '%' }} options={ARR.CASCADER}
                                                                  onChange={onChange}
                                                                  defaultValue={searchValue.cascader}
                                                                  placeholder="请选择数据源/数据库"/>
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 4, lg: 12, xl: 24 }}>
          <Col md={12} sm={12}>
            <FormItem {...formItemLayout} label="数据源名称">
              {getFieldDecorator('sourceName', {
                initialValue: searchValue.sourceName,
              })(<Input placeholder="请输入数据源名称"/>)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" onClick={handleSubmit}>
                查询
              </Button>
            </span>
          </Col>
        </Row><Row gutter={{ md: 8, lg: 24, xl: 48 }}>

      </Row></Form>
        <StandardTableRadio
          selectedRows={choiceSelectedRows}
          defaultSelectRows={choiceSelectedRowsDefault}
          data={data}
          columns={columns}
          onSelectRow={handleSelectRows}
          onChange={handleStandardTableChange}
        /></div> : item === 2 ? <div>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem style={{ marginBottom: 0 }} {...formItemLayout} label="新增类型">
              {getFieldDecorator('status', {
                rules: [{ required: true, message: '请输入新增类型.' }],
                initialValue: 1,
              })(
                <Select placeholder="选择新增类型" onSelect={selectChange} style={{ width: '100%' }}>
                  <Option value={1}>新增</Option>
                  <Option value={2}>批量新增</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col md={12} sm={24}>
            <FormItem style={{ marginBottom: 0 }}  {...formItemLayout} label="请选择表/视图">
              <RadioGroup onChange={onChangeRadioGroup} defaultValue={'TABLE'}>
                <Radio value='TABLE' defaultChecked={true}>表</Radio>
                <Radio value='VIEW'>视图</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        {selectItem == 1 ? <div>
            <Row>
              <StandardTableNothing
                data={choicedataList}
                scroll={{ y: 180 }}
                columns={columnsdataList}
              />
            </Row>
            <Row>
              <Col>
            <span>
              已选字段：<span>{felds.map(item => {
              return item.name;
            }).join(',')}</span>
            </span>
              </Col>
            </Row>
            <Row>
              <Col>
            <span>
              已选择<span>{tableLength}</span>张表，共<span>{feildLength}</span>个字段，需设置至少<span>{(tableLength|| 1) - 1}</span>个表间关系
            </span>
              </Col>
            </Row>
            {tableLength > 1 ? <div><Row>
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
                  // selectItemTable={choicelist}
                  // selectItemFeild={choiceFeild}
                  allData={choicedataList}
                  transMsg={getSelectRows}
                  scroll={{ y: 180 }}
                />
              </Row></div> : ''}

            <Row>
              <Col>
            <span>
              信息资源所含信息项一览：
            </span>
              </Col>
            </Row>
            {
              catalogItem.length > 1 ? <Row>
                <Col md={12} sm={24}>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label="数据名称">
                    {getFieldDecorator('name', {
                      rules: [{ required: true, message: '请输入数据名称.' }],
                    })(<Input placeholder="请输入数据名称"/>)}
                  </FormItem>
                </Col>
              </Row> : <Row>
                <Col md={12} sm={24}>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label="数据名称">
                    {getFieldDecorator('name', {
                      rules: [{ required: true, message: '请输入数据名称.' }],
                      initialValue: choiceFeild[0] && choiceFeild[0].tableName,
                    })(<Input placeholder="请输入数据名称"/>)}
                  </FormItem>
                </Col>
              </Row>
            }
            <Row>
              <StandardTableNothing
                data={choiceFeild}
                scroll={{ y: 180 }}
                columns={columnscatalogItem}
              />
            </Row>
            <Row>
              <Col>
                <span>共{choiceFeild.length}个信息项</span>
              </Col>
            </Row>
          </div> :
          <div>
            <StandardTableNoPage
              selectedRows={tableSelectedRows}
              data={dataList}
              scroll={{ y: 240 }}
              columns={tableColumnsNoPage}
              onSelectRow={tableSelectedRowsHandle}
            />
            <Row>
              <Col>
                <span>已选择{tableSelectedRows.length}张表！</span>
              </Col>
            </Row>
          </div>
        }
      </div> : item === 3 ? <div>
        <Row>
          <Col span={12}>
            <FormItem {...formItemLayout} label="数据名称">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入数据名称.' }],
              })(<Input placeholder="请输入数据名称"/>)}
            </FormItem>
          </Col>
        </Row>
        <StandardTableRadioNopage
          selectedRows={fgxxsjkHandleSelectRows}
          data={dataList}
          columns={fgxxsjkcolumns}
          onSelectRow={fgxxsjkhandleSelectRows}
          scroll={{ y: 480 }}
        />
      </div> : item === 4 ? <div>
        <Row>
          <Col span={12}>
            <FormItem {...formItemLayout} label="数据名称">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入数据名称.' }],
              })(<Input placeholder="请输入数据名称"/>)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <StandardTable
            selectedRows={fileTableSelectedRows}
            data={lifelist}
            columns={filecolumns}
            onSelectRow={filehandleSelectRows}
            onChange={handleStandardTableChangeFile}
          />
        </Row>
      </div> : <div>
        <Row>
          <Col span={12}>
            <FormItem {...formItemLayout} label="数据名称">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入数据名称.' }],
              })(<Input placeholder="请输入数据名称"/>)}
            </FormItem>
          </Col>
        </Row>
        <DescriptionList size="large" title="详情" col={2} style={{ marginBottom: 20 }}>
          <Description term="服务名称">{httpItem.interfaceName}</Description>
          <Description term="所属数据源">{httpItem.sourceName}</Description>
          <Description term="接口类型">{httpItem.interfaceType}</Description>
          <Description term="数据格式">{httpItem.content}</Description>
        </DescriptionList>
        <DescriptionList size="large" col={1} style={{ marginBottom: 32 }}>
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
    radioSwitch, radioSwitcHandle, operateLog, lifelist, httpItem, searchHandle, sqlList, excSql,
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
      width: '150px',
      dataIndex: 'name',
    }, {
      title: '字段描述',
      width: '150px',
      dataIndex: 'tableDesc',
    }, {
      title: '类型',
      width: '150px',
      dataIndex: 'type',
    }, {
      title: '长度',
      width: '150px',
      dataIndex: 'len',
    }, {
      title: '所属表',
      width: '150px',
      dataIndex: 'tableName',
    }];
  const apifieldcolumns = [
    {
      title: '字段名称',
      width: '150px',
      dataIndex: 'content',
    }, {
      title: '字段别名',
      width: '150px',
      dataIndex: 'content',
    }, {
      title: '字段中文名',
      width: '150px',
      dataIndex: 'content',
    }, {
      title: '字段描述',
      width: '150px',
      dataIndex: 'content',
    }, {
      title: '来源数据表',
      width: '150px',
      dataIndex: 'content',
    }, {
      title: '来源数据库',
      width: '150px',
      dataIndex: 'content',
    }];
  const apilogcolumns = [
    {
      title: '序号',
      width: '150px',
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: '服务调用用户',
      width: '150px',
      dataIndex: 'content',
    }, {
      title: '最近一次接口调用开始时间',
      width: '200px',
      dataIndex: 'content',
    }, {
      title: '最近一次接口调用结束时间',
      width: '200px',
      dataIndex: 'content',
    }, {
      title: '累积调用次数',
      width: '150px',
      dataIndex: 'content',
    }, {
      title: '调用方式',
      width: '150px',
      dataIndex: 'content',
    },
  ];
  const filelogcolumns = [
    {
      title: '序号',
      width: '150px',
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: '文件名称',
      width: '150px',
      dataIndex: 'content',
    }, {
      title: '服务调用用户',
      width: '150px',
      dataIndex: 'content',
    }, {
      title: '最近一次数据调用开始时间',
      width: '150px',
      dataIndex: 'content',
    }, {
      title: '最近一次数据调用结束时间',
      width: '150px',
      dataIndex: 'content',
    }, {
      title: '累积调用次数',
      width: '150px',
      dataIndex: 'content',
    }, {
      title: '调用方式',
      width: '150px',
      dataIndex: 'content',
    }];
  const fgxxsjkdatacolumns = [
    {
      title: '集合名称',
      width: '150px',
      dataIndex: 'name',
    }, {
      title: '所属数据源',
      width: '150px',
      dataIndex: 'description',
    },
  ];
  const lifelistcolumns = [
    {
      title: '文件名称',
      width: '150px',
      dataIndex: 'name',
    }, {
      title: '文件类型',
      width: '150px',
      dataIndex: 'type',
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
      {detailType == 1 ? <div><Tabs defaultActiveKey="1">
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
                search={searchHandle}
                data={[]}
                selectItemFeild={tableAndField.tableFieldList || []}
                transMsg={(index, andOr) => {
                  console.log(index);
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
            loading={loading}
            data={sqlList}
            columns={gxxsjkdatacolumns}
          />
        </TabPane>
        <TabPane tab="表结构" key="2">
          <DescriptionList size="large" col={1} title="数据信息" style={{ marginBottom: 32 }}>
            <Description term="数据名称">{tableAndField.name}</Description>
            <Description term="数据源类型">{tableAndField.dataSourceType}</Description>
            {/*<Description term="表注释">{tableAndField.description}</Description>*/}
          </DescriptionList>
          <DescriptionList size="large" title="字段信息" style={{ marginBottom: 32 }}>
            <StandardTableNothing
              loading={loading}
              data={tableAndField.tableFieldList || []}
              columns={gxxsjkfieldcolumns}
            /></DescriptionList>
        </TabPane>
      </Tabs></div> : detailType == 2 ?
        <div>
          <DescriptionList size="large" col={2} title="" style={{ marginBottom: 32 }}>
            <Description term="信息资源名称">{tableAndField.name}</Description>
            <Description term="关联资源类型">{tableAndField.dataSourceType}</Description>
          </DescriptionList>
          <DescriptionList size="large" title="字段信息" style={{ marginBottom: 32 }}>
            <StandardTableNothing
              loading={loading}
              data={tableAndField.tableFieldList || []}
              columns={fgxxsjkdatacolumns}
            /></DescriptionList>
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
              <Description term="调用数量">{apilogcolumns.total || 0}</Description>
              <Description term="接口类型">原生接口</Description>
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
              <StandardTableNoCheck
                selectedRows={[]}
                onSelectRow={[]}
                loading={loading}
                data={lifelist}
                columns={lifelistcolumns}
              />

            </DescriptionList>
            <DescriptionList size="large" title="文件调用记录" style={{ marginBottom: 32 }}>
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

@connect(({ dervieSource, catalog, centersource, dervieClassify, loading }) => ({
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
    radioSwitch: 'view',
    selectItem: 1,
    tableSelectedRows: [],
    choicedataList: [],
    choicedataListItems:[],
  };

  componentWillUnmount() {
    itemDataStatus = 0;
    listItemData = {};
    treeSelect = '';
    selectValue = [];
    modalListData = {};//弹窗第一页选择
    choiseListItemData = {};//弹窗中弹窗选择
    searchValue = { resourceId: '', relationDb: '', unrelationDb: '', api: '', files: '' }; //查询
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dervieSource/fetch',
    });
    dispatch({
      type: 'dervieClassify/tree',
    });
  }

  tableSelectedRowsHandle = (data) => {
    this.setState({
      tableSelectedRows: data,
    });
  };
  handleSubmit = () => {
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'dervieSource/fetch',
        payload: fieldsValue,
      });
    });
  };
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
  handleStandardTableChangeFile = (pagination, filtersArg, sorter) => {
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
      id: modalListData.id,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'centersource/fetchFile',
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
  selectChange = (index) => {
    this.setState({ selectItem: index });
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
    this.setState({
      modalVisible: !!flag,
      choiceFeild: [],
      choicelist: [],
      item: 1,
      tableSelectedRowsHandle: [],
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
    if (!listItemData.dataSourceType) {
      return;
    }

    if (listItemData.dataSourceType === 'mysql' || listItemData.dataSourceType === 'oracle' || listItemData.dataSourceType === 'sqlserver'
      || listItemData.dataSourceType === 'db2') {
      dispatch({
        type: 'dervieSource/get',
        payload: { id: listItemData.id },
      });
      this.setState({
        detailType: 1,
      });
    } else if (listItemData.dataSourceType === 'mongo' || listItemData.dataSourceType === 'hbase') {
      dispatch({
        type: 'dervieSource/get',
        payload: { id: listItemData.id },
      });
      this.setState({
        detailType: 2,
      });
    } else if (listItemData.dataSourceType === 'http' || listItemData.dataSourceType === 'https' || listItemData.dataSourceType === 'wsdl'
      || listItemData.dataSourceType === 'rest') {
      dispatch({
        type: 'centersource/get',
        payload: { id: listItemData.dataSourceId },
      });
      dispatch({
        type: 'catalog/operateLog',
        payload: { type: 'api', id: listItemData.dataSourceId },
      });
      this.setState({
        detailType: 3,
      });
    } else if (listItemData.dataSourceType === 'ftp' || listItemData.dataSourceType === 'sftp' || listItemData.dataSourceType === 'local'
      || listItemData.dataSourceType === 'share') {
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
  handleAdd = (catalogItem, addTableRows, fieldsValues) => {
    const { dispatch } = this.props;
    choiceSelectedRowsDefault = [];
    const { choiceFeild } = this.state;
    dispatch({
      type: 'dervieSource/add',
      payload: {
        ...fieldsValues,
        'classify_id': treeSelect[0],
        'dataSourceId': modalListData.id,
        'dataSourceName': modalListData.sourceName,
        'dataSourceType': modalListData.sourceType,
      },
      callback: (resp) => {
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
          });
          let params = {
            ...fieldsValues,
            dataSourceId: modalListData.id,
            deriveId: resp,
            classifyId: resp,
            fieldIdList: fieldIds,
            tableRelationList: tableRelationList,
          };
          dispatch({
            type: 'dervieSource/field',
            payload: params,
            callback: () => {
              message.success('添加成功');
              this.handleModalVisible(false);
              dispatch({
                type: 'dervieSource/fetch',
              });
            },
          });
        } else if (this.state.item == 3) {
          let itemFieldList = catalogItem.map(item => {
            return item.id;
          });
          let params = {};
          params[resp] = itemFieldList;
          dispatch({
            type: 'dervieSource/collection',
            payload: params,
            callback: () => {
              message.success('添加成功');
              this.handleModalVisible(false);
              dispatch({
                type: 'dervieSource/fetch',
              });
            },
          });
        } else if (this.state.item == 4) {
          let itemFieldList = catalogItem.map(item => {
            return item.id;
          });
          // let params = {
          //   ...fieldsValues,
          //   deriveId: resp,
          //   classifyId: resp,
          // };
          let params = {};
          params[resp] = itemFieldList;
          dispatch({
            type: 'dervieSource/file',
            payload: params,
            callback: () => {
              message.success('添加成功');
              this.handleModalVisible(false);
              dispatch({
                type: 'dervieSource/fetch',
              });
            },
          });
        } else if (this.state.item == 5) {
          let params = {
            ...fieldsValues,
            deriveId: resp,
            classifyId: resp,
          };
          params[resp] = [modalListData.id];
          dispatch({
            type: 'dervieSource/api',
            payload: params,
            callback: () => {
              message.success('添加成功');
              this.handleModalVisible(false);
              dispatch({
                type: 'dervieSource/fetch',
              });
            },
          });
        }
      },
    });
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
    dispatch({
      type: 'catalog/tableField',
      payload: { tableId: data.id },
      callback:()=>{
        this.setState({choicedataListItems:data.selectArray});
        this.handleModalVisibleChoice(true);
      }
    });
  };
  onChangeRadioGroup = (value) => {
    const { dispatch } = this.props;
    this.setState({ choiceFeild: [], choicelist: [] });
    dispatch({
      type: 'centersource/fetchTable',
      payload: { id: modalListData.id, type: value.target.value },
    });
  };
  setChoicedaraListItem = (data) => {
    this.state.choicedataList.forEach(item => {
      if (choiseListItemData.id == item.id) {
        item.selectArray = data;
      }
    });
    this.setState({ choicedataList: this.state.choicedataList});
    // this.setState({  choicedataListItems: data });
  };
  getListBuyId = (data, index) => {
    this.handleItem(index);
    const { dispatch } = this.props;
    modalListData = data;
    if (index == 2 || index == 3) {
      dispatch({
        type: 'catalog/querycatalogItem',
        payload: { catalogId: treeSelect[0] },
      });
      // dispatch({
      //   type: 'dervieSource/get',
      //   payload: { id : treeSelect[0] },
      // });
      dispatch({
        type: 'centersource/fetchTable',
        payload: { id: data.id, type: 'TABLE' },
        callback: (res) => {
          let arr = res.map(item => {
            return { ...item, selectArray: [] };
          });
          this.setState({ choicedataList: arr || []});
        },
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
      confirm({
        title: '确定删除选中数据?',
        content: '删除数据不可恢复，请悉知！！！',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.state.selectedRows.forEach((item, index) => {
            if (index === this.state.selectedRows.length - 1) {
              dispatch({
                type: 'dervieSource/remove',
                payload: {
                  id: item.id,
                }, callback: () => {
                  message.success('删除成功');
                  this.setState({
                    selectedRows: [],
                  });
                  dispatch({
                    type: 'dervieSource/fetch',
                  });
                },
              });
            } else {
              dispatch({
                type: 'dervieSource/remove',
                payload: {
                  id: item.id,
                },
              });
            }
          });
        },
        onCancel: () => {
        },
      });
    } else {
      message.error('请先选择数据');
    }
  };

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  handleTree = data => {
    treeSelect = data;
    const { dispatch } = this.props;
    dispatch({
      type: 'dervieSource/fetch',
      payload: { pid: data[0] },
    });
  };
  addHandle = data => {
    if (!treeSelect) {
      message.error('请先选择衍生资源库');
      return;
    }
    this.handleModalVisible(true);
    const { dispatch } = this.props;
    dispatch({
      type: 'centersource/fetch',
      payload: data,
    });
  };
  handleChoiceFeild = (list) => {
    const { choiceFeild, choicelist } = this.state;
    this.setState({
      choicelist: choicelist.concat([{ ...choiseListItemData }]),
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
  excSql = (index) => {
    const { dispatch } = this.props;
    let params = {
      'params': index.sql,
      'dataSourceId': listItemData.dataSourceId,
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
      'deriveId': listItemData.id,
      'params': param,
    };
    dispatch({
      type: 'centersource/fetchView',
      payload: params,
    });
  };

  render() {
    const {
      dervieSource: { data, detail },
      dervieClassify: { treeData },
      catalog: { catalogItem, field, tableAndField, logdata },
      centersource: { sqlList, data: formData, dataList, lifelist, httpItem },
      form,
      loading,
    } = this.props;
    const {
      selectedRows, modalVisible, modalVisibleCatlog, radioSwitch, modalVisibleResource, choicedataList, choicedataListItems,
      modalVisibleChoice, item, type, choiceFeild, choicelist, detailType, selectItem, tableSelectedRows,
    } = this.state;
    const parentMethods = {
      tableSelectedRows: tableSelectedRows,
      tableSelectedRowsHandle: this.tableSelectedRowsHandle,
      httpItem: httpItem,
      handleStandardTableChange: this.handleStandardTableChangeDataSource,
      handleStandardTableChangeFile: this.handleStandardTableChangeFile,
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
      choicedataList:choicedataList,
      item: item,
      modalVisible: modalVisible,
      type: type,
      handleType: this.handleType,
      choiceFeild: choiceFeild,
      choicelist: choicelist,
      selectChange: this.selectChange,
      selectItem: selectItem,
      onChangeRadioGroup: this.onChangeRadioGroup,
    };
    const parentMethodsChoice = {
      data: field,
      choicedataList: choicedataList,
      choicedataListItems: choicedataListItems,
      setChoicedaraListItem: this.setChoicedaraListItem,
      choiceFeild: choiceFeild,
      handleChoiceFeild: this.handleChoiceFeild,
      handleAdd: this.handleAddChoice,
      handleModalVisible: this.handleModalVisibleChoice,
    };
    const parentMethodsResource = {
      handleAdd: this.handleAddResource,
      radioSwitcHandle: this.radioSwitcHandle,
      operateLog: logdata,
      sqlList: sqlList,
      excSql: this.excSql,
      lifelist: lifelist,
      httpItem: httpItem,
      searchHandle: this.searchHandle,
      radioSwitch: radioSwitch,
      tableAndField: detail,
      detailType: detailType,
      handleModalVisible: this.handleModalVisibleResource,
    };
    const columns = [
      {
        title: '序号',
        width: '150px',
        render: (text, record, index) => <span>{index + 1}</span>,
      },
      {
        title: '数据名称',
        width: '150px',
        dataIndex: 'name',
      },
      {
        title: '所属数据源',
        width: '150px',
        dataIndex: 'dataSourceName',
      },
      {
        title: '数据源类型',
        width: '150px',
        dataIndex: 'dataSourceType',
        render(val) {
          let text = '关系型数据库/MySql';
          if (val === 'mysql') {
            text = '关系型数据库/MySql';
          } else if (val === 'oracle') {
            text = '关系型数据库/Oracle';
          } else if (val === 'sqlserver') {
            text = '关系型数据库/SqlServer';
          } else if (val === 'mongo') {
            text = '非关系型数据库/MongoDB';
          } else if (val === 'hbase') {
            text = '非关系型数据库/HBase';
          } else if (val === 'local') {
            text = '本地文件/Local';
          } else if (val === 'ftp') {
            text = '文件系统/FTP';
          } else if (val === 'sftp') {
            text = '普通文件系统/SFTP';
          } else if (val === 'share') {
            text = '共享文件系统/Share';
          } else if (val === 'rest') {
            text = 'API/REST';
          } else if (val === 'https') {
            text = 'API/HTTPS';
          } else if (val === 'http') {
            text = 'API/HTTP';
          } else if (val === 'wsdl') {
            text = 'API/WSDL';
          }

          return text;
        },
      },
      {
        title: '数据来源',
        width: '150px',
        dataIndex: 'source',
      },
      {
        title: '操作',
        width: '150px',
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
                <Form onSubmit={this.handleSubmit}>
                  <Row>
                    <Col md={8} sm={12}>
                      <Button icon="plus" type="primary" onClick={() => this.addHandle(true)}>
                        新增
                      </Button>
                      <Button icon="delete" onClick={() => this.handleDelete(true)}>
                        批量删除
                      </Button>
                    </Col>
                    <Col md={8} sm={12}>
                      <FormItem style={{ marginRight: 10 }}  {...formItemLayout} label="数据来源">
                        {getFieldDecorator('source')(
                          < Select placeholder='请选择数据来源'>
                            <Option value='目录'>目录</Option>
                            <Option value="自定义">自定义</Option>
                          </Select>,
                        )}
                      </FormItem>
                    </Col>
                    <Col md={6} sm={8}>
                      <FormItem {...formItemLayout} label="数据名称">
                        {getFieldDecorator('name')(<Input placeholder="请输入数据名称"/>)}
                      </FormItem>
                    </Col>
                    <Col md={2} sm={4}>
                      <FormItem>
                        <Button type="primary" htmlType="submit">
                          查询
                        </Button>
                      </FormItem>
                    </Col>
                  </Row>
                </Form>
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
