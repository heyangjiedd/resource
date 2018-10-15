export default {
  CASCADER: [
    {
      value: '关系型数据库',
      label: '关系型数据库',
      children: [{
        value: 'mysql', label: 'mysql',
      }, {
        value: 'oracle', label: 'oracle',
      }, {
        value: 'sqlserver', label: 'sqlserver',
      }, {
        value: 'db2', label: 'db2',
      }],
    }, {
      value: '非关系型数据库',
      label: '非关系型数据库',
      children: [{
        value: 'mongo', label: 'MongoDB',
      }, {
        value: 'hbase', label: 'hbase',
      }],
    }, {
      value: 'API',
      label: 'API',
      children: [{
        value: 'http', label: 'http',
      }, {
        value: 'https', label: 'https',
      }, {
        value: 'wsdl', label: 'wsdl',
      }, {
        value: 'rest', label: 'rest',
      }],
    }, {
      value: '普通文件',
      label: '普通文件',
      children: [{
        value: 'ftp', label: 'ftp',
      }, {
        value: 'sftp', label: 'sftp',
      }, {
        value: 'local', label: '本地磁盘',
      }, {
        value: 'share', label: '共享文件夹',
      }],
    }],
  CASCADERTWO:[
    {
      value: 'all',
      label: '全选',
    }, {
      value: '关系型数据库',
      label: '关系型数据库',
      children: [{
        value: 'all', label: '全选',
      }, {
        value: 'mysql', label: 'mysql',
      }, {
        value: 'oracle', label: 'oracle',
      }, {
        value: 'sqlserver', label: 'sqlserver',
      }, {
        value: 'db2', label: 'db2',
      }],
    }, {
      value: '非关系型数据库',
      label: '非关系型数据库',
      children: [{
        value: 'all', label: '全选',
      }, {
        value: 'mongo', label: 'MongoDB',
      }, {
        value: 'hbase', label: 'hbase',
      }],
    }],
};
