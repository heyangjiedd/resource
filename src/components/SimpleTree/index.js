import React, { PureComponent, Fragment } from 'react';
import { Tree  } from 'antd';
import styles from './index.less';
const TreeNode = Tree.TreeNode;

class SimpleTree extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps(nextProps) {
    // clean state

  }
  render() {
    return (
      <Tree className={styles.tree_back_ground}
        defaultExpandedKeys={['0-0-0', '0-0-1']}
        defaultSelectedKeys={['0-0-0', '0-0-1']}
        defaultCheckedKeys={['0-0-0', '0-0-1']}
        onSelect={this.onSelect}
        onCheck={this.onCheck}
      >
        <TreeNode title="parent 1" key="0-0">
          <TreeNode title="parent 1-0" key="0-0-0" disabled>
            <TreeNode title="leaf" key="0-0-0-0" disableCheckbox />
            <TreeNode title="leaf" key="0-0-0-1" />
          </TreeNode>
          <TreeNode title="parent 1-1" key="0-0-1">
            <TreeNode title={<span style={{ color: '#1890ff' }}>sss</span>} key="0-0-1-0" />
          </TreeNode>
        </TreeNode>
      </Tree>
    );
  }
}
export default SimpleTree;
