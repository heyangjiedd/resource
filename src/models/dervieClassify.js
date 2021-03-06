import {
  deriverclassifyList,
  getderiverlassify,
  addderiverclassify,
  updatederiverclassify,
  removederiverclassify,
  getAllderiverlassify,
  deriveresourceclassifybyid,
} from '../services/api';

export default {
  namespace: 'dervieClassify',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    treeData: [],
    child:[],
  },

  effects: {
    * derivechildybyid({ payload }, { call, put }) {
      const response = yield call(deriveresourceclassifybyid, payload);
      yield put({
        type: 'child',
        payload: response,
      });
    },
    //取数据源列表
    * fetch({ payload }, { call, put }) {
      const response = yield call(deriverclassifyList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    * tree({ payload,callback }, { call, put }) {
      const response = yield call(getAllderiverlassify, payload);
      yield put({
        type: 'treeData',
        payload: response,
      });
      if (callback) callback(response);
    },
    * get({ payload }, { call, put }) {
      const response = yield call(getderiverlassify, payload);
      yield put({
        type: 'get',
        payload: response,
      });
    },
    * add({ payload, callback }, { call, put }) {
      const response = yield call(addderiverclassify, payload);
      if (callback) callback(response);
    },
    * remove({ payload, callback }, { call, put }) {
      const response = yield call(removederiverclassify, payload);
      if (callback) callback(response);
    },
    * update({ payload, callback }, { call, put }) {
      const response = yield call(updatederiverclassify, payload);
      if (callback) callback();
    },
  },

  reducers: {
    child(state, action) {
      return {
        ...state,
        child: action.payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    treeData(state, action) {
      return {
        ...state,
        treeData: action.payload,
      };
    },
    get(state, action) {
      return {
        ...state,
        detail: action.payload,
      };
    },
  },
};
