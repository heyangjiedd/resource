import React, { PureComponent, Fragment } from 'react';
import { Table, Alert } from 'antd';
import styles from './index.less';

function initTotalList(columns) {
  const totalList = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

class StandardTable extends PureComponent {
  constructor(props) {
    super(props);
    const { columns, selectedRowKeys } = props;
    const needTotalList = initTotalList(columns);

    this.state = {
      selectedRowKeys: selectedRowKeys || [],
      needTotalList,
    };
  }

  componentWillMount(){
    const { defaultSelectRows } = this.props;
    if(defaultSelectRows&&defaultSelectRows.length > 0){
      this.setState({ selectedRowKeys:defaultSelectRows.map(item=>{
          return item.id
        })});
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log("componentWillReceiveProps");

    if( nextProps.columns && nextProps.selectedRowKeys ) {
      const needTotalList = initTotalList(nextProps.columns);
      this.setState({
        selectedRowKeys: nextProps.selectedRowKeys || [],
        needTotalList,
      });
    }

    // clean state
    // if (nextProps.selectedRows.length === 0) {
    //   const needTotalList = initTotalList(nextProps.columns);
    //   this.setState({
    //     selectedRowKeys: [],
    //     needTotalList,
    //   });
    // } else {
    //   this.setState({
    //     selectedRowKeys: nextProps.selectedRows,
    //   });
    // }
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const { needTotalList: list } = this.state;
    const { onSelectRow } = this.props;
    let needTotalList = [...list];
    needTotalList = needTotalList.map(item => {
      return {
        ...item,
        total: selectedRows.reduce((sum, val) => {
          return sum + parseFloat(val[item.dataIndex], 10);
        }, 0),
      };
    });

    if (onSelectRow) {
      onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys, needTotalList });
  };

  handleTableChange = (pagination, filters, sorter) => {
    console.log("handleTableChange");
    const { onChange } = this.props;
    onChange(pagination, filters, sorter);
  };

  cleanSelectedKeys = () => {
    console.log("cleanSelectedKeys");
    this.handleRowSelectChange([], []);
  };

  render() {
    const { selectedRowKeys, needTotalList } = this.state;
    const {
      data: { list,total,pages,pageSize,pageNum},
      loading,
      columns,
      rowKey,
    } = this.props;
    const pagination = {
      current:pageNum,
      total,
      pageSize,
    };
    const paginationProps = {
      showTotal:(total, range)=>{
        return `当前显示 ${range[0]} 至 ${range[1]} 条 共计 ${total} 条`
      },
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };
    const rowSelection = {
      selectedRowKeys,
      columnWidth:'50px',
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
      type:'radio',
    };

    return (
      <div className={styles.standardTable}>
        <Table
          loading={loading}
          rowKey={rowKey || 'id'}
          size='small'
          rowSelection={rowSelection}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default StandardTable;
