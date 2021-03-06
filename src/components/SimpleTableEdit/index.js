import { Table, Input, Button, Popconfirm, Form, Row, Col, Select, message } from 'antd';
import React, { Fragment } from 'react';
import SimpleTree from '../SimpleTree';
import moment from 'moment/moment';
import DescriptionList from 'components/DescriptionList';

const FormItem = Form.Item;
const Option = Select.Option;
const { Description } = DescriptionList;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  componentDidMount() {
    if (this.props.editable) {
      document.addEventListener('click', this.handleClickOutside, true);
    }
  }

  componentWillUnmount() {
    if (this.props.editable) {
      document.removeEventListener('click', this.handleClickOutside, true);
    }
  }

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      // if (editing) {
      //   this.input.focus();
      // }
    });
  };

  handleClickOutside = (e) => {
    const { editing } = this.state;
    // if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
    //   this.save(e.target.textContent);
    // }
  };

  save = (value, option) => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values,valueType:value });
    });
  };
  savecondition = (value, option) => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values,condition:value });
    });
  };
  saveCopy = (value, option) => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values, tableId: option.props.tableId, field: option.props.title });
    });
  };
  saveInput = () => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  render() {
    const { editing } = this.state;
    const {
      editable,
      dataIndex,
      selectItemFeild,
      title,
      ...restProps
    } = this.props;
    const condition = [{ id: '$gte', name: '>=' }, { id: '$eq', name: '==' }, { id: '$gt', name: '>' }, {
      id: '$lt',
      name: '<',
    },
      { id: '$lte', name: '<=' }, { id: '$ne', name: '!=' }, { id: '$null', name: 'null' }, { id: '$in', name: '包含' },
      { id: '$nin', name: '不包含' }, { id: '$and', name: '是' }, { id: '$or', name: '不是' }];
    const valueType = [{ id: '字符串', name: '字符串' }, { id: '数组', name: '数组' }];
    let list = title == '字段' ? selectItemFeild : title == '条件' ? condition : valueType;
    return (
      <td ref={node => (this.cell = node)} {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {(form) => {
              this.form = form;
              return (title == '值' ? ((
                <FormItem style={{ margin: 0 }}>
                  {form.getFieldDecorator(dataIndex, {
                    initialValue: '',
                  })(
                    <Input style={{width:'100%'}}
                      ref={node => (this.input = node)}
                      onBlur={this.saveInput}
                    />,
                  )}
                </FormItem>
              )) : title == '字段' ? (<FormItem style={{ margin: 0 }}>
                  {form.getFieldDecorator(dataIndex)(<Select placeholder={'请选择'} style={{width:120}} onSelect={this.saveCopy}>
                    {list.map(item => {
                      return (
                        <Option title={item.name} key={item.id} tableId={item.tableId} value={item.name}>{item.name}</Option>
                      );
                    })}
                  </Select>)}
                </FormItem>
              ) : title == '条件' ?(<FormItem style={{ margin: 0 }}>
                  {form.getFieldDecorator(dataIndex)(<Select style={{width:'100%'}} placeholder={'请选择'} onSelect={this.savecondition}>
                    {list.map(item => {
                      return (
                        <Option title={item.name} key={item.id} value={item.id}>{item.name}</Option>
                      );
                    })}
                  </Select>)}
                </FormItem>
              ):(<FormItem style={{ margin: 0 }}>
                  {form.getFieldDecorator(dataIndex)(<Select style={{width:'100%'}} placeholder={'请选择'} onSelect={this.save}>
                    {list.map(item => {
                      return (
                        <Option title={item.name} key={item.id} value={item.id}>{item.name}</Option>
                      );
                    })}
                  </Select>)}
                </FormItem>
              ));
            }}
          </EditableContext.Consumer>
        ) : restProps.children}
      </td>
    );
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    const { data } = this.props;
    this.state = {
      dataSource: data,
      count: 0,
      andOr: '$and',
      description:'',
    };
  }

  handleDelete = (key) => {
    const dataSource = [...this.state.dataSource];
    // this.setState({ dataSource: dataSource.filter(item => !selectedRowKeys.includes(item.key)) });
    this.setState({ dataSource: dataSource.filter(item => item.key !== key.key) });
  };
  deleteAll = () => {
    this.setState({ dataSource: [] });
  };
  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      field: '',
      condition: '',
      valueType: '',
      value: '',
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  }
  handleSave = (row) => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    // this.props.transMsg(newData, this.state.andOr);
    this.setState({ dataSource: newData });
  }
  searchhandle = ()=>{
    const { selectItemFeild, search } = this.props;
    const { dataSource, andOr } = this.state;
    console.log( dataSource );
    let validSearch = false;
    const arr = dataSource.map(item =>{
      let str = '';
      switch (item.condition) {
        case '$gte':str = '大于等于';break;
        case '$eq':str = '等于';break;
        case '$gt':str = '大于';break;
        case '$lt':str = '小于';break;
        case '$lte':str = '小于登录';break;
        case '$ne':str = '不等于';break;
        case '$null':str = '空';break;
        case '$in':str = '包含';break;
        case '$nin':str = '不包含';break;
        case '$and':str = '是';break;
        case '$or':str = '不是';break;
      }
      if( item.field !== '' && str !== '' && item.value !== '' ) {
        validSearch = true;
        return '"' + item.field + '"' + str + '"' + item.value + '"'
      } else {
        return '';
      }
    })

    //去掉空
    let newDataSource = [];
    for( let i=0; i<dataSource.length; i++ ) {
      let item = dataSource[i];
      if( item.field !== '' && item.condition !== '' && item.value !== '' ) {
        newDataSource.push(item);
      }
    }

    if( validSearch || dataSource.length == 0 ) {
      let description = arr.join('，' + (andOr == '$and' ? '全部' : '任何') + '，')
      this.setState({ description: description });
      search(newDataSource, andOr);
    } else {
      message.error("请完善条件内容");
    }
  }

  save = (text, record) => {
    debugger;
  };
  componentDidMount(){
    const {  search } = this.props;
    const { dataSource, andOr } = this.state;
    search(dataSource, andOr)
  }
  onSelect = (index)=>{
    this.setState({ andOr:index });
  }
  render() {
    const { selectItemFeild, search } = this.props;
    const { dataSource, andOr,description } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    this.columns = [
      {
        title: '字段',
        dataIndex: 'field',
        editable: true,
        width: '20%',
      }, {
        title: '条件',
        dataIndex: 'condition',
        editable: true,
        width: '20%',
      }, {
        title: '值类型',
        dataIndex: 'valueType',
        editable: true,
        width: '20%',
      }, {
        title: '值',
        dataIndex: 'value',
        editable: true,
        width: '20%',
      }, {
        title: '操作',
        width:'20%',
        render: (text, record, index) => {
          return (
            <Fragment>
              <a onClick={() => {
                this.handleDelete(text);
              }}>删除</a>
            </Fragment>
          );
        },
      },
    ];
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          selectItemFeild: selectItemFeild,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
        <Row>
          <Col md={12} sm={12}>
            <span>符合</span>
            <Select onSelect={this.onSelect} defaultValue={andOr} placeholder="请选择"
                                   style={{ width: 80, marginLeft: 10, marginRight: 10 }}>
            <Option value="$and">全部</Option>
            <Option value="$or">任何</Option>
          </Select><span>以下条件</span>
          </Col>
          <Col md={12} sm={12}>
            <Button size="small" type="primary" style={{ marginRight: 20 }} onClick={this.handleAdd}>
              添加条件
            </Button> <Button size="small" type="danger" style={{ marginRight: 20 }} onClick={this.deleteAll}>
            清除全部
          </Button> <Button size="small" style={{ marginRight: 20 }} onClick={this.searchhandle}>
            查询数据
          </Button>
          </Col>
        </Row>
        <Table
          components={components}
          size='small'
          rowKey={'key'}
          rowClassName={() => 'editable-row'}
          pagination={false}
          dataSource={dataSource}
          columns={columns}
        />
        <DescriptionList size="large" col={1} title="描述" style={{ marginBottom: 32 ,marginTop:32}}>
          <Description>{description}</Description>
        </DescriptionList>
      </div>
    );
  }
}

export default EditableTable;
