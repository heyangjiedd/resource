import { resourcelist,resourcelink,addresource,updateresource,removeresource,getresource,
  resourceapiData,resourcefileLista,mongoDataList,tableDataList,tableList} from '../services/api';

export default {
  namespace: 'centersource',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    treeData:[],
    dataList:[],
    lifelist:[],
    httpItem:{},
  },

  effects: {
    //取数据源列表
    *fetch({ payload }, { call, put }) {
      const response = yield call(resourcelist, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *get({ payload }, { call, put }) {
      const response = yield call(getresource, payload);
      yield put({
        type: 'getId',
        payload: response,
      });
    },
    *test({ payload, callback }, { call, put }) {
      const response = yield call(resourcelink, payload);
      if (callback) callback(response);
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addresource, payload);
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeresource, payload);
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateresource, payload);
      if (callback) callback();
    },
    *fetchApi({ payload }, { call, put }) {
      const response = yield call(resourceapiData, payload);
      yield put({
        type: 'list',
        payload: response,
      });
    },
    *fetchFile({ payload }, { call, put }) {
      const response = yield call(resourcefileLista, payload);
      yield put({
        type: 'file',
        payload: response,
      });
    },
    *fetchView({ payload }, { call, put }) {
      const response = yield call(mongoDataList, payload);
      yield put({
        type: 'list',
        payload: response,
      });
    },
    *fetchTable({ payload }, { call, put }) {
      const response = yield call(tableList, payload);
      yield put({
        type: 'list',
        payload: response,
      });
    },
    *fetchTableData({ payload }, { call, put }) {
      const response = yield call(tableDataList, payload);
      yield put({
        type: 'list',
        payload: response,
      });
    },
  },

  reducers: {
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
    list(state, action) {
      return {
        ...state,
        dataList: action.payload,
      };
    },
    getId(state, action){
      return {
        ...state,
        httpItem: action.payload,
      };
    }
  },
};
