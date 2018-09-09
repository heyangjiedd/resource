import { Table, Input, Button, Popconfirm, Form ,Row,Select} from 'antd';
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
      for(let i in values){
        values[i] = value;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  }

  render() {
    const { editing } = this.state;
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      selectItemTable,
      selectItemFeild,
      ...restProps
    } = this.props;
    let list = title == '表名'?selectItemTable:selectItemFeild;
    return (
      <td ref={node => (this.cell = node)} {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {(form) => {
              this.form = form;
              return (
                editing ? (
                  <FormItem style={{ margin: 0 }}>
                    {form.getFieldDecorator(dataIndex, {
                    initialValue: list[0].id,
                    })(<Select style={{width:'100%'}} placeholder={'请选择'} onSelect={this.save}>
                      {list.map(item=>{
                        return (
                          <Option title={item.name} key={item.id} value={item.id}>{item.name}</Option>
                        )
                      })}
                    </Select>)}
                  </FormItem>
                ) : (
                  <div
                    className="editable-cell-value-wrap"
                    style={{ paddingRight: 24 }}
                    onClick={this.toggleEdit}
                  >
                    {restProps.children}
                  </div>
                )
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
    const {data} = this.props;
    this.state = {
      selectedRowKeys: [],
      dataSource: data,
      count:0,
    };
  }

  handleDelete = (key) => {
    const dataSource = [...this.state.dataSource];
    const { selectedRowKeys } = this.state;
    this.setState({ dataSource: dataSource.filter(item => !selectedRowKeys.includes(item.key)) });
    // this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  }

  handleAdd = () => {
    const { count, dataSource } = this.state;
    const { selectItemTable,selectItemFeild } = this.props;
    const newData = {
      key:count,
      name1:selectItemTable[0].id,
      feils1: selectItemFeild[0].id,
      name2:selectItemTable[0].id,
      feils2: selectItemFeild[0].id,
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  };
  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const { needTotalList: list } = this.state;
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }
    this.setState({ selectedRowKeys});
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
    const { dataSource,selectedRowKeys } = this.state;
    const { selectItemTable,selectItemFeild } = this.props;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    this.columns = [{
      title: '表名',
      dataIndex: 'name1',
      width:'25%',
      render:val=><span>{selectItemTable&&selectItemTable.filter(item=>{ return item.id ===val})&&
      selectItemTable.filter(item=>{ return item.id ===val}).length>0&&selectItemTable.filter(item=>{ return item.id ===val})[0].name}</span>,
      editable: true,
    }, {
      title: '字段',
      dataIndex: 'feils1',
      width:'25%',
      render:val=><span>{selectItemFeild&&selectItemFeild.filter(item=>{ return item.id ===val})&&
      selectItemFeild.filter(item=>{ return item.id ===val}).length>0&&selectItemFeild.filter(item=>{ return item.id ===val})[0].name}</span>,
      editable: true,
    },{
      title: '表名',
      dataIndex: 'name2',
      width:'25%',
      render:val=><span>{selectItemTable&&selectItemTable.filter(item=>{ return item.id ===val})&&
      selectItemTable.filter(item=>{ return item.id ===val}).length>0&&selectItemTable.filter(item=>{ return item.id ===val})[0].name}</span>,
      editable: true,
    }, {
      title: '字段',
      dataIndex: 'feils2',
      width:'25%',
      render:val=><span>{selectItemFeild&&selectItemFeild.filter(item=>{ return item.id ===val})&&
      selectItemFeild.filter(item=>{ return item.id ===val}).length>0&&selectItemFeild.filter(item=>{ return item.id ===val})[0].name}</span>,
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
          selectItemTable:selectItemTable,
          selectItemFeild:selectItemFeild,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    const rowSelection = {
      selectedRowKeys,
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
            <Button onClick={this.handleDelete} style={{ marginBottom: 16,marginLeft: 16 }}>
              删除
            </Button>
        </Row>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          rowKey={'key'}
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
