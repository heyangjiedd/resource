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
  Cascader,
  Steps,
  Radio,
} from 'antd';
import StandardTable from 'components/StandardTable';
import SimpleTree from 'components/SimpleTree';
import TagSelect from 'components/TagSelect';
import StandardFormRow from 'components/StandardFormRow';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ARR from '../../assets/arr';

import styles from './centralDataSource.less';
import { updateresource } from '../../services/api';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const { Option } = Select;
const Step = Steps.Step;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
let listItemData = {};
let createItemData = {};
let createItemDataCascader = [];
let itemDataStatus = 1;

const CreateForm = Form.create()(props => {
  const {
    modalVisible, form, handleAdd, handleModalVisible, handleItem, item, itemSteps, orgList, testBefore, testBeforeText,
    SIDsourceType, onChangeSID,
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
      if (index != 4) {
        if (index == 3) {
          if (createItemData.sourceType === 'mysql' || createItemData.sourceType === 'oracle' || createItemData.sourceType === 'sqlserver'
            || createItemData.sourceType === 'db2') {
            handleItem(11);
          } else if (createItemData.sourceType === 'mongo' || createItemData.sourceType === 'hbase') {
            handleItem(12);
          } else if (createItemData.sourceType === 'http' || createItemData.sourceType === 'https' || createItemData.sourceType === 'wsdl'
            || createItemData.sourceType === 'rest') {
            handleItem(13);
          } else if (createItemData.sourceType === 'ftp' || createItemData.sourceType === 'sftp' || createItemData.sourceType === 'local'
            || createItemData.sourceType === 'share') {
            handleItem(14);
          } else {

          }
        } else {
          if (!createItemData.sourceType) {
            message.warn('选择数据源类型');
            return;
          }
          handleItem(index);
        }
        createItemData = { ...createItemData, ...fieldsValue };
      } else {
        createItemData = { ...createItemData, ...fieldsValue };
        handleAdd(createItemData);
      }
    });
  };
  const test = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      createItemData = { ...createItemData, ...fieldsValue };
      testBefore(createItemData);
    });
  };
  const cancel = () => {
    handleModalVisible();
    let id = createItemData.resourceId;
    createItemDataCascader = [];
    createItemData = { resourceId: id };
    handleItem(1);
  };
  const onChange = (index) => {
    createItemDataCascader = index;
    createItemData.sourceType = index[1];
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
  const firstFooter = (<Row>
    <Col md={24} sm={24}>
      <Button type="primary" onClick={() => {
        exHandle(2);
      }}>
        下一步
      </Button>
      <Button onClick={() => {
        cancel();
      }}>
        取消
      </Button>
    </Col>
  </Row>);
  const secondFooter = (<Row>
    <Col md={24} sm={24}>
      <Button onClick={() => {
        handleItem(1);
        // exHandle(1);
      }}>
        上一步
      </Button>
      <Button type="primary" onClick={() => {
        exHandle(3);
      }}>
        下一步
      </Button>
      <Button onClick={() => {
        cancel();
      }}>
        取消
      </Button>
    </Col>
  </Row>);
  const thirdFooter = (<Row>
    <Col md={24} sm={24}>
      <Button onClick={() => {
        handleItem(2);
      }}>
        上一步
      </Button>
      <Button type="primary" onClick={() => {
        exHandle(4);
      }}>
        提交
      </Button>
      <Button onClick={() => {
        cancel();
      }}>
        取消
      </Button>
    </Col>
  </Row>);
  return (
    <Modal
      title="新增数据源"
      visible={modalVisible}
      footer={item === 1 ? firstFooter : item === 2 ? secondFooter : thirdFooter}
      onOk={okHandle}
      destroyOnClose={true}
      onCancel={cancel}
    >
      <Row>
        <Steps current={itemSteps - 1} labelPlacement={'vertical'}>
          <Step title={'选择数据源类型'}/>
          <Step title={'录入基本信息'}/>
          <Step title={'配置基本参数'}/>
        </Steps>
      </Row>
      {item === 1 ? <div><Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={24} sm={24}>
          <FormItem {...formItemLayout} label="数据源类型"><Cascader style={{ width: 100 + '%' }} options={ARR.CASCADER}
                                                                onChange={onChange}
                                                                defaultValue={createItemDataCascader}
                                                                placeholder="请选择数据源/数据库"/>
          </FormItem>
        </Col></Row></div> : item === 2 ? <div>
        <FormItem {...formItemLayout} label="数据源名称">
          {form.getFieldDecorator('sourceName', {
            rules: [{ required: true, message: '请输入数据源名称.' }],
            initialValue: createItemData.sourceName,
          })(<Input placeholder="请输入数据源名称"/>)}
        </FormItem>
        <FormItem {...formItemLayout} label="所属组织机构">
          {form.getFieldDecorator('orgId', {
            initialValue: createItemData.orgId,
          })(
            <Select placeholder="选择所属组织机构" optionFilterProp={'search'} showSearch={true} style={{ width: '100%' }}>
              {orgList.map(r => {
                return <Option value={r.deptCode} key={r.deptCode + r.deptShortName}
                               search={r.deptShortName}>{r.deptShortName}</Option>;
              })}
            </Select>,
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="资源分类">
          {form.getFieldDecorator('resourceIdName', {
            initialValue: createItemData.resourceIdName,
          })(<Input disabled={true} placeholder="请输入资源分类"/>)}
        </FormItem>
        <FormItem {...formItemLayout} label="数据源描述">
          {form.getFieldDecorator('content', {
            rules: [
              {
                message: '请输入数据源描述',
              },
            ], initialValue: createItemData.content,
          })(
            <TextArea
              style={{ minHeight: 32 }}
              placeholder="请输入你的数据源描述"
              rows={4}
            />,
          )}
        </FormItem>
      </div> : item === 11 ?
        <div>
          <FormItem {...formItemLayout} label="IP地址">
            {form.getFieldDecorator('ip', {
              rules: [{ required: true, message: '请输入IP地址' }], initialValue: createItemData.ip,
            })(<Input placeholder="请输入IP地址"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="端口">
            {form.getFieldDecorator('port', {
              rules: [{ required: true, message: '请输入端口' }],
              initialValue: createItemData.port,
            })(<Input placeholder="请输入端口"/>)}
          </FormItem>
          {createItemData.sourceType === 'oracle' ?
            <div>
              <FormItem {...formItemLayout} label="请选择输入项">
                <RadioGroup onChange={onChangeSID} defaultValue={SIDsourceType}>
                  <Radio value={1} defaultChecked={true}>SID</Radio>
                  <Radio value={2}>数据库名称/服务名称</Radio>
                </RadioGroup>
              </FormItem>
              {SIDsourceType == 1 ? <FormItem {...formItemLayout} label="SID">
                {form.getFieldDecorator('sid', {
                  rules: [{ required: true, message: '请输入SID' }],
                  initialValue: createItemData.sid,
                })(<Input placeholder="请输入SID"/>)}
              </FormItem> : <FormItem {...formItemLayout} label="数据库名称/服务名称">
                {form.getFieldDecorator('dbName', {
                  rules: [{ required: true, message: '请输入数据库名称/服务名称' }],
                  initialValue: createItemData.dbName,
                })(<Input placeholder="请输入数据库名称/服务名称"/>)}
              </FormItem>}</div> :
            <FormItem {...formItemLayout} label="数据库名称/服务名称">
              {form.getFieldDecorator('dbName', {
                rules: [{ required: true, message: '请输入数据库名称/服务名称' }],
                initialValue: createItemData.dbName,
              })(<Input placeholder="请输入数据库名称/服务名称"/>)}
            </FormItem>}
          <FormItem {...formItemLayout} label="数据库版本号">
            {form.getFieldDecorator('dbVersion', {
              rules: [{ required: true, message: '请输入数据库版本号' }],
              initialValue: createItemData.dbVersion,
            })(<Input placeholder="请输入数据库版本号"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="用户名">
            {form.getFieldDecorator('account', {
              rules: [{ required: true, message: '请输入用户名' }],
              initialValue: createItemData.account,
            })(<Input placeholder="请输入用户名"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="密码">
            {form.getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码' }],
              initialValue: createItemData.password,
            })(<Input type='password' placeholder="请输入密码"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="备注">
            {form.getFieldDecorator('bz', {
              rules: [{ message: '请输入备注' }], initialValue: createItemData.bz,
            })(<TextArea rows={4} placeholder="请输入备注"/>)}
          </FormItem>
          <Row>
            <Col>
              <Button onClick={() => {
                test();
              }}>测试连通性</Button>
              <span style={{ marginLeft: 20 }}>{testBeforeText}</span>
            </Col>
          </Row>
        </div> : item === 12 ? <div>
          <FormItem {...formItemLayout} label="IP地址">
            {form.getFieldDecorator('ip', {
              rules: [{ required: true, message: '请输入IP地址' }], initialValue: createItemData.ip,
            })(<Input placeholder="请输入IP地址"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="端口">
            {form.getFieldDecorator('port', {
              rules: [{ required: true, message: '请输入端口' }],
              initialValue: createItemData.port,
            })(<Input placeholder="请输入端口"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="SID">
            {form.getFieldDecorator('sid', {
              rules: [{ required: true, message: '请输入SID' }],
              initialValue: createItemData.sid,
            })(<Input placeholder="请输入SID"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="数据库名称">
            {form.getFieldDecorator('dbName', {
              rules: [{ required: true, message: '请输入数据库名称' }],
              initialValue: createItemData.dbName,
            })(<Input placeholder="请输入数据库名称"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="数据库版本号">
            {form.getFieldDecorator('dbVersion', {
              rules: [{ required: true, message: '请输入数据库版本号' }],
              initialValue: createItemData.dbVersion,
            })(<Input placeholder="请输入数据库版本号"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="用户名">
            {form.getFieldDecorator('account', {
              rules: [{ message: '请输入用户名' }],
              initialValue: createItemData.account,
            })(<Input placeholder="请输入用户名"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="密码">
            {form.getFieldDecorator('password', {
              rules: [{ message: '请输入密码' }],
              initialValue: createItemData.password,
            })(<Input type='password' placeholder="请输入密码"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="备注">
            {form.getFieldDecorator('bz', {
              rules: [{ message: '请输入备注' }], initialValue: createItemData.bz,
            })(<TextArea rows={4} placeholder="请输入备注"/>)}
          </FormItem>
          <Row>
            <Col>
              <Button type="primary" onClick={() => {
                test();
              }}>测试连通性</Button>
              <span style={{ marginLeft: 20 }}>{testBeforeText}</span>
            </Col>
          </Row>
        </div> : item === 13 ? <div>
          <FormItem {...formItemLayout} label="接口(服务)名称">
            {form.getFieldDecorator('interfaceName', {
              rules: [{ required: true, message: '请输入接口(服务)名称' }],
              initialValue: createItemData.interfaceName,
            })(<Input placeholder="请输入接口(服务)名称"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="服务类型">
            {form.getFieldDecorator('serviceType', {
              rules: [{ required: true, message: '请输入服务类型' }],
              initialValue: listItemData.serviceType,
            })(<Input placeholder="请输入服务类型"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="接口地址">
            {form.getFieldDecorator('interfaceUrl', {
              rules: [{ required: true, message: '请输入接口地址' }],
              initialValue: createItemData.interfaceUrl,
            })(<Input placeholder="请输入接口地址"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="接口类型">
            {form.getFieldDecorator('interfaceType', {
              rules: [{ required: true, message: '请输入接口类型' }],
              initialValue: createItemData.interfaceType,
            })(
              <Select key={123} placeholder="选择接口类型" style={{ width: '100%' }}>
                <Option value="get">get</Option>
                <Option value="post">post</Option>
              </Select>,
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="备注">
            {form.getFieldDecorator('bz', {
              rules: [{ message: '请输入备注' }], initialValue: createItemData.bz,
            })(<TextArea rows={4} placeholder="请输入备注"/>)}
          </FormItem>
          <Row>
            <Col>
              <Button type="primary" onClick={() => {
                test();
              }}>测试连通性</Button>
              <span style={{ marginLeft: 20 }}>{testBeforeText}</span>
            </Col>
          </Row>
        </div> : <div>
          <FormItem {...formItemLayout} label="IP地址">
            {form.getFieldDecorator('ip', {
              rules: [{ required: true, message: '请输入IP地址' }], initialValue: createItemData.ip,
            })(<Input placeholder="请输入IP地址"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="用户名">
            {form.getFieldDecorator('account', {
              rules: [{ required: true, message: '请输入用户名' }],
              initialValue: createItemData.account,
            })(<Input placeholder="请输入用户名"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="密码">
            {form.getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码' }],
              initialValue: createItemData.password,
            })(<Input type='password' placeholder="请输入密码"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="根路径">
            {form.getFieldDecorator('path', {
              rules: [{ required: true, message: '请输入根路径' }],
              initialValue: createItemData.path,
            })(<Input placeholder="请输入根路径"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="备注">
            {form.getFieldDecorator('bz', {
              rules: [{ message: '请输入备注' }], initialValue: createItemData.bz,
            })(<TextArea rows={4} placeholder="请输入备注"/>)}
          </FormItem>
          <Row>
            <Col>
              <Button type="primary" onClick={() => {
                test();
              }}>测试连通性</Button>
              <span style={{ marginLeft: 20 }}>{testBeforeText}</span>
            </Col>
          </Row>
        </div>}

    </Modal>
  );
});
const UpdateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, itemDetail } = props;
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
  let title = itemDataStatus === 1 ? '配置详情' : '修改配置';
  const footer = (<Row>
    <Col md={24} sm={24}>
      <Button onClick={() => {
        handleModalVisible(false);
      }}>
        取消
      </Button>
      <Button type="primary" onClick={okHandle}>
        确定
      </Button>
    </Col>
  </Row>);
  if (listItemData.sourceType === 'mysql' || listItemData.sourceType === 'oracle' || listItemData.sourceType === 'sqlserver'
    || listItemData.sourceType === 'db2') {
    listItemData.resourceType = '关系型数据库';
  } else if (listItemData.sourceType === 'mongo' || listItemData.sourceType === 'hbase') {
    listItemData.resourceType = '非关系型数据库';
  } else if (listItemData.sourceType === 'http' || listItemData.sourceType === 'https' || listItemData.sourceType === 'wsdl'
    || listItemData.sourceType === 'rest') {
    listItemData.resourceType = 'API';
  } else if (listItemData.sourceType === 'ftp' || listItemData.sourceType === 'sftp' || listItemData.sourceType === 'local'
    || listItemData.sourceType === 'share') {
    listItemData.resourceType = '普通文件';
  }
  return (
    <Modal
      title={title}
      visible={modalVisible}
      onOk={okHandle}
      footer={itemDataStatus === 1 ? null : footer}
      destroyOnClose={true}
      onCancel={() => handleModalVisible()}
    >
      {
        itemDetail == 1 ? <div>
          <FormItem {...formItemLayout} label="数据源类型">
            {form.getFieldDecorator('sourceType', {
              rules: [{ message: '请输入数据源类型' }], initialValue: listItemData.resourceType,
            })(<Input disabled placeholder="请输入数据源类型"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="数据库类型">
            {form.getFieldDecorator('sourceType', {
              rules: [{ message: '请输入数据库类型' }], initialValue: listItemData.sourceType,
            })(<Input disabled placeholder="请输入数据库类型"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="数据源名称">
            {form.getFieldDecorator('sourceName', {
              rules: [{ required: true, message: '请输入数据源名称' }],
              initialValue: listItemData.sourceName,
            })(<Input disabled={itemDataStatus === 1} placeholder="请输入数据源名称"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="所属组织机构">
            {form.getFieldDecorator('orgIdName', {
              rules: [{ message: '请输入所属组织机构' }],
              initialValue: listItemData.orgIdName,
            })(<Input disabled={true} placeholder="请输入所属组织机构"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="资源分类">
            {form.getFieldDecorator('resourceIdName', {
              initialValue: listItemData.resourceIdName,
            })(<Input disabled={true} placeholder="请输入资源分类"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="IP地址">
            {form.getFieldDecorator('ip', {
              rules: [{ required: true, message: '请输入IP地址' }], initialValue: listItemData.ip,
            })(<Input disabled={itemDataStatus === 1} placeholder="请输入IP地址"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="端口">
            {form.getFieldDecorator('port', {
              rules: [{ required: true, message: '请输入...' }], initialValue: listItemData.port,
            })(<Input disabled={itemDataStatus === 1} placeholder="请输入"/>)}
          </FormItem>
          {
            listItemData.sourceType!=='oracle'||listItemData.dbName? <FormItem {...formItemLayout} label="数据库名称/SID">
              {form.getFieldDecorator('dbName', {
                rules: [{ required: true, message: '请输入数据库名称/SID' }], initialValue: listItemData.dbName,
              })(<Input disabled={itemDataStatus === 1} placeholder="请输入数据库名称/SID"/>)}
            </FormItem>:<FormItem {...formItemLayout} label="数据库名称/SID">
              {form.getFieldDecorator('sid', {
                rules: [{ required: true, message: '请输入数据库名称/SID' }], initialValue: listItemData.sid,
              })(<Input disabled={itemDataStatus === 1} placeholder="请输入数据库名称/SID"/>)}
            </FormItem>
          }
          <FormItem {...formItemLayout} label="用户名">
            {form.getFieldDecorator('account', {
              rules: [{ required: true, message: '请输入用户名' }],
              initialValue: listItemData.account,
            })(<Input disabled={itemDataStatus === 1} placeholder="请输入用户名"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="密码">
            {form.getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码' }],
              initialValue: listItemData.password,
            })(<Input type='password' disabled={itemDataStatus === 1} placeholder="请输入密码"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="数据源描述">
            {form.getFieldDecorator('content', {
              rules: [
                {
                  message: '请输入数据源描述',
                },
              ], initialValue: listItemData.content,
            })(
              <TextArea
                disabled={itemDataStatus === 1}
                style={{ minHeight: 32 }}
                placeholder="请输入你的数据源描述"
                rows={4}
              />,
            )}
          </FormItem>
        </div> : itemDetail == 2 ? <div>
          <FormItem {...formItemLayout} label="数据源类型">
            {form.getFieldDecorator('sourceType', {
              rules: [{ message: '请输入数据源类型' }], initialValue: listItemData.resourceType,
            })(<Input disabled placeholder="请输入数据源类型"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="数据库类型">
            {form.getFieldDecorator('sourceType', {
              rules: [{ message: '请输入数据库类型' }], initialValue: listItemData.sourceType,
            })(<Input disabled placeholder="请输入数据库类型"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="数据源名称">
            {form.getFieldDecorator('sourceName', {
              rules: [{ required: true, message: '请输入数据源名称' }],
              initialValue: listItemData.sourceName,
            })(<Input disabled={itemDataStatus === 1} placeholder="请输入数据源名称"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="所属组织机构">
            {form.getFieldDecorator('orgIdName', {
              rules: [{ message: '请输入所属组织机构' }],
              initialValue: listItemData.orgIdName,
            })(<Input disabled={true} placeholder="请输入所属组织机构"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="资源分类">
            {form.getFieldDecorator('resourceIdName', {
              initialValue: listItemData.resourceIdName,
            })(<Input disabled={true} placeholder="请输入资源分类"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="IP地址">
            {form.getFieldDecorator('ip', {
              rules: [{ required: true, message: '请输入IP地址' }], initialValue: listItemData.ip,
            })(<Input disabled={itemDataStatus === 1} placeholder="请输入IP地址"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="端口">
            {form.getFieldDecorator('port', {
              rules: [{ required: true, message: '请输入端口' }], initialValue: listItemData.port,
            })(<Input disabled={itemDataStatus === 1} placeholder="请输入端口"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="数据库名称/SID">
            {form.getFieldDecorator('dbName', {
              rules: [{ required: true, message: '请输入数据库名称/SID' }], initialValue: listItemData.dbName,
            })(<Input disabled={itemDataStatus === 1} placeholder="请输入数据库名称/SID"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="用户名">
            {form.getFieldDecorator('account', {
              rules: [{ message: '请输入用户名' }],
              initialValue: listItemData.account,
            })(<Input disabled={itemDataStatus === 1} placeholder="请输入用户名"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="密码">
            {form.getFieldDecorator('password', {
              rules: [{ message: '请输入密码' }],
              initialValue: listItemData.password,
            })(<Input type='password' disabled={itemDataStatus === 1} placeholder="请输入密码"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="数据源描述">
            {form.getFieldDecorator('content', {
              rules: [
                {
                  message: '请输入数据源描述',
                },
              ], initialValue: listItemData.content,
            })(
              <TextArea
                disabled={itemDataStatus === 1}
                style={{ minHeight: 32 }}
                placeholder="请输入你的数据源描述"
                rows={4}
              />,
            )}
          </FormItem>
        </div> : itemDetail == 3 ? <div>
          <FormItem {...formItemLayout} label="数据源类型">
            {form.getFieldDecorator('sourceType', {
              rules: [{ message: 'Please input some description...' }], initialValue: listItemData.resourceType,
            })(<Input disabled placeholder="请输入"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="API类型">
            {form.getFieldDecorator('sourceType', {
              rules: [{ message: 'Please input some description...' }], initialValue: listItemData.sourceType,
            })(<Input disabled placeholder="请输入"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="数据源名称">
            {form.getFieldDecorator('sourceName', {
              rules: [{ required: true, message: '请输入数据源名称' }],
              initialValue: listItemData.sourceName,
            })(<Input disabled={itemDataStatus === 1} placeholder="请输入数据源名称"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="所属组织机构">
            {form.getFieldDecorator('orgIdName', {
              rules: [{ message: 'Please input some description...' }],
              initialValue: listItemData.orgIdName,
            })(<Input disabled={true} placeholder="请输入"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="资源分类">
            {form.getFieldDecorator('resourceIdName', {
              initialValue: listItemData.resourceIdName,
            })(<Input disabled={true} placeholder="请输入"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="服务类型">
            {form.getFieldDecorator('serviceType', {
              rules: [{ required: true, message: '请输入服务类型' }],
              initialValue: listItemData.serviceType,
            })(<Input disabled={itemDataStatus === 1} placeholder="请输入服务类型"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="接口名称">
            {form.getFieldDecorator('interfaceName', {
              rules: [{ required: true, message: '请输入接口名称' }],
              initialValue: listItemData.interfaceName,
            })(<Input disabled={itemDataStatus === 1} placeholder="请输入接口名称"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="接口地址">
            {form.getFieldDecorator('interfaceUrl', {
              rules: [{ required: true, message: '请输入接口地址' }],
              initialValue: listItemData.interfaceUrl,
            })(<Input disabled={itemDataStatus === 1} placeholder="请输入接口地址"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="接口类型">
            {form.getFieldDecorator('interfaceType', {
              rules: [{ required: true, message: '请输入接口类型' }],
              initialValue: listItemData.interfaceType,
            })(<Input disabled={itemDataStatus === 1} placeholder="请输入接口类型"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="数据源描述">
            {form.getFieldDecorator('content', {
              rules: [
                {
                  message: '请输入数据源描述',
                },
              ], initialValue: listItemData.content,
            })(
              <TextArea
                disabled={itemDataStatus === 1}
                style={{ minHeight: 32 }}
                placeholder="请输入你的数据源描述"
                rows={4}
              />,
            )}
          </FormItem>
        </div> : <div>
          <FormItem {...formItemLayout} label="数据源类型">
            {form.getFieldDecorator('sourceType', {
              rules: [{ message: 'Please input some description...' }], initialValue: listItemData.resourceType,
            })(<Input disabled placeholder="请输入数据源类型"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="文件类型">
            {form.getFieldDecorator('sourceType', {
              rules: [{ message: '请输入文件类型' }], initialValue: listItemData.sourceType,
            })(<Input disabled placeholder="请输入文件类型"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="数据源名称">
            {form.getFieldDecorator('sourceName', {
              rules: [{ required: true, message: '请输入数据源名称' }],
              initialValue: listItemData.sourceName,
            })(<Input disabled={itemDataStatus === 1} placeholder="请输入数据源名称"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="所属组织机构">
            {form.getFieldDecorator('orgIdName', {
              rules: [{ message: 'Please input some description...' }],
              initialValue: listItemData.orgIdName,
            })(<Input disabled={true} placeholder="请输入"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="资源分类">
            {form.getFieldDecorator('resourceIdName', {
              initialValue: listItemData.resourceIdName,
            })(<Input disabled={true} placeholder="请输入"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="系统名称">
            {form.getFieldDecorator('namespace', {
              initialValue: listItemData.namespace,
            })(<Input disabled={true} placeholder="请输入"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="IP地址">
            {form.getFieldDecorator('ip', {
              rules: [{ required: true, message: '请输入IP地址' }], initialValue: listItemData.ip,
            })(<Input disabled={itemDataStatus === 1} placeholder="请输入IP地址"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="用户名">
            {form.getFieldDecorator('account', {
              rules: [{ required: true, message: '请输入用户名' }],
              initialValue: listItemData.account,
            })(<Input disabled={itemDataStatus === 1} placeholder="请输入用户名"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="密码">
            {form.getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码' }],
              initialValue: listItemData.password,
            })(<Input type='password' disabled={itemDataStatus === 1} placeholder="请输入密码"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="根路径">
            {form.getFieldDecorator('path', {
              initialValue: listItemData.path,
            })(<Input disabled={true} placeholder="请输入根路径"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="数据源描述">
            {form.getFieldDecorator('content', {
              rules: [
                {
                  message: '请输入数据源描述',
                },
              ], initialValue: listItemData.content,
            })(
              <TextArea
                disabled={itemDataStatus === 1}
                style={{ minHeight: 32 }}
                placeholder="请输入你的数据源描述"
                rows={4}
              />,
            )}
          </FormItem>
        </div>
      }
    </Modal>
  );
});
const TestForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, selectedRows, testHandleAdd, testList, handleModalVisible } = props;
  let percent = parseInt((testList.length / selectedRows.length) * 100);
  return (
    <Modal
      title="测试连通性"
      visible={modalVisible}
      onOk={() => handleModalVisible()}
      destroyOnClose={true}
      onCancel={() => handleModalVisible()}
    >
      <span>{testList.length == selectedRows.length ? '测试完毕' : '测试中...'}</span>
      <Row>
        <Progress percent={percent}/>
      </Row>
      <Row>
        <Col xl={16} lg={12} md={12} sm={24} xs={24}>
          <div>
            测试连通：<span style={{ color: 'green', marginLeft: '10px' }}>{testList.filter(item => {
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
      <Row style={{ marginTop: 10 }}>
        <Col xl={16} lg={12} md={12} sm={24} xs={24}>
          <Button onClick={testHandleAdd}>重试</Button>
        </Col>
      </Row>
    </Modal>
  );
});
@connect(({ centersource, classify, loading }) => ({
  centersource,
  classify,
  loading: loading.models.centersource,
}))
@Form.create()
export default class ResourceClassify extends PureComponent {
  state = {
    modalVisible: false,
    testModalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {
      api: [],
      file: [],
      relationDb: [],
      unrelationDb: [],
    },
    listItemData: {},
    testList: [],
    testSuccess: 0,
    testFail: 0,
    item: 1,
    itemDetail: 1,
    testBeforeText: '',
    itemSteps: 1,
    SIDsourceType: 1,
  };

  componentWillUnmount() {
    listItemData = {};
    createItemData = {};
    createItemDataCascader = [];
    itemDataStatus = 1;
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'centersource/fetchOrgList',
      callback: () => {
        dispatch({
          type: 'classify/tree',
          callback: () => {
            dispatch({
              type: 'centersource/fetch',
            });
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

    dispatch({
      type: 'centersource/fetch',
      payload: params,
    });
  };
  handleItem = (index) => {
    this.setState({
      item: index,
    });
    this.setState({
      itemSteps: index > 2 ? 3 : index,
    });
  };
  onChangeSID = (index) => {
    this.setState({
      SIDsourceType: index.target.value,
    });
  };
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {
        api: [],
        file: [],
        relationDb: [],
        unrelationDb: [],
      },
    });
    dispatch({
      type: 'centersource/fetch',
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

      this.setState({
        formValues: values,
      });
      if (values.relationDb && values.relationDb.length > 0) {
        values.relationDb = values.relationDb.join(',');
      }
      if (values.unrelationDb && values.unrelationDb.length > 0) {
        values.unrelationDb = values.unrelationDb.join(',');
      }
      if (values.api && values.api.length > 0) {
        values.api = values.api.join(',');
      }
      if (values.file && values.file.length > 0) {
        values.file = values.file.join(',');
      }
      dispatch({
        type: 'centersource/fetch',
        payload: values,
      });
    });
  };
  handleModalVisible = flag => {
    this.setState({ testBeforeText: '' });
    if (!createItemData.resourceId) {
      message.error('请先选择资源分类');
      return;
    }
    const {
      classify: { treeData },
    } = this.props;
    let classfy = treeData.filter(r => {
      return createItemData.resourceId == r.id;
    });
    createItemData.resourceIdName = classfy[0] && classfy[0].name;
    this.setState({
      modalVisible: !!flag,
    });
  };
  testHandleModalVisible = flag => {
    this.setState({
      testModalVisible: !!flag,
    });
  };
  updateHandleModalVisible = flag => {
    this.setState({
      updateModalVisible: !!flag,
    });
  };
  updateHandleModal = (item, index) => {
    const {
      centersource: { orgList },
      classify: { treeData },
    } = this.props;
    listItemData = item;
    let org = orgList.filter(r => {
      return item.orgId == r.deptCode;
    });
    let classfy = treeData.filter(r => {
      return item.resourceId == r.id;
    });
    listItemData.resourceIdName = classfy[0] && classfy[0].name;
    listItemData.orgIdName = org[0] && org[0].deptShortName;
    itemDataStatus = index;
    if (item.sourceType == 'mysql' || item.sourceType == 'oracle' || item.sourceType == 'sqlserver' ||
      item.sourceType == 'db2') {
      this.setState({
        itemDetail: index,
      });
    } else if (item.sourceType == 'mongo' || item.sourceType == 'hbase') {
      this.setState({
        itemDetail: 2,
      });
    } else if (item.sourceType == 'http' || item.sourceType == 'https' || item.sourceType == 'wsdl' ||
      item.sourceType == 'rest') {
      this.setState({
        itemDetail: 3,
      });
    } else if (item.sourceType == 'ftp' || item.sourceType == 'sftp' || item.sourceType == 'local' ||
      item.sourceType == 'share') {
      this.setState({
        itemDetail: 4,
      });
    }
    this.setState({
      updateModalVisible: true,
    });
  };
  handleSync = () => {
    const { dispatch } = this.props;
    if (this.state.selectedRows.length > 0) {
      this.state.selectedRows.forEach((item, index) => {
        if (index === this.state.selectedRows.length - 1) {
          dispatch({
            type: 'centersource/sync',
            payload: {
              dataSource: {
                id: item.id,
              },
            }, callback: () => {
              message.success('同步成功');
              this.setState({
                selectedRows: [],
              });
              dispatch({
                type: 'centersource/fetch',
              });
            },
          });
        } else {
          dispatch({
            type: 'centersource/sync',
            payload: {
              dataSource: {
                id: item.id,
              },
            },
          });
        }
      });
    } else {
      message.error('请先选择数据');
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
                type: 'centersource/remove',
                payload: {
                  id: item.id,
                }, callback: () => {
                  message.success('删除成功');
                  this.setState({
                    selectedRows: [],
                  });
                  dispatch({
                    type: 'centersource/fetch',
                  });
                },
              });
            } else {
              dispatch({
                type: 'centersource/remove',
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
  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'centersource/add',
      payload: fields,
      callback: () => {
        message.success('添加成功');
        let id = createItemData.resourceId;
        createItemData = { resourceId: id };
        this.handleItem(1);
        this.setState({
          modalVisible: false,
        });
        dispatch({
          type: 'centersource/fetch',
        });
      },
    });
  };
  testBefore = fields => {
    const { dispatch } = this.props;
    this.setState({ testBeforeText: '' });
    dispatch({
      type: 'centersource/testBefore',
      payload: fields,
      callback: (res) => {
        if (res == true) {
          createItemData.linkStatus = 'on';
          this.setState({ testBeforeText: '连通性测试通过' });
        } else {
          createItemData.linkStatus = 'off';
          this.setState({ testBeforeText: '连通性测试不通过' });
        }
      },
    });
  };
  testHandleAdd = fields => {
    const { dispatch } = this.props;
    if (this.state.selectedRows.length <= 0) {
      message.error('请先选择数据');
      return;
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
  updateHandleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'centersource/update',
      payload: { ...listItemData, ...fields },
      callback: () => {
        dispatch({
          type: 'centersource/fetch',
        });
      },
    });
    message.success('修改成功');
    this.setState({
      updateModalVisible: false,
    });
  };

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 2, lg: 6, xl: 12 }}>
          <Col md={8} sm={24}>
            <FormItem label="连通状态">
              {getFieldDecorator('linkStatus')(
                <Select placeholder="连通状态" style={{ width: '100%' }}>
                  <Option value="on">已连通</Option>
                  <Option value="off">未连通</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="数据源名称">
              {getFieldDecorator('sourceName')(<Input placeholder="请输入数据源名称"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
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
    const { formValues } = this.state;
    const { getFieldDecorator } = form;
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
      <Form onSubmit={this.handleSearch}>
        <Row gutter={{ md: 2, lg: 6, xl: 12 }}>
          <Col md={8} sm={24}>
            <FormItem label="连通状态">
              {getFieldDecorator('linkStatus')(
                <Select placeholder="连通状态" style={{ width: '100%' }}>
                  <Option value="on">已连通</Option>
                  <Option value="off">未连通</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="数据源名称">
              {getFieldDecorator('sourceName')(<Input placeholder="请输入数据源名称"/>)}
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
              收起 <Icon type="up"/>
            </a>
            </span>
          </Col>
        </Row>
          <Row gutter={{ md: 2, lg: 6, xl: 12 }}>
            <StandardFormRow block style={{ paddingBottom: 5 }}>
              <FormItem {...formItemLayout} label="关系型数据库" style={{ marginBottom: 0 }}>
                {getFieldDecorator('relationDb', { initialValue: formValues.relationDb })(
                  <TagSelect onChange={this.handleFormSubmit} value={formValues.relationDb}>
                    <TagSelect.Option value="mysql">mysql</TagSelect.Option>
                    <TagSelect.Option value="oracle">oracle</TagSelect.Option>
                    <TagSelect.Option value="sqlserver">sqlserver</TagSelect.Option>
                    <TagSelect.Option value="db2">db2</TagSelect.Option>
                  </TagSelect>,
                )}
              </FormItem>
            </StandardFormRow>
          </Row>
          <Row gutter={{ md: 2, lg: 6, xl: 12 }}>
            <StandardFormRow block style={{ paddingBottom: 5 }}>
              <FormItem {...formItemLayout} label="非关系型数据库" style={{ marginBottom: 0 }}>
                {getFieldDecorator('unrelationDb', { initialValue: formValues.unrelationDb })(
                  <TagSelect onChange={this.handleFormSubmit} value={formValues.unrelationDb}>
                    <TagSelect.Option value="mongo">MongoDB</TagSelect.Option>
                    <TagSelect.Option value="hbase">hbase</TagSelect.Option>
                  </TagSelect>,
                )}
              </FormItem>
            </StandardFormRow>
          </Row>
          <Row gutter={{ md: 2, lg: 6, xl: 12 }} >
            <StandardFormRow block style={{ paddingBottom: 5 }}>
              <FormItem {...formItemLayout} label="API" style={{ marginBottom: 0 }} value={formValues.relationDb}>
                {getFieldDecorator('api', { initialValue: formValues.relationDb })(
                  <TagSelect onChange={this.handleFormSubmit}>
                    <TagSelect.Option value="http">http</TagSelect.Option>
                    <TagSelect.Option value="https">https</TagSelect.Option>
                    <TagSelect.Option value="wsdl">wsdl</TagSelect.Option>
                    <TagSelect.Option value="rest">rest</TagSelect.Option>
                  </TagSelect>,
                )}
              </FormItem>
            </StandardFormRow>
          </Row>
          <Row gutter={{ md: 2, lg: 6, xl: 12 }} >
            <StandardFormRow block style={{ paddingBottom: 5 }}>
              <FormItem {...formItemLayout} label="普通文件系统" style={{ marginBottom: 0 }}>
                {getFieldDecorator('file', { initialValue: formValues.file })(
                  <TagSelect onChange={this.handleFormSubmit} value={formValues.file}>
                    <TagSelect.Option value="ftp">ftp</TagSelect.Option>
                    <TagSelect.Option value="sftp">sftp</TagSelect.Option>
                    <TagSelect.Option value="local">本地磁盘</TagSelect.Option>
                    <TagSelect.Option value="share">共享文件</TagSelect.Option>
                  </TagSelect>,
                )}
              </FormItem>
            </StandardFormRow>
          </Row>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  handleTree = data => {
    const { dispatch } = this.props;
    createItemData.resourceId = data[0];
    dispatch({
      type: 'centersource/fetch',
      payload: { resourceId: createItemData.resourceId },
    });
  };

  render() {
    const {
      centersource: { data, orgList },
      classify: { treeData },
      loading,
    } = this.props;
    const { selectedRows,SIDsourceType, testList, modalVisible, testModalVisible, updateModalVisible, listItemData, item, itemSteps, itemDetail, testBeforeText } = this.state;

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
      },
      {
        title: '所属组织机构',
        width: '150px',
        dataIndex: 'orgId',
        render(val) {
          let org = orgList.filter(r => {
            return val == r.deptCode;
          });
          return <span>{org[0] && org[0].deptShortName}</span>;
        },
      },
      {
        title: '所属资源分类',
        width: '150px',
        dataIndex: 'resourceId',
        render(val) {
          let classfy = treeData.filter(r => {
            return val == r.id;
          });
          return <span>{classfy[0] && classfy[0].name}</span>;
        },
      },
      {
        title: '最近连接时间',
        width: '170px',
        sorter: true,
        dataIndex: 'createTime',
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '-'}</span>,
      },
      {
        title: '连通状态',
        width: '120px',
        dataIndex: 'linkStatus',
        render(val) {
          return <Badge status={val == 'on' ? 'success' : 'error'} text={val == 'on' ? '连通' : '未连通'}/>;
        },
      },
      {
        title: '操作',
        width: '150px',
        render: (text, record, index) => {
          return (
            <Fragment>
              <a onClick={() => {
                this.updateHandleModal(text, 1);
              }}>配置详情</a>
              <Divider type="vertical"/>
              <a onClick={() => {
                this.updateHandleModal(text, 2);
              }}>修改配置</a>
            </Fragment>
          );
        },
      },
    ];

    const parentMethods = {
      handleAdd: this.handleAdd,
      testBefore: this.testBefore,
      testBeforeText: testBeforeText,
      handleModalVisible: this.handleModalVisible,
      orgList: orgList,
      handleItem: this.handleItem,
      item: item,
      SIDsourceType:SIDsourceType,
      onChangeSID:this.onChangeSID,
      itemSteps: itemSteps,
    };
    const testParentMethods = {
      handleAdd: this.testHandleAdd,
      handleModalVisible: this.testHandleModalVisible,
      selectedRows: selectedRows,
      testHandleAdd: this.testHandleAdd,
      testList: testList,
    };
    const updateParentMethods = {
      handleAdd: this.updateHandleAdd,
      itemDetail: itemDetail,
      handleModalVisible: this.updateHandleModalVisible,
    };
    return (
      <PageHeaderLayout>
        <div className={styles.flexMain}>
          <SimpleTree
            data={treeData}
            handleTree={this.handleTree}
            title={'资源分类'}
          />
          <Card bordered={false} className={styles.flexTable}>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                  新建数据源
                </Button>
                <Button icon="desktop" type="primary" onClick={() => this.testHandleAdd(true)}>
                  测试连通性
                </Button>
                <Button icon="reload" type="primary" onClick={() => this.handleSync()}>
                  同步数据源
                </Button>
                <Button icon="delete" onClick={() => this.handleDelete(true)}>
                  批量删除
                </Button>
              </div>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
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
        <TestForm {...testParentMethods} modalVisible={testModalVisible}/>
        <UpdateForm {...updateParentMethods} modalVisible={updateModalVisible}/>
        <CreateForm {...parentMethods} modalVisible={modalVisible}/>
      </PageHeaderLayout>
    );
  }
}
