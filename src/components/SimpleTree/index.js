import React, { PureComponent, Fragment } from 'react';
import { Tree, Input, Icon } from 'antd';
import styles from './index.less';


const TreeNode = Tree.TreeNode;
const Search = Input.Search;

const x = 3;
const y = 2;
const z = 1;
const gData = [];

const generateData = (_level, _preKey, _tns) => {
  const preKey = _preKey || '0';
  const tns = _tns || gData;

  const children = [];
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`;
    tns.push({ title: key, key });
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    return tns;
  }
  const level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(level, key, tns[index].children);
  });
};
generateData(z);

const dataList = [];
const generateList = (data) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const key = node.key;
    dataList.push({ key, title: key });
    if (node.children) {
      generateList(node.children, node.key);
    }
  }
};
generateList(gData);

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

class SimpleTree extends PureComponent {
  constructor(props) {
    super(props);
    const { title } = props;
    this.state = {
      title,
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      ss: { width: '220px' },
      open:false
    };
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };
  toggle = (index) => {
    this.setState({
      ss: { width: index?'25px':'220px' },
    });
    this.setState({
      open: !this.state.open,
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

  render() {
    const { searchValue, expandedKeys, autoExpandParent, ss, title ,open} = this.state;
    const { handleTree, data } = this.props;
    let treeData = this.groupTree(data);
    const loop = data => data.map((item) => {
      const title = <span>{item.name}</span>;
      if (item.children) {
        return (
          <TreeNode key={item.id} title={title}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.id} title={title}/>;
    });
    return (
      <div className={styles.tree_back_ground} style={ss}>
        <div className={styles.tree_title}>{!open&&title}
          {open?<Icon
            className={styles.trigger}
            type={'menu-unfold'}
            onClick={()=>{this.toggle(false)}}
          />:<Icon
            className={styles.trigger}
            type={'menu-fold'}
            onClick={()=>{this.toggle(true)}}
          />}
          </div>
        {/*<Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChange} />*/}
        {!open&&<Tree
          onSelect={handleTree}
          onExpand={this.onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
        >
          {loop(treeData)}
        </Tree>}
      </div>
    );
  }
}

export default SimpleTree;
