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
} from 'antd';
import StandardTable from 'components/StandardTable';
import StandardTableNoPage from 'components/StandardTableNoPage';
import SimpleTree from 'components/SimpleTree';
import TagSelect from 'components/TagSelect';
import StandardFormRow from 'components/StandardFormRow';
import StandardTableRadio from 'components/StandardTableRadio';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';


import styles from './dervieSource.less';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];
let itemDataStatus = 0;
let listItemData = {};
let treeSelect = {};
let selectValue = [];

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, data, handleItem, item, dataList, searchHandle, getListBuyId } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  const { getFieldDecorator } = form;
  const options = [{
    value: 'gxxsjk',
    label: '关系型数据库',
    children: [{
      value: 'gxxsjk_MySQL', label: 'MySQL',
    }, {
      value: 'gxxsjk_Oracle', label: 'Oracle',
    }, {
      value: 'gxxsjk_SQLServer', label: 'SQLServer',
    }, {
      value: 'gxxsjk_DB2', label: 'DB2',
    }],
  }, {
    value: 'fgxxsjk',
    label: '非关系型数据库',
    children: [{
      value: 'fgxxsjk_MongoDB', label: 'MongoDB',
    }, {
      value: 'fgxxsjk_Hbase', label: 'Hbase',
    }],
  }, {
    value: 'API',
    label: 'API',
    children: [{
      value: 'API_HTTP', label: 'HTTP',
    }, {
      value: 'API_HTTPS', label: 'HTTPS',
    }, {
      value: 'API_WSDL', label: 'WSDL',
    }, {
      value: 'API_REST', label: 'REST',
    }],
  }, {
    value: 'ptwj',
    label: '普通文件',
    children: [{
      value: 'ptwj_FTP', label: 'FTP',
    }, {
      value: 'ptwj_SFTP', label: 'SFTP',
    }, {
      value: 'ptwj_bdcp', label: '本地磁盘',
    }, {
      value: 'ptwj_gxwjj', label: '共享文件夹',
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
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '连接状态',
      dataIndex: 'linkStatus',
      render(val) {
        return <Badge status={val ? 'success' : 'error'} text={val}/>;
      },
    },
  ];
  const columnsNoPage = [
    {
      title: '序号',
      dataIndex: 'no',
    },
    {
      title: '表名',
      dataIndex: 'no1',
    },
    {
      title: '表描述',
      dataIndex: 'updatedAt1',
    },
  ];
  const firstFooter = (<Row>
    <Col md={24} sm={24}>
      <Button type="primary" onClick={() => {
        getListBuyId(choiceSelectedRows[0], 2);
      }}>
        下一步
      </Button>
      <Button onClick={() => {
        handleModalVisible(false);
      }}>
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
      <Button type="primary" onClick={handleAdd}>
        提交
      </Button>
      <Button onClick={() => {
        handleModalVisible(false);
      }}>
        取消
      </Button>
    </Col>
  </Row>);
  let selectedRows = [];
  let choiceSelectedRows = [];

  const onChange = (index) => {
    sourceType = index[0] + '/' + index[1];
  };

  function handleSelectRows(data, d) {
    choiceSelectedRows = data;
  }

  function handleStandardTableChange() {

  }

  const handleSubmit = () => {

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
      title="新增"
      visible={modalVisible}
      width={900}
      footer={item === 1 ? firstFooter : secondFooter}
      onOk={handleItem}
      onCancel={() => handleModalVisible(false)}
    >
      {item === 1 ? <Form onSubmit={handleSubmit}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem {...formItemLayout} label="资源分类">
              {getFieldDecorator('sourceType')(
                <Select placeholder="选择资源分类" style={{ width: '100%' }}>
                  <Option value="gxxsjk">关系型数据库</Option>
                  <Option value="fgxxsjk">非关系型数据库</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem {...formItemLayout} label="数据源类型"><Cascader style={{ width: 100 + '%' }} options={options}
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
        <StandardTableRadio
          selectedRows={choiceSelectedRows}
          data={data}
          columns={columns}
          onSelectRow={handleSelectRows}
          onChange={handleStandardTableChange}
        />
      </Row></Form> : <div><Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={12} sm={24}>
          <FormItem {...formItemLayout} label="新增类型">
            {getFieldDecorator('status')(
              <Select placeholder="选择新增类型" style={{ width: '100%' }}>
                <Option value="gxxsjk">关系型数据库</Option>
                <Option value="fgxxsjk">非关系型数据库</Option>
              </Select>,
            )}
          </FormItem>
        </Col>
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
          <StandardTableNoPage
            selectedRows={selectedRows}
            data={data}
            columns={columnsNoPage}
            onSelectRow={handleSelectRows}
            onChange={handleStandardTableChange}
          />
        </Row></div>}
    </Modal>
  );
});

@connect(({ dervieSource, centersource, dervieClassify, loading }) => ({
  dervieSource,
  centersource,
  dervieClassify,
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
      currentPage: pagination.current,
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
  handleItem = (index) => {
    this.setState({
      item: index,
    });
  };
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
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
      centersource: { data: formData, dataList },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, listItemData, item } = this.state;

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
                this.handleModalVisible(true);
                this.setState({
                  listItemData: text,
                });
              }}>查看</a>
            </Fragment>
          );
        },
      },
    ];

    const parentMethods = {
      handleAdd: this.handleAdd,
      searchHandle: this.searchHandle,
      getListBuyId: this.getListBuyId,
      handleItem: this.handleItem,
      handleModalVisible: this.handleModalVisible,
    };

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
                <Button icon="plus" type="primary" onClick={() => this.addHandle(true)}>
                  新增
                </Button>
                <Button icon="delete" onClick={() => this.handleDelete(true)}>
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
        <CreateForm {...parentMethods} data={formData} dataList={dataList} item={item}
                    modalVisible={modalVisible}/>
        {/*<StepNoTitle {...parentMethods} data={data} modalVisible={modalVisible}/>*/}
      </PageHeaderLayout>
    );
  }
}
