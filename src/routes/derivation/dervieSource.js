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
  Radio
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
  const { modalVisible, form, handleAdd, handleModalVisible,data,handleItem,item} = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  const { getFieldDecorator } = form;
  const options = [{
    value: '关系型数据库',
    label: '关系型数据库',
    children: [{
      value: 'MySQL', label: 'MySQL',
    }, {
      value: 'Oracle', label: 'Oracle',
    }, {
      value: 'SQLServer', label: 'SQLServer',
    }, {
      value: 'DB2', label: 'DB2',
    }],
  }, {
    value: '非关系型数据库',
    label: '非关系型数据库',
    children: [{
      value: 'MongoDB', label: 'MongoDB',
    }, {
      value: 'Hbase', label: 'Hbase',
    }],
  }, {
    value: 'API',
    label: 'API',
    children: [{
      value: 'HTTP', label: 'HTTP',
    }, {
      value: 'HTTPS', label: 'HTTPS',
    }, {
      value: 'WSDL', label: 'WSDL',
    }, {
      value: 'REST', label: 'REST',
    }],
  }, {
    value: '普通文件',
    label: '普通文件',
    children: [{
      value: 'FTP', label: 'FTP',
    }, {
      value: 'SFTP', label: 'SFTP',
    }, {
      value: '本地磁盘', label: '本地磁盘',
    }, {
      value: '共享文件夹', label: '共享文件夹',
    }],
  }];
  const columns = [
    {
      title: '数据源名称',
      dataIndex: 'no',
    },
    {
      title: '数据源类型',
      dataIndex: 'status',
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]}/>;
      },
    },
    {
      title: '数据源描述',
      dataIndex: 'no',
    },
    {
      title: '最近连接时间',
      dataIndex: 'updatedAt1',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '连接状态',
      dataIndex: 'updatedAt2',
      render(val) {
        return <Badge status={val?'success': 'error'} text={val}/>;
      },
    }
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
      <Button type="primary" onClick={()=>{handleItem(2)}}>
        下一步
      </Button>
      <Button onClick={()=>{handleModalVisible(false)}}>
        取消
      </Button>
    </Col>
  </Row>);
  const secondFooter = (<Row>
    <Col md={24} sm={24}>
      <Button onClick={()=>{handleItem(1)}}>
        上一步
      </Button>
      <Button type="primary" onClick={handleAdd}>
        提交
      </Button>
      <Button onClick={()=>{handleModalVisible(false)}}>
        取消
      </Button>
    </Col>
  </Row>);
  let selectedRows = []
  function onChange(value) {
    selectValue = value;
  }
  function handleSelectRows() {

  }
  function handleStandardTableChange() {

  }
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
      footer={item===1?firstFooter:secondFooter}
      onOk={handleItem}
      onCancel={() => handleModalVisible(false)}
    >
      {item===1?<div>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
              <FormItem {...formItemLayout} label="资源分类">
                {getFieldDecorator('status')(
                  <Select placeholder="选择资源分类" style={{ width: '100%' }}>
                    <Option value="0">关系型数据库</Option>
                    <Option value="1">非关系型数据库</Option>
                  </Select>
                )}
              </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={12} sm={24}>
          <FormItem {...formItemLayout} label="数据源类型"><Cascader style={{ width: 100 + '%' }} options={options} onChange={onChange}
                              placeholder="请选择数据源/数据库"/>
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem>
            {getFieldDecorator('no')(<Input placeholder="请输入数据源名称"/>)}
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
        selectedRows={selectedRows}
        data={data}
        columns={columns}
        onSelectRow={handleSelectRows}
        onChange={handleStandardTableChange}
        />
        </Row></div>:<div><Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={12} sm={24}>
          <FormItem {...formItemLayout} label="新增类型">
            {getFieldDecorator('status')(
              <Select placeholder="选择新增类型" style={{ width: '100%' }}>
                <Option value="0">关系型数据库</Option>
                <Option value="1">非关系型数据库</Option>
              </Select>
            )}
          </FormItem>
        </Col>
        <Col md={12} sm={24}>
          <FormItem {...formItemLayout} label="请选择表/视图">
            <RadioGroup onChange={this.onChange} >
              <Radio value={1}>表</Radio>
              <Radio value={2}>视图</Radio>
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

@connect(({ dervieSource, loading }) => ({
  dervieSource,
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
    item:1
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dervieSource/fetch',
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
  handleItem = (index)=>{
    this.setState({
      item: index,
    });
  }
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

  render() {
    const {
      dervieSource: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, listItemData ,item} = this.state;

    const columns = [
      {
        title: '序号',
        dataIndex: 'no',
      },
      {
        title: '数据名称',
        dataIndex: 'status',
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]}/>;
        },
      },
      {
        title: '所属数据源',
        dataIndex: 'updatedAt1',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '数据源类型',
        dataIndex: 'updatedAt2',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '数据来源',
        dataIndex: 'updatedAt3',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
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
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderLayout>
        <div className={styles.flexMain}>
          {/*<SimpleTree*/}
          {/*data={data}*/}
          {/*handleTree={this.handleTree}*/}
          {/*title={'中心数据源'}*/}
          {/*/>*/}
          <Card bordered={false}  className={styles.flexTable}>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
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
        <CreateForm {...parentMethods} data={data} handleItem={this.handleItem} item={item} modalVisible={modalVisible}/>
        {/*<StepNoTitle {...parentMethods} data={data} modalVisible={modalVisible}/>*/}
      </PageHeaderLayout>
    );
  }
}
