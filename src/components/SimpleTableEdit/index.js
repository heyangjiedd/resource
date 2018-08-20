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
      selectItemFeild,
      ...restProps
    } = this.props;
    debugger
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
                    initialValue: selectItemFeild[0].id,
                    })(<Select placeholder={'请选择'} onSelect={this.save}>
                      {selectItemFeild.map(item=>{
                        return (
                          <Option title={item.name} value={item.id}>{item.name}</Option>
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
      dataSource: data,
      count:0,
    };
  }
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
  save = (text,record)=>{
    debugger
  }

  render() {
    const { selectItemFeild } = this.props;
    const {dataSource} = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    this.columns = [{
      title: '信息源',
      dataIndex: 'name',
    }, {
      title: '信息源描述',
      dataIndex: 'description',
    },{
      title: '信息源类型',
      dataIndex: 'type',
    },{
      title: '信息源长度',
      dataIndex: 'len',
    }, {
      title: '字段名',
      dataIndex: 'feild_id',
      render:(text,record)=>(<Select style={{width:120,maxHeight:120}} placeholder={'请选择'} onSelect={(text,record)=>{this.save(text,record)}}>
        {selectItemFeild.map(item=>{
          return (
            <Option title={item.name} value={item.id}>{item.name}</Option>
          )
        })}
      </Select>)
    },{
      title: '字段描述',
      dataIndex: 'feild_description',
    },{
      title: '字段类型',
      dataIndex: 'feild_type',
    },{
      title: '字段长度',
      dataIndex: 'feild_len',
    },
    ];
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      debugger
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
