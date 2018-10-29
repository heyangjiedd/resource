import { Table, Input, Button, Popconfirm, Form, Row, Select } from 'antd';
import SimpleTree from '../SimpleTree';
import moment from 'moment/moment';
import { message } from 'antd/lib/index';

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
    selectListName1: [],
    selectListFeild1: [],
    selectListName2: [],
    selectListFeild2: [],
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
    const { allData } = this.props;
    // selectListName1:[],
    //   selectListFeild1:[],
    //   selectListName2:[],
    //   selectListFeild2:[],
    // if (dataIndex == 'feils1') {
    //   list = allData.filter(item => {
    //     return record.name1 = item.id;
    //   })[0].selectArray;
    // }
    // if (dataIndex == 'feils2') {
    //   list = allData.filter(item => {
    //     return record.name2 = item.id;
    //   })[0].selectArray;
    // }
    this.setState({ editing, selectList: allData }, () => {
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
      for (let i in values) {
        values[i] = value;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  render() {
    // selectListName1:[],
    //   selectListFeild1:[],
    //   selectListName2:[],
    //   selectListFeild2:[],
    const { editing, selectListName1, selectListFeild1, selectListName2, selectListFeild2 } = this.state;
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      allData,
      ...restProps
    } = this.props;
    let list = allData;

    return (
      <td ref={node => (this.cell = node)} {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {(form) => {
              this.form = form;
              return (
                !editing ? (
                  <div
                    className="editable-cell-value-wrap"
                    style={{ paddingRight: 24 }}
                    onClick={this.toggleEdit}
                  >
                    {restProps.children}
                  </div>
                ) : dataIndex == 'name1' ? (
                  <FormItem style={{ margin: 0 }}>
                    {form.getFieldDecorator(dataIndex, {})(<Select style={{ width: '100%' }} placeholder={'请选择'}
                                                                   onSelect={this.save}>
                      {selectListName1.map(item => {
                        return (
                          <Option title={item.name} key={item.id} value={item.id}>{item.name}</Option>
                        );
                      })}
                    </Select>)}
                  </FormItem>
                ) : dataIndex == 'feils1' ? (
                  <FormItem style={{ margin: 0 }}>
                    {form.getFieldDecorator(dataIndex, {})(<Select style={{ width: '100%' }} placeholder={'请选择'}
                                                                   onSelect={this.save}>
                      {selectListFeild1.map(item => {
                        return (
                          <Option title={item.name} key={item.id} value={item.id}>{item.name}</Option>
                        );
                      })}
                    </Select>)}
                  </FormItem>
                ) : dataIndex == 'name2' ? (
                  <FormItem style={{ margin: 0 }}>
                    {form.getFieldDecorator(dataIndex, {})(<Select style={{ width: '100%' }} placeholder={'请选择'}
                                                                   onSelect={this.save}>
                      {selectListName2.map(item => {
                        return (
                          <Option title={item.name} key={item.id} value={item.id}>{item.name}</Option>
                        );
                      })}
                    </Select>)}
                  </FormItem>
                ) : dataIndex == 'feils2' ? (
                  <FormItem style={{ margin: 0 }}>
                    {form.getFieldDecorator(dataIndex, {})(<Select style={{ width: '100%' }} placeholder={'请选择'}
                                                                   onSelect={this.save}>
                      {selectListFeild2.map(item => {
                        return (
                          <Option title={item.name} key={item.id} value={item.id}>{item.name}</Option>
                        );
                      })}
                    </Select>)}
                  </FormItem>
                ) : ''
              );
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
      selectedRowKeys: [],
      dataSource: data,
      count: 0,
    };
  }

  handleDelete = (key) => {
    const dataSource = [...this.state.dataSource];
    const { selectedRowKeys } = this.state;
    this.setState({ dataSource: dataSource.filter(item => !selectedRowKeys.includes(item.key)) });
    this.props.transMsg(dataSource.filter(item => !selectedRowKeys.includes(item.key)));
    // this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };

  handleAdd = () => {
    const { count, dataSource } = this.state;
    const { allData } = this.props;
    const newData = {
      key: count,
      name1: allData[0].id,
      feils1: allData[0].selectArray[0].id,
      name2: allData[1].id,
      feils2: allData[1].selectArray[0].id,
    };
    this.setState({
      selectListName1: allData,
      selectListFeild1: allData[0].selectArray[0],
      selectListName2: allData,
      selectListFeild2: allData[0].selectArray[0],
    },()=>{
      this.setState({
        dataSource: [...dataSource, newData],
        count: count + 1,
      });
    });

  };
  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const { needTotalList: list } = this.state;
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }
    this.setState({ selectedRowKeys });
  };
  handleSave = (row) => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.props.transMsg(newData);
    this.setState({ dataSource: newData });
  };

  render() {
    const { dataSource, selectedRowKeys } = this.state;
    const { allData } = this.props;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    this.columns = [
      {
        title: '序号',
        width: '10%',
        render: (text, record, index) => <span>{index + 1}</span>,
      },
      {
        title: '表名',
        dataIndex: 'name1',
        width: '20%',
        // render:(val,text,index)=>{
        //   let name = allData.filter(item=>{
        //     return item.id = val;
        //   })[0].name
        //   return (<span>{name}</span>)
        // },
        //render:val=><span>{selectItemTable&&selectItemTable.filter(item=>{ return item.id ===val})&&
        //selectItemTable.filter(item=>{ return item.id ===val}).length>0&&selectItemTable.filter(item=>{ return item.id ===val})[0].name}</span>,
        editable: true,
      }, {
        title: '字段',
        dataIndex: 'feils1',
        width: '25%',
        // render:(val,text,index)=>{
        //   let name =
        //   allData.filter(item=>{
        //     return item.id = text.name1;
        //   })[0].selectArray.filter(item=>{
        //     return item.id = val;
        //   })[0].name
        //   return (<span>{name}</span>)
        // },
        //render:val=><span>{selectItemFeild&&selectItemFeild.filter(item=>{ return item.id ===val})&&
        //selectItemFeild.filter(item=>{ return item.id ===val}).length>0&&selectItemFeild.filter(item=>{ return item.id ===val})[0].name}</span>,
        editable: true,
      }, {
        title: '表名',
        dataIndex: 'name2',
        width: '20%',
        // render:(val,text,index)=>{
        //   let name = allData.filter(item=>{
        //     return item.id = val;
        //   })[0].name
        //   return (<span>{name}</span>)
        // },
        //render:val=><span>{selectItemTable&&selectItemTable.filter(item=>{ return item.id ===val})&&
        //selectItemTable.filter(item=>{ return item.id ===val}).length>0&&selectItemTable.filter(item=>{ return item.id ===val})[0].name}</span>,
        editable: true,
      }, {
        title: '字段',
        dataIndex: 'feils2',
        width: '25%',
        // render:(val,text,index)=>{
        //   let name =
        //     allData.filter(item=>{
        //       return item.id = text.name2;
        //     })[0].selectArray.filter(item=>{
        //       return item.id = val;
        //     })[0].name
        //   return (<span>{name}</span>)
        // },
        //render:val=><span>{selectItemFeild&&selectItemFeild.filter(item=>{ return item.id ===val})&&
        //selectItemFeild.filter(item=>{ return item.id ===val}).length>0&&selectItemFeild.filter(item=>{ return item.id ===val})[0].name}</span>,
        editable: true,
      }];
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          allData: allData,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    const rowSelection = {
      selectedRowKeys,
      columnWidth: '50px',
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };
    return (
      <div>
        <Row>
          <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
            添加
          </Button>
          <Button onClick={this.handleDelete} style={{ marginBottom: 16, marginLeft: 16 }}>
            删除
          </Button>
        </Row>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          rowKey={'id'}
          size='small'
          rowSelection={rowSelection}
          pagination={false}
          dataSource={dataSource}
          columns={columns}
        />
      </div>
    );
  }
}

export default EditableTable;
