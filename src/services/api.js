import { stringify } from 'qs';
import request from '../utils/request';
import requestToken from '../utils/requestToken';
import requestDown from '../utils/requestDown';

//首页统计
// 获取目录分类数量和目录个数
export async function childNumAndCatalogNum(params) {
  return request(`/dirclassify/childNumAndCatalogNum?${stringify(params)}`);
}
// 统计目录总数
export async function statisticTotal() {
  return request(`/statistic/total`);
}
// 已校核或未校核目录占比
export async function statisticCheck(params) {
  return request(`/statistic/check?${stringify(params)}`);
}

// 查询各分类资源信息总量
export async function dataSourceCount() {
  return request(`/statistic/latestDataSourceCount`);
}
// 查询各分类最近半年资源信息总量
export async function halfYearCount(params) {
  return request(`/statistic/halfYearDataSourceCount?${stringify(params)}`);
}
// 统计衍生库分类
export async function deriveClassifyCount() {
  return request(`/statistic/deriveClassifyCount`);
}
// 衍生库分类资源统计
export async function deriveClassify() {
  return request(`/statistic/deriveCount`);
}

// 组织机构列表
export async function orgList() {
  return request(`/dictionary/orgList`);
}

// 资源分类
// 获取资源分类列表
export async function resourceclassifyList(params) {
  let url = params?`?${stringify(params)}`:'';
  return request(`/resourceclassify/list`+url);
  // return request(`/resourceclassify/list${stringify(params)}`);
}
//生成树状图接口
export async function getAllresourceclassify() {
  return request(`/resourceclassify/all`);
}
// 根据id查询资源分类
export async function getresourceclassify(params) {
  return request(`/resourceclassify/${params.id}`);
}
// 添加资源分类
export async function addresourceclassify(params) {
  return request(`/resourceclassify`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}
// 修改资源分类
export async function updateresourceclassify(params) {
  return request(`/resourceclassify`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}
// 删除资源分类
export async function removeresourceclassify(params) {
  return request('/resourceclassify/'+params.id, {
    method: 'DELETE',
  });
}

//目录库

// 动态获取目录库分类树形图
export async function catalogListTree(params) {
  return request(`/dirclassify/list?${stringify(params)}`);
}
//获取目录库列表
export async function catalogList(params) {
  let url = params?`?${stringify(params)}`:'';
  return request(`/catalog/list`+url);
}
// 根据id查询目录库详情
export async function getcatalog(params) {
  return request(`/catalog/${params.id}`);
}
// 添加目录库和API的关联关系{目录id:[api id集合]}
export async function catalogApi(params) {
  return request(`/catalog/catalogApi`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}
// 添加目录库和非关系型数据库的关联关系{目录id:[表id集合]}
export async function catalogCollection(params) {
  return request(`/catalog/catalogCollection`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

// 添加目录库和文件的关联关系{目录id:[文件id集合]}
export async function catalogFile(params) {
  return request(`/catalog/catalogFile`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}


//查询目录库
export async function querycatalog(params) {
  return request(`/itemField`, {
    method: 'PUT',
    body: {
      ...params,
      method: 'PUT',
    },
  });
}

// 查询操作日志
export async function operateLog(params) {
  return request(`/operate/list?${stringify(params)}`);
}

// 查询非关系型数据库资源详情
export async function catalogTable(params) {
  return request(`/itemField/catalogTable?${stringify(params)}`);
}
// 查询资源详情
export async function catalogTableAndTableField(params) {
  return request(`/itemField/catalogTableAndTableField?${stringify(params)}`);
}
// 查询目录项
export async function querycatalogItem(params) {
  return request(`/itemField/item?${stringify(params)}`);
}
//添加信息项与表字段对应关系
export async function itemField(params) {
  return request(`/itemField/itemField`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
//查询关联的表字段
export async function sourceTableField(params) {
  return request(`/itemField/sourceTableField?${stringify(params)}`);
}
//根据参数生成查询语句查询数据
export async function sourcesql(params) {
  return request(`/itemField/sql?${stringify(params)}`);
}
//查询表的所有字段
export async function tableField(params) {
  return request(`/itemField/tableField?${stringify(params)}`);
}
//查询表间关系
export async function tableRelation(params) {
  return request(`/itemField/tableRelation?${stringify(params)}`);
}
//添加表间关系
export async function addTableRelation(params) {
  return request(`/itemField/tableRelation`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 数据源包括中心数据源模块
//添加数据源
export async function addresource(params) {
  return request(`/datasource`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
//修改数据源
export async function updateresource(params) {
  return request(`/datasource`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}
//根据id查询数据源
export async function getresource(params) {
  return request(`/datasource/`+params.id);
}
//删除数据源
export async function removeresource(params) {
  return request(`/datasource/`+params.id, {
    method: 'DELETE',
  });
}
//api查询
export async function resourceapiData(params) {
  return request(`/datasource/apiData?${stringify(params)}`);
}

// downloadFile
export async function resourcedownload(params) {
  return requestDown(`/datasource/download?${stringify(params)}`);
}
// 查询文件列表
export async function resourcefileLista(params) {
  return request(`/datasource/fileList?${stringify(params)}`);
}

// 临时测试连通性
export async function linkBefore(params) {
  return request(`/datasource/link`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 测试连通性
export async function resourcelink(params) {
  return request(`/datasource/link/${params.id}`);
}
// 同步数据源
export async function sync(params) {
  return request(`/datasource/sync`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}
// 获取数据源列表
export async function resourcelist(params) {
  let url = params?`?${stringify(params)}`:'';
  return request(`/datasource/list`+url);
}
// 查询视图数据
export async function mongoDataList(params) {
  return request(`/datasource/viewDataList`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 查询数据库数据
export async function tableDataList(params) {
  return request(`/datasource/tableDataList?${stringify(params)}`);
}
// 查询数据库表详情和文件
export async function tableList(params) {
  return request(`/datasource/tableList?${stringify(params)}`);
}
// 查询数据库表详情和文件分页
export async function tableListPage(params) {
  return request(`/datasource/tablePageList?${stringify(params)}`);
}
// wsdl查询
export async function wsdlData(params) {
  return request(`/datasource/wsdlData?${stringify(params)}`);
}

//衍生资源分类

// 根据父id获取下级分类
export async function deriveresourceclassifybyid(params) {
  let url = params?`?${stringify(params)}`:'';
  return request(`/deriveresourceclassify/child`+url);
}
// 获取衍生资源分类列表
export async function deriverclassifyList(params) {
  let url = params?`?${stringify(params)}`:'';
  return request(`/deriveresourceclassify/list`+url);
  // return request(`/deriveresourceclassify/list?${stringify(params)}`);
}
// 生成衍生库树状图
export async function getAllderiverlassify(params) {
  return request(`/deriveresourceclassify/all`);
}
// 根据id查询衍生资源分类
export async function getderiverlassify(params) {
  return request(`/deriveresourceclassify/${params.id}`);
}
// 添加衍生资源分类
export async function addderiverclassify(params) {
  return request(`/deriveresourceclassify`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 修改衍生资源分类
export async function updatederiverclassify(params) {
  return request(`/deriveresourceclassify`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}
// 删除衍生资源分类
export async function removederiverclassify(params) {
  return request('/deriveresourceclassify/'+params.id,{
    method: 'DELETE',
  });
}

//衍生库

// 根据id查询衍生库详情
export async function getderivecatalog(params) {
  return request(`/derivecatalog/list`+params.id);
}
// 删除衍生库
export async function removederivecatalog(params) {
  return request(`/derivecatalog/`+params.id, {
    method: 'DELETE',
  });
}

// 添加目录库和API的关联关系
export async function deriveApi(params) {
  return request(`/derivecatalog/deriveApi`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 添加目录库和非关系型数据库的关联关系
export async function deriveCollection(params) {
  return request(`/derivecatalog/deriveCollection`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 添加目录库和文件的关联关系
export async function deriveFile(params) {
  return request(`/derivecatalog/deriveFile`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 添加衍生库信息资源
export async function deriveAdd(params) {
  return request(`/derivecatalog`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 添加衍生库信息资源
export async function deriveField(params) {
  return request(`/derivecatalog/deriveField`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 获取衍生数据库列表
export async function deriveList(params) {
  let url = params?`?${stringify(params)}`:''
  return request(`/derivecatalog/list`+url);
}



export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}


export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  // return request('/api/login/account', {
  //   method: 'POST',
  //   body: params,
  // });
  // return requestToken('http://120.77.155.17:8010/oauth/token', {
  //   method: 'POST',
  //   body: params,
  // });
  return requestToken('/oauth/token', {
    method: 'POST',
    body: params,
  });
  // return requestToken('http://192.168.1.15:8010/oauth/token', {
  //   method: 'POST',
  //   body: params,
  // });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}
