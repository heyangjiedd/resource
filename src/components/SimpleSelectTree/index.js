import React, { PureComponent, Fragment } from 'react';
import { Tree, Input, Icon,TreeSelect  } from 'antd';
import styles from './index.less';
import { connect } from 'dva/index';

const TreeNode = TreeSelect.TreeNode;
@connect(({ classify, loading }) => ({
  classify,
  loading: loading.models.classify,
}))
class SimpleTree extends PureComponent {
  constructor(props) {
    super(props);
    const { title } = props;
    this.state = {
      title,
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      value: undefined,
      treeData:[]
    };
  }
  componentDidMount() {
    const { dispatch,url ,defaultValue} = this.props;
    dispatch({
      type:url,
      callback: (list) => {
        this.setState({
          treeData:list,
          value:defaultValue,
        });
      }
    });
  }
  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };
  groupTree = (data) => {
    let result = [];
    let tree = data.map(item=>{
      return {...item}
    });
    for (let i = 0; i < tree.length; i++) {
      if (tree[i].parentId) {
        for (let j = 0; j < tree.length; j++) {
          if (tree[j].id === tree[i].parentId) {
            tree[j].children || (tree[j].children = []);
            tree[j].children.push(tree[i]);
          }
        }
      } else {
        result.push(tree[i]);
      }
    }
    ;
    return result;
  };
  onChange = (value) => {
    this.props.transMsg(value);
    this.setState({ value });
  };

  render() {
    const { expandedKeys, autoExpandParent,treeData } = this.state;
    const { handleTree } = this.props;
    let data = this.groupTree(treeData);
    const loop = data => data.map((item) => {
      const title = <span>{item.name}</span>;
      if (item.children) {
        return (
          <TreeNode key={item.id} title={item.name} value={item.id}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.id} title={item.name} value={item.id}/>;
    });

    return (
      <div className={styles.tree_back_ground}>
        <TreeSelect
          style={{ width: 300 }}
          value={this.state.value}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          placeholder="请选择资源分类"
          allowClear
          treeDefaultExpandAll
          onChange={this.onChange}
        >
          {loop(data)}
        </TreeSelect>
      </div>
    );
  }
}

export default SimpleTree;
