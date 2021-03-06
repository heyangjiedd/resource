import {
  resourcelist, resourcelink, addresource, updateresource, removeresource, getresource,sync,
  resourceapiData, resourcefileLista, mongoDataList, tableDataList, tableList, tableListPage, orgList, resourcedownload,
  linkBefore,
} from '../services/api';

export default {
  namespace: 'centersource',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    treeData: [],
    dataList: [],
    dataListPage: [],
    lifelist: {
      list: [],
      pagination: {},
    },
    httpItem: {},
    orgList: [],
    sqlList: [],
    down: '',
  },

  effects: {
    //下载文件
    * download({ payload, callback }, { call, put }) {
      const response = yield call(resourcedownload, payload);
      yield put({
        type: 'down',
        payload: response,
      });
      if (callback) callback(response);
    },
    * fetchOrgList({ payload, callback }, { call, put }) {
      const response = yield call(orgList);
      yield put({
        type: 'org',
        payload: response,
      });
      if (callback) callback(response);
    },
    //取数据源列表
    * fetch({ payload }, { call, put }) {
      const response = yield call(resourcelist, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    * get({ payload }, { call, put }) {
      const response = yield call(getresource, payload);
      yield put({
        type: 'getId',
        payload: response,
      });
    },
    * test({ payload, callback }, { call, put }) {
      const response = yield call(resourcelink, payload);
      if (callback) callback(response);
    },
    * sync({ payload, callback }, { call, put }) {
      const response = yield call(sync, payload);
      if (callback) callback(response);
    },
    * testBefore({ payload, callback }, { call, put }) {
      const response = yield call(linkBefore, payload);
      if (callback) callback(response);
    },
    * add({ payload, callback }, { call, put }) {
      const response = yield call(addresource, payload);
      if (callback) callback();
    },
    * remove({ payload, callback }, { call, put }) {
      const response = yield call(removeresource, payload);
      if (callback) callback( response );
    },
    * update({ payload, callback }, { call, put }) {
      const response = yield call(updateresource, payload);
      if (callback) callback();
    },
    * fetchApi({ payload }, { call, put }) {
      const response = yield call(resourceapiData, payload);
      yield put({
        type: 'list',
        payload: response,
      });
    },
    * fetchFile({ payload }, { call, put }) {
      const response = yield call(resourcefileLista, payload);
      yield put({
        type: 'file',
        payload: response,
      });
    },
    * fetchView({ payload, callback }, { call, put }) {
      const response = yield call(mongoDataList, payload);
      yield put({
        type: 'sqlList',
        payload: response,
      });
      if (callback) callback();
    },
    * fetchViewSetNull({ payload, callback }, { call, put }) {
      yield put({
        type: 'sqlList',
        payload: { data: {} },
      });
      if (callback) callback();
    },
    * fetchTable({ payload,callback }, { call, put }) {
      const response = yield call(tableList, payload);
      yield put({
        type: 'list',
        payload: response,
      });
      if (callback) callback(response);
    },
    * fetchTablePage({ payload }, { call, put }) {
      const response = yield call(tableListPage, payload);
      yield put({
        type: 'listpage',
        payload: response,
      });
    },
    * fetchTableData({ payload }, { call, put }) {
      const response = yield call(tableDataList, payload);
      yield put({
        type: 'sqlList',
        payload: response,
      });
    },
  },

  reducers: {
    down(state, action) {
      return {
        ...state,
        down: action.payload,
      };
    },
    org(state, action) {
      return {
        ...state,
        orgList: action.payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    file(state, action) {
      return {
        ...state,
        lifelist: action.payload,
      };
    },
    sqlList(state, action) {
      return {
        ...state,
        sqlList: action.payload.data.data || [],
      };
    },
    list(state, action) {
      return {
        ...state,
        dataList: action.payload,
      };
    },
    listpage(state, action) {
      return {
        ...state,
        dataListPage: action.payload,
      };
    },
    getId(state, action) {
      return {
        ...state,
        httpItem: action.payload,
      };
    },
  },
};
