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
import StandardTableNoCheck from 'components/StandardTableNoCheck';
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

@connect(({ classify,dervieClassify,charts, loading }) => ({
  classify,
  dervieClassify,
  charts,
  loading: loading.models.classify,
}))
@Form.create()
export default class DerivationDetail extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    index:0,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'dervieClassify/derivechildybyid',
    // });
    dispatch({
      type: 'charts/deriveClassify',
    });
  }
  handleStandardTableChangeDetail = (pagination, filtersArg, sorter) => {
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
      type: 'centersource/fetchTablePage',
      payload: { ...params, id: listItemData.id },
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
    this.setState({
      index:item
    })
  }
  render() {
    const {
      classify: { treeData },
      dervieClassify:{child},
      loading,
      charts:{deriveClassify}
    } = this.props;
    const { selectedRows, modalVisible,index } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const columns = [
      {
        title: '衍生库',
        dataIndex: 'dataSourceName',
      },
      {
        title: '数据库',
        dataIndex: 'totalCount',
      },
      {
        title: '文件',
        dataIndex: 'totalSize',
      },
      {
        title: '服务',
        dataIndex: 'totalCount',
      },
      {
        title: '操作',
        width: 80,
        render: (text, record, index) => {
          return (
            <Fragment>
              <Link to="/derivation/dervieSource"  key="main1">
                查看
              </Link>
            </Fragment>
          );
        },
      },
    ];
    let item = '';
    for(let i in deriveClassify[index]){
      item = i;
    }
    let data = deriveClassify[index]?{list:deriveClassify[index][item]}:[];
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
                  defaultActiveKey={index}
                  tabPosition='top'
                  onChange={this.handleModeChange}
                >
                  {deriveClassify.map((r,index)=>{
                    let item = '';
                    for(let i in r){
                      item = i;
                    }
                    return <TabPane tab={item} key={index}></TabPane>
                  })}
                </Tabs>
                <StandardTableNoCheck
                  selectedRows={[]}
                  loading={loading}
                  data={data}
                  columns={columns}
                  onChange={this.handleStandardTableChangeDetail}
                />
              </div>
            </div>
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}
