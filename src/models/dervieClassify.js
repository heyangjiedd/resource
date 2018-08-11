import { deriverclassifyList,getderiverlassify,addderiverclassify,updatederiverclassify,removederiverclassify} from '../services/api';

export default {
  namespace: 'dervieClassify',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    //取数据源列表
    *fetch({ payload }, { call, put }) {
      const response = yield call(deriverclassifyList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *get({ payload }, { call, put }) {
      const response = yield call(getderiverlassify, payload);
      yield put({
        type: 'get',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addderiverclassify, payload);
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removederiverclassify, payload);
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updatederiverclassify, payload);
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    get(state, action){
      return {
        ...state,
        treeData: action.payload,
      };
    }
  },
};
