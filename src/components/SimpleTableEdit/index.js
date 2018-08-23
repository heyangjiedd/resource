import { Table, Input, Button, Popconfirm, Form ,Row,Col,Select} from 'antd';
import React, { Fragment } from 'react';
import SimpleTree from '../SimpleTree';
import moment from 'moment/moment';

const FormItem = Form.Item;
const Option = Select.Option;
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
  }

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
  }

  handleClickOutside = (e) => {
    const { editing } = this.state;
    // if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
    //   this.save(e.target.textContent);
    // }
  }

  save = (value,option) => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values});
    });
  }
  saveCopy = (value,option) => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values,tableId:value,field:option.props.children});
    });
  }
  saveInput = () => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      this.toggleEdit();
      debugger
      handleSave({ ...record, ...values });
    });
  }
  render() {
    const { editing } = this.state;
    const {
      editable,
      dataIndex,
      selectItemFeild,
      title,
      ...restProps
    } = this.props;
    const condition = [{id:'>=',name:'>='},{id:'==',name:'=='},{id:'>',name:'>'},{id:'<',name:'<'},
      {id:'<=',name:'<='},{id:'!=',name:'!='},{id:'null',name:'null'},{id:'包含',name:'包含'},
      {id:'不包含',name:'不包含'},{id:'是',name:'是'},{id:'不是',name:'不是'}];
    const valueType = [{id:'字符串',name:'字符串'},{id:'数组',name:'数组'}];
    let list = title == '字段'?selectItemFeild:title == '条件'?condition:valueType;
    return (
      <td ref={node => (this.cell = node)} {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {(form) => {
              this.form = form;
              return (title == '值'?( (
                  <FormItem style={{ margin: 0 }}>
                    {form.getFieldDecorator(dataIndex, {
                      initialValue: '',
                    })(
                      <Input
                        ref={node => (this.input = node)}
                        onPressEnter={this.saveInput}
                      />
                    )}
                  </FormItem>
                ) ):title == '字段'?(<FormItem style={{ margin: 0 }}>
                  {form.getFieldDecorator(dataIndex, {
                    initialValue: list[0].name,
                  })(<Select placeholder={'请选择'} onSelect={this.saveCopy}>
                    {list.map(item=>{
                      return (
                        <Option title={item.name} value={item.tableId}>{item.name}</Option>
                      )
                    })}
                  </Select>)}
                </FormItem>
              ):(<FormItem style={{ margin: 0 }}>
                    {form.getFieldDecorator(dataIndex, {
                    initialValue: list[0].name,
                    })(<Select placeholder={'请选择'} onSelect={this.save}>
                      {list.map(item=>{
                        return (
                          <Option title={item.name} value={item.name}>{item.name}</Option>
                        )
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
    const {data} = this.props;
    this.state = {
      dataSource: data,
      count:0,
      andOr:'$and'
    };
  }
  handleDelete = (key) => {
    const dataSource = [...this.state.dataSource];
    // this.setState({ dataSource: dataSource.filter(item => !selectedRowKeys.includes(item.key)) });
    this.setState({ dataSource: dataSource.filter(item => item.key !== key.key) });
  }
  deleteAll = ()=>{
    this.setState({ dataSource: [] });
  }
  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key:count,
      field:'',
      condition: '',
      valueType:'',
      value: '',
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  };
  handleSave = (row) => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.props.transMsg(newData,this.state.andOr);
    this.setState({ dataSource: newData });
  };
  save = (text,record)=>{
    debugger
  }
  render() {
    const { selectItemFeild,search } = this.props;
    const {dataSource,andOr} = this.state;
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
    }, {
      title: '条件',
      dataIndex: 'condition',
      editable: true,
    },{
      title: '值类型',
      dataIndex: 'valueType',
      editable: true,
    },{
      title: '值',
      dataIndex: 'value',
      editable: true,
    }, {
      title: '操作',
      render: (text, record, index) => {
        return (
          <Fragment>
            <a onClick={() => {
              this.handleDelete(text)
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
          selectItemFeild:selectItemFeild,
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
            <span>符合</span><Select defaultValue={andOr} placeholder="请选择" style={{ width: 80,marginLeft:10,marginRight:10}}>
            <Option value="$and">全部</Option>
            <Option value="$or">任何</Option>
          </Select><span>以下条件</span>
          </Col>
          <Col md={12} sm={12}>
            <Button size="small" type="primary" style={{ marginRight: 20 }} onClick={this.handleAdd}>
              添加条件
            </Button> <Button size="small" type="danger" style={{ marginRight: 20 }} onClick={this.deleteAll}>
            清除全部
          </Button> <Button size="small" style={{ marginRight: 20 }} onClick={search}>
            查询数据
          </Button>
          </Col>
        </Row>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          pagination={false}
          dataSource={dataSource}
          columns={columns}
        />
      </div>
    );
  }
}

export default EditableTable;
