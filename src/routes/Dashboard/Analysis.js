import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Icon,
  Card,
  Tabs,
  Form,
  Table,
  Radio,
  DatePicker,
  Menu,
  Dropdown,
} from 'antd';
import numeral from 'numeral';
import {
  ChartCard,
  yuan,
  MiniArea,
  MiniBar,
  MiniProgress,
  Field,
  Bar,
  Pie,
  TimelineChart,
} from 'components/Charts';
import { Link } from 'dva/router';
import Trend from 'components/Trend';
import NumberInfo from 'components/NumberInfo';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getTimeDistance } from '../../utils/utils';
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  Button,
  View,
  Guide,
  Shape,
  Facet,
  Util,
} from 'bizcharts';

import styles from './Analysis.less';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;

const rankingListData = [];
for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: `工专路 ${i} 号店`,
    total: 323234,
  });
}

const Yuan = ({ children }) => (
  <span
    dangerouslySetInnerHTML={{ __html: yuan(children) }} /* eslint-disable-line react/no-danger */
  />
);

@connect(({ chart, charts, loading }) => ({
  chart,
  charts,
  loading: loading.effects['chart/fetch'],
}))
export default class Analysis extends Component {
  state = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
    isFileDetail: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    //1
    dispatch({
      type: 'charts/fetchCatlog1',
      payload: { fid: '1' },
    });
    dispatch({
      type: 'charts/fetchCatlog2',
      payload: { fid: '2' },
    });
    dispatch({
      type: 'charts/fetchCatlog3',
      payload: { fid: '3' },
    });
    dispatch({
      type: 'charts/catlogTotal',
    });
    dispatch({
      type: 'charts/catlogcheck',
      payload: { isCheck: 'check' },
    });
    // 2
    dispatch({
      type: 'charts/dataSourceCount',
    });
    dispatch({
      type: 'charts/halfYearCount1',
      payload: { sourceType: 'db' },
    });
    dispatch({
      type: 'charts/halfYearCount2',
      payload: { sourceType: 'file' },
    });
    dispatch({
      type: 'charts/halfYearCount3',
      payload: { sourceType: 'api' },
    });
    //3
    dispatch({
      type: 'charts/deriveClassifyCount',
    });
    dispatch({
      type: 'charts/deriveClassify',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'chart/clear',
    // });
  }

  handleChangeSalesType = e => {
    this.setState({
      salesType: e.target.value,
    });
  };

  handleTabChange = key => {
    this.setState({
      currentTabKey: key,
    });
  };
  getListHandleModalVisible = (flag) => {
    this.setState({
      isFileDetail: !!flag,
    });
  };
  handleRangePickerChange = rangePickerValue => {
    this.setState({
      rangePickerValue,
    });

    const { dispatch } = this.props;
    dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  selectDate = type => {
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });

    const { dispatch } = this.props;
    dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  isActive(type) {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return;
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
  }

  getCount = (type, index) => {
    const { charts } = this.props;
    const { dataCount } = charts;
    if (dataCount.length > 0)
      return dataCount.filter(r => {
        return r.sourceType == type;
      })[0][index];
    else
      return 0;
  };
  getGB = (index) => {
    if (!index)
      return 0.0;
    return index.substr(0, index.length - 2);
  };

  render() {
    const { salesType, isFileDetail } = this.state;
    const { charts, loading } = this.props;
    const {
      total, check, catlog1, catlog2, catlog3, dataCount, halfYear1, halfYear2, halfYear3, deriveCount,deriveClassify,
    } = charts;
    const { DataView } = DataSet;
    const { Html } = Guide;
    const data_catlog = [
      {
        item: '已校验目录',
        count: check,
      },
      {
        item: '未校验目录',
        count: 1 - check,
      },
    ];
    const dv_catlog = new DataView();
    dv_catlog.source(data_catlog).transform({
      type: 'percent',
      field: 'count',
      dimension: 'item',
      as: 'percent',
    });
    const cols = {
      percent: {
        formatter: val => {
          val = val * 100 + '%';
          return val;
        },
      },
    };
    let ztsml = catlog2.reduce((total, item) => {
      return total + parseInt(item.catalogNum);
    }, 0);
    let ztsmg = catlog2.reduce((total, item) => {
      return total + parseInt(item.childNum);
    }, 0);
    let bmsml = catlog3.reduce((total, item) => {
      return total + parseInt(item.catalogNum);
    }, 0);
    let bmsmg = catlog3.reduce((total, item) => {
      return total + parseInt(item.childNum);
    }, 0);
    const ds = new DataSet();

    const dv_db = [];
    let dv_db_itemsl = { name: '数量' };
    let dv_db_itemrl = { name: '容量' };
    let dv_db_item = [];
    halfYear1.forEach(r => {
      dv_db_itemsl[r.month + '月'] = r.totalCount;
      dv_db_itemrl[r.month + '月'] = parseInt(this.getGB(r.totalSize));
      dv_db_item.push(r.month + '月');
    });
    if (halfYear1.length > 0) {
      dv_db.push(dv_db_itemsl);
      dv_db.push(dv_db_itemrl);
    }
    const dv_file = [];
    let dv_file_itemsl = { name: '数量' };
    let dv_file_itemrl = { name: '容量' };
    let dv_file_item = [];
    halfYear2.forEach(r => {
      dv_file_itemsl[r.month + '月'] = r.totalCount;
      dv_file_itemrl[r.month + '月'] = parseInt(this.getGB(r.totalSize));
      dv_file_item.push(r.month + '月');
    });
    if (halfYear2.length > 0) {
      dv_file.push(dv_file_itemsl);
      dv_file.push(dv_file_itemrl);
    }
    const dv = ds.createView().source(dv_db);
    dv.transform({
      type: 'fold',
      fields: dv_db_item,
      // 展开字段集
      key: '月份',
      // key字段
      value: '月均', // value字段
    });
    const dv__file = ds.createView().source(dv_file);
    dv__file.transform({
      type: 'fold',
      fields: dv_file_item,
      // 展开字段集
      key: '月份',
      // key字段
      value: '月均', // value字段
    });
    halfYear3.forEach(r => {
      r.month = r.month + '月';
    });
    const data_derivation = Object.keys(deriveCount).map(item=>{
        return {item:item,count:deriveCount[item]}
      });
    const dv_derivation = new DataView();
    dv_derivation.source(data_derivation).transform({
      type: 'percent',
      field: 'count',
      dimension: 'item',
      as: 'percent',
    });
    const cols_derivation = {
      percent: {
        formatter: val => {
          val = parseInt(val * 100) + '%';
          return val;
        },
      },
    };
    return (
      <PageHeaderLayout><Fragment>
        <Row gutter={24} key={0}>
          <Card
            loading={loading}
            bordered={false}
            title="政务信息资源目录总量"
            bodyStyle={{ padding: 0 }}
          >
            <Col xl={8} lg={8} md={8} sm={24} xs={24}
                 className={styles.catlog}>
              <Chart
                height={180}
                data={dv_catlog}
                scale={cols}
                padding={[50, 0, 10, 0]}
                forceFit={true}
              >
                <Coord type={'theta'} radius={1} innerRadius={0.6}/>
                <Axis name="percent"/>
                <Guide>
                  <Html
                    position={['50%', '-50%']}
                    html={'<div style=\'color:#8c8c8c;font-size:1.16em;text-align: center;width: 10em;\'><span style=\'color:#262626;font-size:1.5em\'>' + total + '</span>个</div>'}
                    alignX="middle"
                    alignY="top"
                  />
                </Guide>
                <Legend
                  marker={'square'}
                  position="top"
                  offsetY={0}
                  offsetX={0}
                />
                <Tooltip
                  showTitle={false}
                  itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
                />
                <Geom
                  type="intervalStack"
                  position="percent"
                  color="item"
                >
                </Geom>
              </Chart>
            </Col>
            <Col xl={8} lg={8} md={8} sm={24} xs={24}>
              <Chart height={180}
                     width={340}
                     className={styles.catlog}
                     padding={[40, 10, 40, 10]}
                     data={catlog1}>
                <Tooltip
                  crosshairs={{
                    type: 'catalogNum',
                  }}
                />
                <Guide>
                  <Html
                    position={['10%', '-50%']}
                    html={'<div style=\'background:#8FADCC;text-align: center;border-radius:25%;width: 5em;\'><span style=\'color:#fff ;font-size:12px\'>基础目录</span></div>'}
                    alignX="middle"
                    alignY="top"
                  />
                </Guide>
                <Axis name="name" tickLine={null}
                      line={null}
                      textStyle={{
                        fontSize: '12',
                        textAlign: 'center',
                        fill: '#999',
                        fontWeight: 'bold',
                        rotate: 90,
                      }}/>
                <Geom type='interval' position="name*catalogNum">
                  <Label content="catalogNum"/>
                </Geom>
              </Chart>
            </Col>
            <Col xl={4} lg={4} md={4} sm={12} xs={12} className={styles.catlog}>
              <div style={{ height: 180, padding: '0 10px' }}>
                <div className={styles.catlogTitle}><span style={{ color: '#fff', fontSize: 12 }}>主题目录</span></div>
                <div style={{ height: 80, textAlign: 'center', borderBottom: '1px solid #e8e8e8' }}>
                  <div style={{ fontSize: '1.16em' }}><span style={{ fontSize: '1.5em', marginRight: 5 }}>{ztsml}</span>类
                  </div>
                  <div>主题数目</div>
                </div>
                <div style={{ height: 80, textAlign: 'center', borderBottom: '1px solid #e8e8e8' }}>
                  <div style={{ fontSize: '1.16em' }}><span style={{ fontSize: '1.5em', marginRight: 5 }}>{ztsmg}</span>个
                  </div>
                  <div>目录数目</div>
                </div>
              </div>
            </Col>
            <Col xl={4} lg={4} md={4} sm={12} xs={12} className={styles.catlog}>
              <div style={{ height: 180, padding: '0 10px' }}>
                <div className={styles.catlogTitle}><span style={{ color: '#fff', fontSize: 12 }}>部门目录</span></div>
                <div style={{ height: 80, textAlign: 'center', borderBottom: '1px solid #e8e8e8' }}>
                  <div style={{ fontSize: '1.16em' }}><span style={{ fontSize: '1.5em', marginRight: 5 }}>{bmsml}</span>部门
                  </div>
                  <div>部门数目</div>
                </div>
                <div style={{ height: 80, textAlign: 'center', borderBottom: '1px solid #e8e8e8' }}>
                  <div style={{ fontSize: '1.16em' }}><span style={{ fontSize: '1.5em', marginRight: 5 }}>{bmsmg}</span>个
                  </div>
                  <div>目录数目</div>
                </div>
              </div>
            </Col>
          </Card>
        </Row>
        <Row gutter={24} key={1}>
          <Card
            loading={loading}
            bordered={false}
            title="政务信息资源总量"
            bodyStyle={{ padding: 0 }}
          >
            <Col xl={8} lg={8} md={8} sm={24} xs={24}
                 className={styles.catlog}>
              <div>
                <div className={styles.catlogTitle} style={{ left: 8 }}><span
                  style={{ color: '#fff', fontSize: 12 }}>数据库</span></div>
                <div style={{ display: 'flex' }}>
                  <div style={{
                    fontSize: '1.16em',
                    flex: '1 1 auto',
                    textAlign: 'center',
                    borderRight: '1px solid #e8e8e8',
                  }}><span style={{ fontSize: '1.5em', marginRight: 5 }}>{this.getCount('db', 'totalCount')}</span>万条
                  </div>
                  <div style={{ fontSize: '1.16em', flex: '1 1 auto', textAlign: 'center' }}><span
                    style={{ fontSize: '1.5em', marginRight: 5 }}>{this.getGB(this.getCount('db', 'totalSize'))}</span>GB
                  </div>
                </div>
              </div>
              <Chart height={180} width={340} data={dv}
                     padding={[40, 10, 40, 10]}>
                <Axis name="月份"/>
                <Axis name="月均"/>
                <Tooltip
                  crosshairs={{
                    type: 'y',
                  }}
                />
                <Legend
                  marker={'square'}
                  position="top"
                  offsetY={0}
                  offsetX={0}
                />
                <Geom
                  type="interval"
                  position="月份*月均"
                  color={'name'}
                  adjust={[
                    {
                      type: 'dodge',
                      marginRatio: 1 / 32,
                    },
                  ]}
                />
              </Chart>
            </Col>
            <Col xl={8} lg={8} md={8} sm={24} xs={24}
                 className={styles.catlog}>
              <div>
                <div className={styles.catlogTitle} style={{ left: 8 }}><span
                  style={{ color: '#fff', fontSize: 12 }}>文件</span></div>
                <div style={{ display: 'flex' }}>
                  <div style={{
                    fontSize: '1.16em',
                    flex: '1 1 auto',
                    textAlign: 'center',
                    borderRight: '1px solid #e8e8e8',
                  }}><span style={{ fontSize: '1.5em', marginRight: 5 }}>{this.getCount('file', 'totalCount')}</span>个
                  </div>
                  <div style={{ fontSize: '1.16em', flex: '1 1 auto', textAlign: 'center' }}><span
                    style={{
                      fontSize: '1.5em',
                      marginRight: 5,
                    }}>{this.getGB(this.getCount('file', 'totalSize'))}</span>GB
                  </div>
                </div>
              </div>
              <Chart height={180} width={340} data={dv__file}
                     padding={[40, 10, 40, 10]}>
                <Axis name="月份"/>
                <Axis name="月均"/>
                <Tooltip
                  crosshairs={{
                    type: 'y',
                  }}
                />
                <Legend
                  marker={'square'}
                  position="top"
                  offsetY={0}
                  offsetX={0}
                />
                <Geom
                  type="interval"
                  position="月份*月均"
                  color={'name'}
                  adjust={[
                    {
                      type: 'dodge',
                      marginRatio: 1 / 32,
                    },
                  ]}
                />
              </Chart>
            </Col>
            <Col xl={8} lg={8} md={8} sm={24} xs={24}
                 className={styles.catlog}>
              <div>
                <div className={styles.catlogTitle} style={{ left: 8 }}><span
                  style={{ color: '#fff', fontSize: 12 }}>服务</span></div>
                <div style={{ fontSize: '1.16em', textAlign: 'center', borderRight: '1px solid #e8e8e8' }}><span
                  style={{ fontSize: '1.5em', marginRight: 5 }}>{this.getCount('api', 'totalCount')}</span>个
                </div>
              </div>
              <Chart height={180} width={340} data={halfYear3}
                     padding={[40, 10, 40, 10]}>
                <Axis name="month"/>
                <Axis name="totalCount"/>
                <Tooltip
                  crosshairs={{
                    type: 'y',
                  }}
                />
                <Legend
                  marker={'square'}
                  position="top"
                  offsetY={0}
                  offsetX={0}
                />
                <Geom
                  type="point"
                  position="month*totalCount"
                  size={4}
                  shape={'circle'}
                  style={{
                    stroke: '#fff',
                    lineWidth: 1,
                  }}
                />
              </Chart>
            </Col>
          </Card>
        </Row>
        <Row gutter={24} key={2}>
          <Card
            loading={loading}
            bordered={false}
            title="政务信息资源衍生库分类统计"
            bodyStyle={{ padding: 0 }}
          >
            <Col xl={8} lg={8} md={8} sm={24} xs={24}
                 className={styles.catlog}>
              <Chart height={180} data={dv_derivation} scale={cols_derivation} padding={[40, 0, 20, 0]} forceFit>
                <Coord type='theta' radius={0.75}/>
                <Axis name="percent"/>
                <Guide>
                  <Html
                    position={['50%', '-50%']}
                    html={'<div style=\'color:#8c8c8c;font-size:1.16em;text-align: center;width: 10em;\'><span style=\'color:#262626;font-size:1.5em\'>' + Object.keys(deriveCount).reduce((d,item)=>{return deriveCount[item]+d},0) + '</span>个</div>'}
                    alignX="middle"
                    alignY="top"
                  />
                </Guide>
                <Tooltip
                  showTitle={false}
                  itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
                />
                <Geom
                  type="intervalStack"
                  position="percent"
                  color='item'
                  tooltip={['item*percent', (item, percent) => {
                    percent = percent * 100 + '%';
                    return {
                      name: item,
                      value: percent,
                    };
                  }]}
                  style={{ lineWidth: 1, stroke: '#fff' }}
                >
                  <Label content='percent' formatter={(val, item) => {
                    return item.point.item + ': ' + val;
                  }}/>
                </Geom>
              </Chart>

              <div style={{
                height: 30,
                textAlign: 'center',
                lineHeight: '30px',
                cursor: 'pointer',
                color: '#1890ff',
              }}><Link to="/derivationDetail" key="logo">
                查看全部衍生库>>
              </Link>
              </div>
            </Col>
            <Col xl={4} lg={4} md={4} sm={12} xs={12}
                 className={styles.catlog}>
              <div style={{ height: 210 }}>
                <div className={styles.catlogTitle} style={{ left: 8, marginBottom: 10 }}><span
                  style={{ color: '#fff', fontSize: 12 }}>基础库</span></div>
                <span style={{ marginLeft: 5, color: '#1890ff' }}>数量</span>
                <div style={{
                  fontSize: '1em',
                  flex: '1 1 auto',
                  textAlign: 'center',
                  lineHeight: '2em',
                  marginTop: 10,
                }}>数据库<span
                  style={{ fontSize: '1.2em', marginLeft: 5, marginRight: 5 }}>{deriveClassify[0]&&deriveClassify[0]['基础库'].reduce((total,item)=>{
                    return total + parseInt(item.totalCount||0)
                },0)}</span>万条
                </div>
                <div style={{ fontSize: '1em', flex: '1 1 auto', textAlign: 'center', lineHeight: '2em' }}>文件<span
                  style={{ fontSize: '1.2em', marginLeft: 5, marginRight: 5 }}>{deriveClassify[0]&&deriveClassify[0]['基础库'].reduce((total,item)=>{
                  return total + parseInt(item.totalCount||0)
                },0)}</span>个
                </div>
                <div style={{ fontSize: '1em', flex: '1 1 auto', textAlign: 'center', lineHeight: '2em' }}>服务<span
                  style={{ fontSize: '1.2em', marginLeft: 5, marginRight: 5 }}>{deriveClassify[0]&&deriveClassify[0]['基础库'].reduce((total,item)=>{
                  return total + parseInt(item.totalCount||0)
                },0)}</span>个
                </div>
              </div>
            </Col>
            <Col xl={4} lg={4} md={4} sm={12} xs={12}
                 className={styles.catlog}>
              <div style={{ height: 210 }}>
                <div className={styles.catlogTitle} style={{ left: 8, marginBottom: 10 }}><span
                  style={{ color: '#fff', fontSize: 12 }}>主题库</span></div>
                <span style={{ marginLeft: 5, color: '#1890ff' }}>数量</span>
                <div style={{
                  fontSize: '1em',
                  flex: '1 1 auto',
                  textAlign: 'center',
                  lineHeight: '2em',
                  marginTop: 10,
                }}>数据库<span
                  style={{ fontSize: '1.2em', marginLeft: 5, marginRight: 5 }}>{deriveClassify[1]&&deriveClassify[1]['主题库'].reduce((total,item)=>{
                  return total + parseInt(item.totalCount||0)
                },0)}</span>万条
                </div>
                <div style={{ fontSize: '1em', flex: '1 1 auto', textAlign: 'center', lineHeight: '2em' }}>文件<span
                  style={{ fontSize: '1.2em', marginLeft: 5, marginRight: 5 }}>{deriveClassify[1]&&deriveClassify[1]['主题库'].reduce((total,item)=>{
                  return total + parseInt(item.totalCount||0)
                },0)}</span>个
                </div>
                <div style={{ fontSize: '1em', flex: '1 1 auto', textAlign: 'center', lineHeight: '2em' }}>服务<span
                  style={{ fontSize: '1.2em', marginLeft: 5, marginRight: 5 }}>{deriveClassify[1]&&deriveClassify[1]['主题库'].reduce((total,item)=>{
                  return total + parseInt(item.totalCount||0)
                },0)}</span>个
                </div>
              </div>
            </Col>
            <Col xl={4} lg={4} md={4} sm={12} xs={12}
                 className={styles.catlog}>
              <div style={{ height: 210 }}>
                <div className={styles.catlogTitle} style={{ left: 8, marginBottom: 10 }}><span
                  style={{ color: '#fff', fontSize: 12 }}>部门库</span></div>
                <span style={{ marginLeft: 5, color: '#1890ff' }}>数量</span>
                <div style={{
                  fontSize: '1em',
                  flex: '1 1 auto',
                  textAlign: 'center',
                  lineHeight: '2em',
                  marginTop: 10,
                }}>数据库<span
                  style={{ fontSize: '1.2em', marginLeft: 5, marginRight: 5 }}>{deriveClassify[2]&&deriveClassify[2]['部门库'].reduce((total,item)=>{
                  return total + parseInt(item.totalCount||0)
                },0)}</span>万条
                </div>
                <div style={{ fontSize: '1em', flex: '1 1 auto', textAlign: 'center', lineHeight: '2em' }}>文件<span
                  style={{ fontSize: '1.2em', marginLeft: 5, marginRight: 5 }}>{deriveClassify[2]&&deriveClassify[2]['部门库'].reduce((total,item)=>{
                  return total + parseInt(item.totalCount||0)
                },0)}</span>个
                </div>
                <div style={{ fontSize: '1em', flex: '1 1 auto', textAlign: 'center', lineHeight: '2em' }}>服务<span
                  style={{ fontSize: '1.2em', marginLeft: 5, marginRight: 5 }}>{deriveClassify[2]&&deriveClassify[2]['部门库'].reduce((total,item)=>{
                  return total + parseInt(item.totalCount||0)
                },0)}</span>个
                </div>
              </div>
            </Col>
            <Col xl={4} lg={4} md={4} sm={12} xs={12}
                 className={styles.catlog}>
              <div style={{ height: 210 }}>
                <div className={styles.catlogTitle} style={{ left: 8, marginBottom: 10 }}><span
                  style={{ color: '#fff', fontSize: 12 }}>其他衍生库</span></div>
                <span style={{ marginLeft: 5, color: '#1890ff' }}>数量</span>
                <div style={{
                  fontSize: '1em',
                  flex: '1 1 auto',
                  textAlign: 'center',
                  lineHeight: '2em',
                  marginTop: 10,
                }}>数据库<span
                  style={{ fontSize: '1.2em', marginLeft: 5, marginRight: 5 }}>{deriveClassify[3]&&deriveClassify[3]['其它衍生库'].reduce((total,item)=>{
                  return total + parseInt(item.totalCount||0)
                },0)}</span>万条
                </div>
                <div style={{ fontSize: '1em', flex: '1 1 auto', textAlign: 'center', lineHeight: '2em' }}>文件<span
                  style={{ fontSize: '1.2em', marginLeft: 5, marginRight: 5 }}>{deriveClassify[3]&&deriveClassify[3]['其它衍生库'].reduce((total,item)=>{
                  return total + parseInt(item.totalCount||0)
                },0)}</span>个
                </div>
                <div style={{ fontSize: '1em', flex: '1 1 auto', textAlign: 'center', lineHeight: '2em' }}>服务<span
                  style={{ fontSize: '1.2em', marginLeft: 5, marginRight: 5 }}>{deriveClassify[3]&&deriveClassify[3]['其它衍生库'].reduce((total,item)=>{
                  return total + parseInt(item.totalCount||0)
                },0)}</span>个
                </div>
              </div>
            </Col>
          </Card>
        </Row>
      </Fragment></PageHeaderLayout>
    );
  }
}
