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
  Progress,
  List,
} from 'antd';
import DescriptionList from 'components/DescriptionList';
import StandardTable from 'components/StandardTable';
import SimpleTree from 'components/SimpleTree';
import StandardTableNoCheck from 'components/StandardTableNoCheck';
import TagSelect from 'components/TagSelect';
import StandardFormRow from 'components/StandardFormRow';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

let itemDataStatus = 0;
let listItemData = {};
let itemData = {};
let createItemData = {};

import styles from './resource_file.less';

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

const TestForm = Form.create()(props => {
  const { modalVisible, form, selectedRows, testHandleAdd, testList, handleModalVisible } = props;
  let percent = parseInt((testList.length / selectedRows.length) * 100);
  return (
    <Modal
      title="测试连通性"
      visible={modalVisible}
      onOk={() => handleModalVisible()}
      destroyOnClose={true}
      onCancel={() => handleModalVisible()}
    >
      <span>{testList.length == selectedRows.length?'测试完毕':'测试中...'}</span>
      <Row>
        <Progress percent={percent}/>
      </Row>
      <Row>
        <Col xl={16} lg={12} md={12} sm={24} xs={24}>
          <div>
            测试连通：<span style={{ marginLeft: '10px' }}>{testList.filter(item => {
            return item;
          }).length}</span>条
          </div>
        </Col>
        <Col xl={16} lg={12} md={12} sm={24} xs={24}>
          <div>
            测试未连通：<span style={{ color: 'red', marginLeft: '10px' }}>{testList.filter(item => {
            return !item;
          }).length}</span>条
          </div>
        </Col>
      </Row>
      <Row  style={{marginTop:10}}>
        <Col xl={16} lg={12} md={12} sm={24} xs={24}>
          <Button onClick={testHandleAdd}>重试</Button>
        </Col>
      </Row>
    </Modal>
  );
});
const ResourceDetail = Form.create()(props => {
  const {
    modalVisible, form, handleModalVisible, loading, data, columns, detailType, tableAndField,
    radioSwitch, radioSwitcHandle, operateLog, lifelist, httpItem, searchHandle, sqlList, excSql,
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
  const filelogcolumns = [
    {
      title: '序号',
      width:'150px',
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: '文件调用用户',
      width:'150px',
      dataIndex: 'userName',
    }, {
      title: '累积调用次数',
      width:'150px',
      dataIndex: 'num',
    }, {
      title: '调用方式',
      width:'150px',
      dataIndex: 'type',
    }];
  return (
    <Modal
      title="资源详情"
      visible={modalVisible}
      footer={null}
      destroyOnClose={true}
      width={900}
      onCancel={() => handleModalVisible()}
    >
      <div>
        <DescriptionList size="large" col={1} title="文件信息" style={{ marginBottom: 32 }}>
          <Description term="文件名称">{itemData.name}</Description>
          {/*<Description term="文件描述">{itemData.description}</Description>*/}
        </DescriptionList>
        <DescriptionList size="large" title="数据调用记录" style={{ marginBottom: 32 }}>
          <StandardTableNoCheck
            selectedRows={[]}
            onSelectRow={[]}
            loading={loading}
            data={operateLog}
            columns={filelogcolumns}
          /></DescriptionList>
      </div>
    </Modal>
  );
});
@connect(({ resource_file, catalog, classify, centersource, loading }) => ({
  resource_file,
  catalog,
  classify,
  centersource,
  loading: loading.models.resource_file,
}))
@Form.create()
export default class ResourceClassify extends PureComponent {
  state = {
    modalVisible: false,
    testModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    tblFormValues: {},
    listItemData: {},
    testList: [],
    isFileDetail: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'centersource/fetchOrgList',
      callback: () => {
        dispatch({
          type: 'classify/tree',
          callback: () => {
            this.fetchHandle();
          },
        });
      },
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
  };

  fetchHandle(params) {
    const { dispatch } = this.props;
    params = { file: 'ftp,sftp,local,share', ...params };
    dispatch({
      type: 'centersource/fetch',
      payload: params,
    });
  }

  handleStandardTableChangeDetail = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { tblFormValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      ...tblFormValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'centersource/fetchFile',
      payload: { ...params, id: listItemData.id },
    });
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
      if (values && (values.file == 'all'||!values.file)) {
        values.file = 'ftp,sftp,local,share';
      }
      this.setState({
        formValues: values,
      });
      this.fetchHandle(values);
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

  handleTree = data => {
    const { dispatch } = this.props;
    createItemData.resourceId = data[0];
    this.fetchHandle({ resourceId: createItemData.resourceId });
    // dispatch({
    //   type: 'centersource/fetch',
    //   payload: {resourceId:createItemData.resourceId},
    // });
  };
  testHandleModalVisible = flag => {
    this.setState({
      testModalVisible: !!flag,
    });
  };
  getFileListHandle = (index, flag) => {
    const { dispatch } = this.props;
    listItemData = index;
    dispatch({
      type: 'centersource/fetchFile',
      payload: {
        id: listItemData.id,
      },
    });
    // dispatch({
    //   type: 'catalog/operateLog',
    //   payload: { id: listItemData.id, type: 'file' },
    // });
    this.getFileListHandleModalVisible(flag);
  };
  getFileDetailHandle = (index, flag) => {
    itemData = index;
    const { dispatch } = this.props;
    dispatch({
      type: 'catalog/operateLog',
      payload: { id: index.id, type: 'file' },
    });
    this.handleModalVisible(flag);
  };
  getFileListHandleModalVisible = (flag) => {
    this.setState({
      isFileDetail: !!flag,
    });
  };
  testHandleAdd = fields => {
    const { dispatch } = this.props;
    if(this.state.selectedRows.length <= 0){
      message.error('请先选择数据')
      return
    }
    // 之前信息的置空
    this.setState({
      testList: [],
    });
    this.setState({
      testSuccess: 0,
      testFail: 0,
    });
    this.setState({
      testModalVisible: true,
    });
    this.state.selectedRows.forEach((item, index) => {
      dispatch({
        type: 'centersource/test',
        payload: {
          id: item.id,
        },
        callback: (res) => {
          this.state.testList.push(res);
          this.setState({
            testList: this.state.testList,
          });
          if (res === true) {
            this.setState({
              testSuccess: this.state.testSuccess++,
            });
          } else {
            this.setState({
              testFail: this.state.testFail++,
            });
          }
          if (this.state.testList.length === this.state.selectedRows.length) {
            message.success('测试完毕');
          }
        },
      });
    });
  };
  handleSearchTable = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };
      this.setState({
        tblFormValues: values,
      });


      dispatch({
        type: 'centersource/fetchFile',
        payload: {
          id: listItemData.id,
          name:fieldsValue.name
        },
      });
    });
  };
  download = (index) => {
    // e.preventDefault();
    const { dispatch } = this.props;
    // window.open( '/datasource/download?id='+index.id);
    dispatch({
      type: 'resource_file/downloadfile',
      payload: {
        id: index.id,
        fileName: index.name,
      },
    });
    // var xmlhttp = new XMLHttpRequest();
    // xmlhttp.open('get', '/datasource/download?id=' + index.id, true);
    // xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
    // xmlhttp.setRequestHeader('Authorization', localStorage.getItem('token_str'));
    // xmlhttp.send();
    // xmlhttp.onreadystatechange = function() {
    //   if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    //     var data = new Blob([xmlhttp.response], { type: 'application/octet-binary;charset=UTF-8' });
    //     var downloadUrl = window.URL.createObjectURL(data);
    //     var anchor = document.createElement('a');
    //     anchor.href = downloadUrl;
    //     anchor.download = index.name;
    //     anchor.click();
    //     window.URL.revokeObjectURL(data);
    //   }
    // };
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'centersource/download',
    //   payload: {
    //     id: index.id,
    //   },
    //   callback: (res) => {
    //     var data = new Blob([res.body],{type:"application/octet-binary;charset=UTF-8"});
    //     var downloadUrl = window.URL.createObjectURL(data);
    //     var anchor = document.createElement("a");
    //     anchor.href = downloadUrl;
    //     anchor.download = index.name;
    //     anchor.click();
    //     window.URL.revokeObjectURL(data);
    //   },
    // });
  };
  // download1 = (index) => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'centersource/download',
  //     payload: {
  //       id: index.id,
  //     },
  //     callback: (res) => {
  //       console.log(res)
  //       var downloadUrl = window.URL.createObjectURL(res);
  //       var anchor = document.createElement("a");
  //       anchor.href = downloadUrl;
  //       // anchor.download = "文件名.txt";
  //       anchor.click();
  //       window.URL.revokeObjectURL(data);
  //     },
  //   });
  // };
  render() {
    const {
      centersource: { data, lifelist, orgList },
      loading,
      classify: { treeData },
      catalog: { catalogItem, field, tableAndField, logdata },
      form,
    } = this.props;
    const { selectedRows, modalVisible, lifelistlistItemData, testModalVisible, isFileDetail } = this.state;
    const detailColumns = [
      {
        title: '序号',
        width:'150px',
        render: (text, record, index) => <span>{index + 1}</span>,
      },
      {
        title: '文件名称',
        dataIndex: 'name',
        width:'150px',
      },
      {
        title: '所属数据源',
        dataIndex: 'dataSourceName',
        width:'150px',
      },
      {
        title: '数据源类型',
        dataIndex: 'dataSourceType',
        width:'150px',
        render(val) {
          let text = '本地文件/Local';
          if( val === 'local' ) {
            text = '本地文件/Local';
          } else if( val === 'ftp' ) {
            text = '文件系统/FTP';
          } else if( val === 'sftp' ) {
            text = '普通文件系统/SFTP';
          } else if( val === 'share' ) {
            text = '共享文件系统/Share';
          }
          return text;
        },
      },
      {
        title: '文件储存路径',
        dataIndex: 'path',
        width:'150px',
      },
      {
        title: '文件大小',
        dataIndex: 'fileSize',
        width:'150px',
      },
      {
        title: '类型',
        dataIndex: 'type',
        width:'150px',
      },
      {
        title: '操作',
        width:'150px',
        render: (text, record, index) => {
          return (
            <span>
              <a onClick={() => {
                this.getFileDetailHandle(text, true);
              }}>查看</a>
              <Divider type="vertical"/>
              <a onClick={() => {
                this.download(text);
              }}>下载</a>
              {/*<Divider type="vertical"/>*/}
              {/*<a href={"/datasource/download?id="+text.id}>下载</a>*/}
              {/*<Divider type="vertical"/>*/}
              {/*<a onClick={() => {*/}
              {/*this.download1(text);*/}
              {/*}}>下载1</a>*/}
            </span>
          );
        },
      },
    ];
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
        render(val) {
          let text = '本地文件/Local';
          if( val === 'local' ) {
            text = '本地文件/Local';
          } else if( val === 'ftp' ) {
            text = '文件系统/FTP';
          } else if( val === 'sftp' ) {
            text = '普通文件系统/SFTP';
          } else if( val === 'share' ) {
            text = '共享文件系统/Share';
          }
          return text;
        },
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
        title: '连通状态',
        width:'150px',
        dataIndex: 'linkStatus',
        render(val) {
          return <Badge status={val == 'on' ? 'success' : 'error'} text={val == 'on' ? '连通' : '未连通'}/>;
        },
      },
      {
        title: '操作',
        width:'150px',
        render: (text, record, index) => {
          return (
            <Fragment>
              <a onClick={() => {
                this.getFileListHandle(text, true);
              }}>文件详情</a>
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
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const testParentMethods = {
      handleModalVisible: this.testHandleModalVisible,
      selectedRows: this.state.selectedRows,
      testList: this.state.testList,
      testHandleAdd: this.testHandleAdd,
    };
    const parentMethodsResource = {
      operateLog: logdata,
      handleModalVisible: this.handleModalVisible,
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
          {isFileDetail ? <Card bordered={false} className={styles.flexTable}>
            <div className={styles.tableList}>
              <Form onSubmit={this.handleSearchTable} >
                <Row gutter={{ md: 2, lg: 6, xl: 12 }}>
                  <Col md={2} sm={24}>
                    <FormItem>
                      <Button onClick={() => {
                        this.getFileListHandleModalVisible(false);
                      }}>
                        返回
                      </Button>
                    </FormItem>
                  </Col>
                  <Col offset={8} md={12} sm={24}>
                    <FormItem {...formItemLayout} label="文件名称">
                      {getFieldDecorator('name')(<Input placeholder="请输入文件名称"/>)}
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
                selectedRows={[]}
                loading={loading}
                data={lifelist}
                columns={detailColumns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChangeDetail}
              />
            </div>
          </Card> : <Card bordered={false} className={styles.flexTable}>
            <div className={styles.tableList}>
                <Form onSubmit={this.handleSearch} >
                <Row gutter={{ md: 2, lg: 6, xl: 12 }}>
                  <Col md={6} sm={24}>
                    <FormItem>
                      <Button icon="desktop" type="primary" onClick={() => this.testHandleAdd(true)}>
                        测试连通性
                      </Button>
                    </FormItem>
                  </Col>
                  <Col md={8} sm={24}>
                    <FormItem {...formItemLayout} label="数据源类型" style={{ marginBottom: 0 }}>
                      {getFieldDecorator('file')(
                        < Select placeholder='请选择数据源类型' style={{ width: '100%' }}>
                          <Option value='all'>全选</Option>
                          <Option value='ftp'>文件系统/ftp</Option>
                          <Option value="sftp">文件系统/sftp</Option>
                          <Option value='local'>文件系统/本地磁盘</Option>
                          <Option value="share">文件系统/共享文件夹</Option>
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={24}>
                    <FormItem {...formItemLayout} label="数据源名称">
                      {getFieldDecorator('sourceName')(<Input placeholder="请输入数据源名称"/>)}
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
                data={data}
                columns={columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card>}
        </div>
        <TestForm {...testParentMethods} modalVisible={testModalVisible}/>
        {/*<CreateForm {...parentMethods} modalVisible={modalVisible} />*/}
        <ResourceDetail {...parentMethodsResource} modalVisible={modalVisible}/>
      </PageHeaderLayout>
    );
  }
}
