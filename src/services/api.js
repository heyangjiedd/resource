import { stringify } from 'qs';
import request from '../utils/request';
import requestToken from '../utils/requestToken';

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
//获取目录库列表
export async function catalogList(params) {
  return request(`/catalog/list?${stringify(params)}`);
}
// 根据id查询目录库详情
export async function getcatalog(params) {
  return request(`/catalog/${params.id}`);
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

// 修改关联的表字段
export async function catalogTableAndTableField(params) {
  return request(`/itemField/catalogTableAndTableField`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
// 查询资源详情
export async function catalogTableField(params) {
  return request(`/itemField/catalogTableField?${stringify(params)}`);
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
      method: 'post',
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
  return request(`/datasource/${params.id}`);
}
//删除数据源
export async function removeresource(params) {
  return request(`/datasource/${stringify(params.id)}`, {
    method: 'DELETE',
  });
}
//api查询
export async function resourceapiData(params) {
  return request(`/datasource/apiData?${stringify(params)}`);
}
// downloadFile
export async function resourcedownload(params) {
  return request(`/datasource/download?${stringify(params)}`);
}
// 查询文件列表
export async function resourcefileLista(params) {
  return request(`/datasource/fileList?${stringify(params)}`);
}
// 测试连通性
export async function resourcelink(params) {
  return request(`//datasource/link/${params.id}`);
}
// 获取数据源列表
export async function resourcelist(params) {
  let url = params?`?${stringify(params)}`:'';
  return request(`/datasource/list`+url);
}
// 查询视图数据
export async function mongoDataList(params) {
  return request(`/datasource/mongoDataList`, {
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

// wsdl查询
export async function wsdlData(params) {
  return request(`/datasource/wsdlData?${stringify(params)}`);
}

//衍生资源分类

// 获取衍生资源分类列表
export async function deriverclassifyList(params) {
  let url = params?`?${stringify(params)}`:'';
  return request(`/deriveresourceclassify/list`+url);
  // return request(`/deriveresourceclassify/list?${stringify(params)}`);
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
  return request(`/deriveresourceclassify/${stringify(params.id)}`, {
    method: 'DELETE',
  });
}

//衍生库

// 添加衍生库
export async function addderive(params) {
  return request(`/derive`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
// 删除衍生库
export async function removederive(params) {
  return request(`/derive/${stringify(params.id)}`, {
    method: 'DELETE',
    body: {
      method: 'delete',
    },
  });
}
// 获取衍生数据库列表
export async function deriveList(params) {
  return request(`/derive/list?${stringify(params)}`);
}
// 获取衍生数据库所有的库
export async function tableAndTableField(params) {
  return request(`/derive/tableAndTableField?${stringify(params)}`);
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
  return requestToken('http://120.77.155.17:8010/oauth/token', {
    method: 'POST',
    body: params,
  });
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
